import {map,size,filter,isEmpty} from 'lodash'
import Loading from '../../componentes/loading'
import {useNavigation} from '@react-navigation/native'
import React, {useRef,useState,useEffect} from 'react'
import {cargarImagenesxAspecto} from '../../utils/utils'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {Icon,Image,Input,Avatar,Button,AirbnbRating} from 'react-native-elements'
import {Text,View,Alert,ScrollView,StyleSheet,TouchableOpacity} from 'react-native'
import {ObtenerUsuario,eliminarImagenes,
        verificarImagenes,actualizarRegistro,
        obternerRegistroxID,subirEditarImagenesBatch,
        verificarImagenesEliminar} from '../../utils/acciones'
                       
export default function EditarProducto(props) {

    const {route} = props
    const btnref = useRef()
    const {id} = route.params
    const navigation = useNavigation()
    const [rating, setrating] = useState(5)
    const [titulo, settitulo] = useState("")
    const [precio, setprecio] = useState("0.0")
    const [errores, seterrores] = useState({})
    const [imagenes, setimagenes] = useState([])
    const [loading, setloading] = useState(false)
    const [imagenesR, setimagenesR] = useState([])
    const [categoria, setcategoria] = useState("")
    const [descripcion, setdescripcion] = useState("")

    useEffect(() => {
        (async () => {
            const response = await obternerRegistroxID("productos", id)
            const {data} = response
            setprecio(data.precio.toString())
            setrating(data.rating)
            settitulo(data.titulo)
            setimagenes(data.imagenes)
            setimagenesR(data.imagenes)
            setcategoria(data.categoria)
            setdescripcion(data.descripcion)
        })()
    }, [])

    const editProducto = async () => {
        seterrores({})
        if (isEmpty(titulo)) {
            seterrores({ titulo: "El campo título es obligatorio" })
        } else if (isEmpty(descripcion)) {
            seterrores({ descripcion: "El campo descripcion es obligatorio" })
        } else if (!parseFloat(precio) > 0) {
            seterrores({ precio: "Introduzca un precio para el producto" })
        } else if (isEmpty(categoria)) {
            Alert.alert(
                "Seleccione Categoría",
                "Favor seleccione una categoría para el producto o servicio",
                [{
                    style: "cancel",
                    text: "Entendido",
                }]
            )
        } else if (isEmpty(imagenes)) {
            Alert.alert(
                "Seleccione Imagenes",
                "Favor seleccione una imagen para su producto o servicio",
                [{
                    style: "cancel",
                    text: "Entendido",
                }]
            )
        } else {
            setloading(true)
            const urlimagenes = await verificarImagenes(imagenesR,imagenes)
            const urlSubirImagenes = await subirEditarImagenesBatch(urlimagenes,"productos")
            const urlimagenesEliminar = await verificarImagenesEliminar(imagenesR,urlSubirImagenes)
            await eliminarImagenes("productos", urlimagenesEliminar)
            const producto = {
                precio,
                rating,
                titulo,
                categoria,
                descripcion,
                imagenes: urlSubirImagenes,
                usuario: ObtenerUsuario().uid,
            }
            await actualizarRegistro("productos",id,producto)
            .then((result) => {
                setloading(false)
                Alert.alert(
                    "Actualización completa",
                    "El producto se ha actualizado correctamente",
                    [{
                        style: "cancel",
                        text: "Aceptar",
                        onPress: () => navigation.navigate("mitienda"),
                    }]
            )})
            .catch((err) => {
                setloading(false)
                Alert.alert(
                    "Actualización Fallida",
                    "Ha ocurrido un error al actualizar producto",
                    [{
                        style: "cancel",
                        text: "Aceptar",
                    }]
                )
            })
        }
    }

    return (
        <KeyboardAwareScrollView style={styles.container}>
            <View style={styles.containerProducto}/>
            <Input
                value={titulo}
                placeholder="Título"
                inputStyle={styles.input}
                errorMessage={errores.titulo}
                onChangeText={(text) => settitulo(text)}
            />
            <Input
                multiline={true}
                value={descripcion}
                placeholder="Descripcion"
                inputStyle={styles.textarea}
                errorMessage={errores.descripcion}
                onChangeText={(text) => setdescripcion(text)}
            />
            <Input
                placeholder="Precio"
                keyboardType="decimal-pad"
                value={precio}
                inputStyle={styles.input}
                errorMessage={errores.precio}
                onChangeText={(text) => setprecio(parseFloat(text))}
            />
            <Text style={styles.txtlabel}>Calidad del Producto o Servicio</Text>
            <AirbnbRating
                size={35}
                count={5}
                defaultRating={5}
                onFinishRating={(value) => {setrating(value)}}
                reviews={["Baja", "Deficiente", "Normal", "Muy Bueno", "Excelente"]}
            />
            <Text style={styles.txtlabel}>Cargar Imágenes</Text>
            <SubirImagenes imagenes={imagenes} setimagenes={setimagenes} />
            <Text style={styles.txtlabel}>Asignar Categoria</Text>
            <Botonera categoria={categoria} setcategoria={setcategoria} />
            <Button
                ref={btnref}
                onPress={editProducto}
                title="Editar Producto"
                buttonStyle={styles.btnaddnew}
            />
            <Loading isVisible={loading} text="Favor espere" />
        </KeyboardAwareScrollView>
    )
}

