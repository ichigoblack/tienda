import {size} from 'lodash'
import Modal from '../Modal'
import Detalle from './detalle'
import Busqueda from '../busqueda'
import React,{useState,useEffect,useCallback} from 'react'
import {Icon,Badge,Image,Avatar,Rating} from 'react-native-elements'
import {useNavigation,useFocusEffect} from '@react-navigation/native'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {Text,View,FlatList,StatusBar,Dimensions,StyleSheet,TouchableOpacity,} from 'react-native'
import {Buscar,ObtenerUsuario,ListarProductos,ListarNotificaciones,listarProductosxCategoria} from '../../utils/acciones'


export default function Market() {
    
    const navigation = useNavigation()
    //const {photoURL} = ObtenerUsuario()
    const [search, setsearch] = useState("")
    const [categoria, setcategoria] = useState("")
    const [productlist, setproductlist] = useState([])
    const [mensajes, setmensajes] = useState("Cargando...")
    const [notificaciones, setnotificaciones] = useState(0)

    const [showModal, setShowModal] = useState(false)
    const [renderComponent, setRenderComponent] = useState(null)

    const photo={
        foto:require("../../assets/avatar.jpg")
    }

    useEffect(()=>{
        (async()=>{
            setproductlist(await ListarProductos())
        })()
    },[])

    useFocusEffect(
        useCallback(() => {
            (async () => {
                setnotificaciones(0)
                setproductlist(await ListarProductos())
                const consulta = await ListarNotificaciones()
                if (consulta.statusresponse) {
                    setnotificaciones(size(consulta.data))
                }
            })()
        }, [])
    )

    const cargarFiltroxCategoria = async (categoria) => {
        const listaproductos = await listarProductosxCategoria(categoria)
        setproductlist(listaproductos)
        if (listaproductos.length === 0) {
            setmensajes("No se encontraron datos para la categoría " + categoria)
        }
    }
    
    const actualizarProductos = async () => {
        setproductlist(await ListarProductos())
    }

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <KeyboardAwareScrollView>
                    <View style={styles.menu}>
                        <Image
                            source={photo.foto}
                            style={styles.logo}
                        />
                        <Text style={{fontSize:24}}>Mi Tienda</Text>
                        <View style={{marginLeft:30,flexDirection: "row"}}>
                            <Icon
                                size={35}
                                color="#fff"
                                name="bell-outline"
                                type="material-community"
                                style={{marginRight:20}}
                                //onPress={() => {navigation.navigate("mensajes")}}
                            />
                            <Badge
                                status="error"
                                value={2}
                                containerStyle={{ position: "absolute", top: -4, right: -10 }}
                            />
                            <Icon
                                size={35}
                                color="#fff"
                                name="cart-outline"
                                type="material-community"
                                //onPress={() => {navigation.navigate("mensajes")}}
                            />
                            <Badge
                                status="error"
                                value={4}
                                containerStyle={{ position: "absolute", top: -4, right: 53 }}
                            />
                        </View>
                    </View>          
                    <Busqueda
                        search={search}
                        setsearch={setsearch}
                        setmensajes={setmensajes}
                        setproductlist={setproductlist}
                        actualizarProductos={actualizarProductos}
                    />
                </KeyboardAwareScrollView>
            </View>
            <View style={styles.categoriaview}>
                <View style={styles.titulocategoria}>
                    <Text style={styles.categoriatext}> - CATEGORIAS - </Text>
                    {categoria.length > 0 && (
                        <TouchableOpacity
                            onPress={() => {
                                setcategoria("")
                                actualizarProductos()
                            }}
                        >
                            <Icon
                                reverse
                                size={10}
                                color="red"
                                name="close"
                                type="material-community"
                            />
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.categorialist}>
                    <BotonCategoria
                        texto="Libros"
                        categoria={categoria}
                        categoriaboton="libros"
                        icon="book-open-outline"
                        setcategoria={setcategoria}
                        cargarFiltroxCategoria={cargarFiltroxCategoria}
                    />
                    <BotonCategoria
                        texto="Ideas"
                        categoria={categoria}
                        categoriaboton="ideas"
                        icon="lightbulb-on-outline"
                        setcategoria={setcategoria}
                        cargarFiltroxCategoria={cargarFiltroxCategoria}
                    />
                    <BotonCategoria
                        texto="Artículos"
                        categoria={categoria}
                        icon="cart-arrow-down"
                        categoriaboton="articulos"
                        setcategoria={setcategoria}
                        cargarFiltroxCategoria={cargarFiltroxCategoria}
                    />
                    <BotonCategoria
                        texto="Servicios"
                        categoria={categoria}
                        icon="account-outline"
                        categoriaboton="servicios"
                        setcategoria={setcategoria}
                        cargarFiltroxCategoria={cargarFiltroxCategoria}
                    />
                </View>
            </View>
            {size(productlist)>0 ? (
                <FlatList
                    data={productlist}
                    renderItem={(producto)=>(
                        <Producto
                            producto={producto} 
                            navigation={navigation}
                            showModal={showModal}
                            setShowModal={setShowModal}
                            renderComponent={renderComponent}
                            setRenderComponent={setRenderComponent}
                        />
                    )}
                    keyExtractor={(item,index)=>index.toString}
                />
            ):(
            <Text>{mensajes}</Text>
            )}
            {renderComponent && (
              <Modal isVisible={showModal} setIsVisible={setShowModal}>
                {renderComponent}
              </Modal>
            )}
        </View>
    )
}

