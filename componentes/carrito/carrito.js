import {size} from 'lodash'
import Loading from '../loading'
import {AntDesign} from '@expo/vector-icons'
import {Image,Button,Rating} from 'react-native-elements'
import {Text,View,FlatList,StyleSheet,TouchableOpacity} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import React,{useRef,useState,useEffect,useCallback} from 'react'
import {ObtenerUsuario,verificarLista,obtenerDatosUsuario} from '../../utils/acciones'

export default function Carrito(){

    
    const usuario = ObtenerUsuario()
    const [inf, setInf] = useState(null)
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const [listProduct, setListProduct] = useState([])
    const [loadingText, setLoadingText] = useState("Cargando")

    const product = 'product'

    useEffect(()=>{
        (async()=>{
            //setLoading(true)
            await getMyValue()
            await obtenerDatosUsuario(usuario.uid)
            .then((result) => {
                setInf(result)
                //setLoading(false)
             })
             .catch((err) => {
                console.log("err",err)
             })
            
        })()
    },[])

    getMyValue = async () => {
        let value = []
        try {
           value = await AsyncStorage.getItem("producto")
        } catch(e) {
          // read error
        }
        setTotal(size(JSON.parse(value)))
        if(size(JSON.parse(value)) >0){
            setListProduct(await verificarLista(JSON.parse(value))) 
        }
    }

    return(
        <View style={styles.container}>
            {total>0 ? (
                <>
                <FlatList
                    data={listProduct}
                    renderItem={(producto)=>(
                        <Producto
                            producto={producto}
                        />
                    )}
                    keyExtractor={(item,index)=>index.toString}
                />
                <View style={{alignItems:'center'}}>
                    <Button
                        title="Realizar la compra"
                        containerStyle={{marginBottom:43,width:'80%'}}
                        buttonStyle={{backgroundColor:"#128c7e"}}
                    />
                </View>
                </>
            ):(
            <Text>No hay nada</Text>
            )}
        </View>
    )
}
//<Loading isVisible={loading} text={loadingText}/>
function Producto(props) {
    const {producto} = props
    const {id,precio,rating,titulo,imagenes,descripcion} = producto.item
    const [cantidad,setCantidad] = useState(1)
    
    const bajar = ()=>{
        if(cantidad > 1){
            setCantidad(cantidad-1)
        }
    }

    const subir = ()=>{
        if(cantidad < 100){
            setCantidad(cantidad+1)
        }
        
    }
    return (
        <>
            <View style={styles.card}>
                <Image source={{ uri: imagenes[0] }} style={styles.imgproducto} />
                <View style={styles.infobox}>
                    <Text style={styles.titulo}>{titulo}</Text>
                    <Text style={styles.precio}>${precio}</Text>
                    <View style={styles.botones}>
                        <TouchableOpacity style={{marginRight:5}} onPress={()=>subir()}>
                            <AntDesign name="caretright" size={24} color="#128c7e" />
                        </TouchableOpacity>
                        <Text style={styles.botonText}>{cantidad}</Text>
                        <TouchableOpacity style={{marginLeft:5}} onPress={()=>bajar()}>
                            <AntDesign name="caretleft" size={24} color="#128c7e" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff',
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
        height: 150,
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
    botones: {
        marginTop:10,
        flexDirection:'row'
    },
    botonText: {
        paddingTop: 5,
        borderWidth: 1,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5,
        borderColor: "#128c7e",
    }
})
