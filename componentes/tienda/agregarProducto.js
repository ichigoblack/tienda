import Loading from '../loading'
import {map,size,filter,isEmpty} from 'lodash'
import {useNavigation} from '@react-navigation/native'
import React,{useRef,useState,useReducer} from 'react'
import {cargarImagenesxAspecto} from '../../utils/utils'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {Icon,Image,Input,Avatar,Button,AirbnbRating} from 'react-native-elements'
import {Alert,Text,View,ScrollView,StyleSheet,TouchableOpacity} from 'react-native'

export default function agregarProducto(){
    
    const btnref = useRef()
    const [rating, setrating] = useState(5)
    const [titulo, settitulo] = useState("")
    const [precio, setprecio] = useState(0.0)
    const [errores, seterrores] = useState({})
    const [imagenes, setimagenes] = useState([])
    const [loading, setloading] = useState(false)
    const [categoria, setcategoria] = useState("")
    const [descripcion, setdescripcion] = useState("")

    const addProducto = async () => {
        seterrores({})
        if (isEmpty(titulo)) {
            seterrores({ titulo: "El campo título es obligatorio" })
        }else if (isEmpty(descripcion)) {
            seterrores({ descripcion: "El campo descripcion es obligatorio" })
        }else if (!parseFloat(precio) > 0) {
            seterrores({ precio: "Introduzca un precio para el producto" })
        }else if (isEmpty(categoria)) {
            Alert.alert(
                "Seleccione Categoría",
                "Favor seleccione una categoría para el producto o servicio",
                [{
                    style: "cancel",
                    text: "Entendido",
                }]
            )
        }else if (isEmpty(imagenes)) {
            Alert.alert(
                "Seleccione Imagenes",
                "Favor seleccione una imagen para su producto o servicio",
                [{
                    style: "cancel",
                    text: "Entendido",
                }]
            )
        }else{
            console.log("vamos bien")
        }
    }
    
    return(
        <KeyboardAwareScrollView style={styles.container}>
            <View  style={styles.containerInterior}/>
            <Input
                placeholder="Título"
                inputStyle={styles.input}
                errorMessage={errores.titulo}
                onChangeText={(text) => settitulo(text)}
            />
            <Input
                multiline={true}
                placeholder="Descripcion"
                inputStyle={styles.textarea}
                errorMessage={errores.descripcion}
                onChangeText={(text) => setdescripcion(text)}
            />
            <Input
                placeholder="Precio"
                keyboardType="numeric"
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
                title="Agregar Nuevo Producto"
                buttonStyle={styles.btnaddnew}
                ref={btnref}
                onPress={addProducto}
            />
            <Loading isVisible={loading} text="Favor espere" />
        </KeyboardAwareScrollView>
    )

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
            <ScrollView
                style={styles.viewimagenes}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                {size(imagenes) < 5 && (
                    <Icon
                        type="material-community"
                        name="plus"
                        color="#7a7a7a"
                        containerStyle={styles.containerIcon}
                        onPress={async () => {
                            const resultado = await cargarImagenesxAspecto([1, 1])
                            console.log(resultado)
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
                        onPress={() => {
                            removerimagen(imagen)
                        }}
                    />
                ))}
            </ScrollView>
        )
    }

    function Botonera(props) {
        const { categoria, setcategoria } = props
        return (
            <View style={styles.botonera}>
                <TouchableOpacity
                    style={styles.btncategoria}
                    onPress={() => {
                        setcategoria("libros")
                    }}
                >
                    <Icon
                        type="material-community"
                        name="book-open"
                        size={24}
                        color={categoria === "libros" ? "#128c7e" : "#757575"}
                        reverse
                    />
                    <Text>Libros</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btncategoria}
                    onPress={() => {
                        setcategoria("ideas")
                    }}
                >
                    <Icon
                        type="material-community"
                        name="lightbulb-on-outline"
                        size={24}
                        color={categoria === "ideas" ? "#128c7e" : "#757575"}
                        reverse
                    />
                    <Text>Ideas</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btncategoria}
                    onPress={() => {
                        setcategoria("articulos")
                    }}
                >
                    <Icon
                        type="material-community"
                        name="cart-arrow-down"
                        size={24}
                        color={categoria === "articulos" ? "#128c7e" : "#757575"}
                        reverse
                    />
                    <Text>Artículos</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btncategoria}
                    onPress={() => {
                        setcategoria("servicios")
                    }}
                >
                    <Icon
                        type="material-community"
                        name="account"
                        size={24}
                        color={categoria === "servicios" ? "#128c7e" : "#757575"}
                        reverse
                    />
                    <Text>Servicios</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        margin: 5,
        padding: 5,
        elevation: 3,
        borderRadius: 50,
        backgroundColor: "#fff",
    },
    containerInterior:{
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
      fontFamily: "Roboto",
      textAlign: "center",
      fontWeight: "bold",
      color: "#075e54",
    },
    btnaddnew: {
      backgroundColor: "#128c7e",
      marginTop: 20,
      marginBottom: 40,
      marginHorizontal: 20,
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
        padding: 10,
        height: 150,
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    },
    btncategoria: {
        justifyContent: "center",
        alignItems: "center",
    },
})