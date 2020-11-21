import {size} from 'lodash'
//import Busqueda from '../../Componentes/Busqueda'
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

    const photo={
        foto:require("../../assets/avatar.jpg")
    }

    useEffect(()=>{
        (async()=>{
            console.log(await ListarProductos())
        })()
    },[])

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
                        <View>
                            <Icon
                                size={30}
                                color="#fff"
                                name="bell-outline"
                                type="material-community"
                                //onPress={() => {navigation.navigate("mensajes")}}
                            />
                            <Badge
                                status="error"
                                //value={notificaciones}
                                containerStyle={{ position: "absolute", top: -4, right: -4 }}
                            />
                            </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
            <Text>tienda</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40,
        backgroundColor: '#fff',
    },
    header: {
        height: "15%",
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