function SubirImagenes(props) {
    const { imagenes, setimagenes } = props
    const removerimagen = (imagen) => {
        Alert.alert(
            "Eliminar Imagen",
            "¿Estás Seguro de que quieres eliminar la imagen ?",
            [{
                text: "Cancelar",
                style: "cancel",
            },{
                text: "Eliminar",
                onPress: () => {
                    setimagenes(filter(imagenes, (imagenURL) => imagenURL !== imagen))
                },
            }]
        )
    }

    return (
        <ScrollView horizontal={true} style={styles.viewimagenes} showsHorizontalScrollIndicator={false}>
            {size(imagenes) < 5 && (
                <Icon
                    name="plus"
                    color="#7a7a7a"
                    type="material-community"
                    containerStyle={styles.containerIcon}
                    onPress={async () => {
                        const resultado = await cargarImagenesxAspecto([1, 1])
                        if (resultado.status) {
                            setimagenes([...imagenes, resultado.imagen])
                        }
                    }}
                />
            )}
            {map(imagenes, (imagen, index) => (
                <Avatar
                    key={index}
                    style={styles.miniatura}
                    source={{ uri: imagen }}
                    onPress={() => {removerimagen(imagen)}}
                />
            ))}
        </ScrollView>
    )
}

function Botonera(props) {
    const { categoria, setcategoria } = props
    return (
        <View style={styles.botonera}>
        <TouchableOpacity style={styles.btncategoria} onPress={() => {setcategoria("libros")}}>
            <Icon
                reverse
                size={24}
                name="book-open"
                type="material-community"
                color={categoria === "libros" ? "#128c7e" : "#757575"}
                
            />
            <Text>Libros</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btncategoria} onPress={() => {setcategoria("ideas")}}>
            <Icon
                reverse
                size={24}
                type="material-community"
                name="lightbulb-on-outline"
                color={categoria === "ideas" ? "#128c7e" : "#757575"}      
            />
            <Text>Ideas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btncategoria} onPress={() => {setcategoria("articulos")}}>
            <Icon
                reverse
                size={24}
                name="cart-arrow-down"
                type="material-community"
                color={categoria === "articulos" ? "#128c7e" : "#757575"}
            />
            <Text>Artículos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btncategoria} onPress={() => {setcategoria("servicios")}}>
            <Icon
                reverse
                size={24}
                name="account"
                type="material-community"
                color={categoria === "servicios" ? "#128c7e" : "#757575"}
            />
            <Text>Servicios</Text>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 5,
        padding: 5,
        elevation: 3,
        borderRadius: 50,
        backgroundColor: "#fff",
    },
    containerProducto: {
        width: 100,
        marginTop: 20,
        alignSelf: "center",
        borderBottomWidth: 2,
        borderBottomColor: "#25D366",
    },
    input: {
        height: 50,
        width: "90%",
        marginTop: 20,
        borderRadius: 10,
        paddingHorizontal: 20,
        borderColor: "#707070",
    },
    textarea: {
        height: 150,
    },
    txtlabel: {
        fontSize: 20,
        color: "#075e54",
        fontWeight: "bold",
        textAlign: "center",
        fontFamily: "Roboto",
    },
    btnaddnew: {
        marginTop: 20,
        marginBottom: 40,
        marginHorizontal: 20,
        backgroundColor: "#128c7e",
    },
    viewimagenes: {
        flex: 1,
        marginTop: 30,
        marginBottom: 10,
        flexDirection: "row",
        marginHorizontal: 20,
    },
    containerIcon: {
        width: 100,
        height: 150,
        padding: 10,
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#e3e3e3",
    },
    miniatura: {
        width: 100,
        height: 150,
        marginRight: 10,
    },
    botonera: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-around",
    },
    btncategoria: {
        alignItems: "center",
        justifyContent: "center",
    },
})