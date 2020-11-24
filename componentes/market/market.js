import {map,size} from 'lodash'
import Modal from '../Modal'
import Detalle from './detalle'
import Busqueda from '../busqueda'
import {useFocusEffect} from '@react-navigation/native'
import {Icon,Badge,Image,Rating} from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage'
import React,{useRef,useState,useEffect,useCallback} from 'react'
import Menu,{MenuItem,MenuDivider} from 'react-native-material-menu'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {Text,View,FlatList,StatusBar,Dimensions,StyleSheet,TouchableOpacity,} from 'react-native'
import {Buscar,ObtenerUsuario,obtenerDatosUsuario,ListarProductos,ListarNotificaciones,listarProductosxCategoria} from '../../utils/acciones'

//import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

export default function Market() {
    
    const menu = useRef()
    const usuario = ObtenerUsuario()
    const [inf, setInf] = useState(null)
    const [total, setTotal] = useState(0)
    const [search, setsearch] = useState("")
    const [categoria, setcategoria] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [listProduct, setListProduct] = useState([])
    const [productlist, setproductlist] = useState([])
    const [mensajes, setmensajes] = useState("Cargando...")
    const [notificaciones, setnotificaciones] = useState(0)
    const [notificacionesCompra, setnotificacionesCompra] = useState(0)

    const hideMenu = () => menu.current.hide()
    const showMenu = () => menu.current.show()

    const photo={
        foto:require("../../assets/avatar.jpg")
    }

    const product = 'producto'

    useEffect(()=>{
        (async()=>{
            console.log("useEffect")
            //getAllData()
            readData(product)
            setproductlist(await ListarProductos())
            await obtenerDatosUsuario(usuario.uid)
            .then((result) => {
                setInf(result)
             })
             .catch((err) => {
                console.log("err",err)
             })
        })()
    },[])

    useFocusEffect(
        useCallback(() => {
            (async () => {
                console.log("useFocusEffect")
                setnotificaciones(0)
                setproductlist(await ListarProductos())
                const consulta = await ListarNotificaciones()
                if (consulta.statusresponse) {
                    setnotificaciones(size(consulta.data))
                }
            })()
        }, [])
    )

    const readData = async (clave) => {
        try {
            await AsyncStorage.getItem(clave)
            .then((result) => {
                console.log("readData",result)
                setListProduct(JSON.parse(result))
                setTotal(JSON.parse(result).length)
                //console.log("lista",JSON.parse(result).length)

               /* map(JSON.parse(result), async (image) => {
                    console.log("producto",image)
                })*/
                //console.log("objeto",JSON.parse(result))
            }).catch((e) =>{
                console.log(e)
                console.log("no hay items")
            })
        } catch (e) {
            console.log('Failed to fetch the data from storage')
        }
    }

    const getAllData = () =>{
        AsyncStorage.getAllKeys().then((keys) => {
          return AsyncStorage.multiGet(keys)
            .then((result) => {
                console.log(result)
            }).catch((e) =>{
                console.log(e)
            })
        })
    }

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
                            {notificaciones > 0 && (
                               <Badge
                                    status="error"
                                    value={notificaciones}
                                    containerStyle={{ position: "absolute", top: -4, right: -10 }}
                                /> 
                            )}
                            <Menu 
                                ref={menu} 
                                button={
                                    <Icon
                                        size={35}
                                        color="#fff"
                                        onPress={showMenu}
                                        name="cart-outline"
                                        type="material-community"
                                    />
                                }
                                style={{width:110}}
                            >
                                <MenuItem onPress={hideMenu}>
                                    <Text style={{color:'#128c7e',fontSize:18}}>Items</Text>                                                                 11111
                                </MenuItem>
                                <MenuDivider />
                                <MenuItem onPress={hideMenu}>
                                    <Text style={{fontSize:16}}>Total: {total}</Text>
                                </MenuItem>
                            </Menu>
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
                            usuario={inf}
                            producto={producto}
                            showModal={showModal}
                            listProduct={listProduct}
                            setShowModal={setShowModal}
                            setListProduct={setListProduct}
                        />
                    )}
                    keyExtractor={(item,index)=>index.toString}
                />
            ):(
            <Text>{mensajes}</Text>
            )}
        </View>
    )
}

function Producto(props) {
    const {usuario,producto,showModal,listProduct,setShowModal,setListProduct} = props
    const {id,precio,rating,titulo,imagenes,descripcion} = producto.item
    const [renderComponent, setRenderComponent] = useState(null)

    const detalle = async () => {
        setRenderComponent(
            <Detalle 
                producto={producto} usuario={usuario} 
                showModal={showModal} listProduct={listProduct} 
                setShowModal={setShowModal} setListProduct={setListProduct}/>
        )
        setShowModal(true)
    }
    
    return (
        <>
            <TouchableOpacity onPress={detalle} style={styles.card}>
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
            {renderComponent && (
              <Modal isVisible={showModal} setIsVisible={setShowModal}>
                {renderComponent}
              </Modal>
            )}
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