function Producto(props) {
    const {producto,navigation} = props
    const {id,precio,rating,titulo,usuario,imagenes,descripcion,showModal,setShowModal,renderComponent,setRenderComponent} = producto.item

    const detalle = async () => {
        await setRenderComponent(
            <Detalle producto={producto}/>
        )
        setShowModal(true)
    }
    
    return (
        <>
            <TouchableOpacity
                style={styles.card}
                onPress={detalle}
            >
                <Image source={{ uri: imagenes[0] }} style={styles.imgproducto} />
                <View style={styles.infobox}>
                    <Text style={styles.titulo}>{titulo}</Text>
                    <Text style={{ textAlign: "center" }}>
                        {descripcion.substring(0, 50)}
                    </Text>
                    <Rating
                        readonly
                        imageSize={15}
                        startingValue={rating}
                        style={{ paddingLeft: 40 }}
                    />
                    <Text style={styles.precio}>${precio}</Text>
                </View>
            </TouchableOpacity>
        </>
    )
}

function BotonCategoria(props) {
    const {icon,texto,categoria,setcategoria,categoriaboton,cargarFiltroxCategoria} = props
    return (
        <TouchableOpacity
            style={
                categoria === categoriaboton
                    ? styles.categoriahover
                    : styles.categoriabtn
                }
                onPress={() => {
                    setcategoria(categoriaboton)
                    cargarFiltroxCategoria(categoriaboton)
                }
            }
        >
            <Icon
                size={30}
                name={icon}
                type="material-community"
                color={categoria === categoriaboton ? "#fff" : "#128c7e"}
            />
            <Text
                style={
                    categoria === categoriaboton ? styles.cattxthover : styles.cattxt
                }
            >
                {texto}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: "20%",
        width: "100%",
        backgroundColor: "#128c7e",
    },
    menu: {
        marginTop: 20,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-around",
    },
    logo: {
        width: 70,
        height: 70,
    },
    card: {
        flex: 1,
        width: "100%",
        marginHorizontal: 5,
        paddingVertical: 20,
        alignItems: "center",
        flexDirection: "row",
        borderBottomWidth: 1,
        paddingHorizontal: 10,
        justifyContent: "center",
        borderBottomColor: "#128c7e",
    },
    imgproducto: {
        width: 150,
        height: 200,
        borderRadius: 10,
    },
    infobox: {
        flex: 1,
        paddingLeft: 10,
        alignItems: "center",
    },
    titulo: {
        fontSize: 18,
        marginTop: 10,
        color: "#075e54",
        fontWeight: "700",
        textAlign: "center",
    },
    vendidopor: {
        fontSize: 16,
        marginTop: 5,
        color: "#075e54",
        fontWeight: "700",
    },
    avatarbox: {
        marginTop: 5,
        alignItems: "center",
        flexDirection: "row",
    },
    avatar: {
        width: 30,
        height: 30,
    },
    precio: {
        fontSize: 24,
        marginTop: 10,
        color: "#128c7e",
        fontWeight: "bold",
        alignSelf: "center",
    },
    categoriahover: {
        width: 80,
        height: 80,
        elevation: 1,
        borderRadius: 40,
        shadowOpacity: 0.5,
        shadowColor: "#000",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#25d366",
        shadowOffset: {width: 7.0,height: -8.0,},
    },
    categoriabtn: {
        width: 80,
        height: 80,
        elevation: 1,
        borderRadius: 40,
        shadowOpacity: 0.5,
        shadowColor: "#000",
        alignItems: "center",
        backgroundColor: "#fff",
        justifyContent: "center",
        shadowOffset: {width: 7.0,height: -8.0,},
    },
    cattxthover: {
        fontSize: 12,
        color: "#fff",
        fontStyle: "italic",
    },
    cattxt: {
        fontSize: 12,
        color: "#128C7E",
        fontStyle: "italic",
    },
    categoriaview: {
        marginTop: 10,
    },
    titulocategoria: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },
    categoriatext: {
        fontSize: 14,
        color: "#128c7e",
        fontWeight: "bold",
    },
    categorialist: {
        width: "100%",
        paddingTop: 5,
        flexDirection: "row",
        justifyContent: "space-around",
    },
})