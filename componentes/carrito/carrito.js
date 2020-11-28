import {size,filter} from 'lodash'
import Modal from '../Modal'
import Loading from '../loading'
import CompraModal from './compraModal'
import {AntDesign} from '@expo/vector-icons'
import {Image,Button,Rating} from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage'
import React,{useRef,useState,useEffect,useCallback} from 'react'
import {Text,View,FlatList,StyleSheet,TouchableOpacity} from 'react-native'
import {datos,ObtenerUsuario,verificarLista,obtenerDatosUsuario} from '../../utils/acciones'

export default function Carrito(){

    
    const usuario = ObtenerUsuario()
    const [inf, setInf] = useState(null)
    const [total, setTotal] = useState(0)
    const [reload, setReload] = useState(false)
    const [cantidad, setCantidad] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [listProduct, setListProduct] = useState([])
    const [renderComponent, setRenderComponent] = useState(null)


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
        setReload(false)
    },[reload])
    
    getMyValue = async () => {
        let value = []
        try {
           value = await AsyncStorage.getItem("producto")
        } catch(e) {
          // read error
        }
        console.log("resutado es",JSON.parse(value))
        setTotal(size(JSON.parse(value)))
        if(size(JSON.parse(value)) >0){
            setListProduct(await verificarLista(JSON.parse(value)))
            setCantidad(await llenarCantidad(await verificarLista(JSON.parse(value))))
        }
    }

    llenarCantidad = async (array) => {
        let value = []
        for (let index = 0; index < size(array); index++) {
            value.push(1)
        }
        return value
    }
    
    const compra = async()=>{
        const dat = await datos(listProduct,cantidad,usuario.uid)
        setRenderComponent(
            <CompraModal
                datos={dat}
                setReload={setReload}
                setShowModal={setShowModal}
            />
        )
        setShowModal(true)
    }

    return(
        <View style={styles.container}>
            {total>0 ? (
                <>
                <FlatList
                    data={listProduct}
                    renderItem={(producto)=>(
                        <Producto
                            cantidad={cantidad}
                            producto={producto}
                            listProduct={listProduct}
                        />
                    )}
                    keyExtractor={(item,index)=>index.toString}
                />
                <View style={{alignItems:'center'}}>
                    <Button
                        title="Realizar la compra"
                        containerStyle={{marginBottom:43,width:'80%'}}
                        buttonStyle={{backgroundColor:"#128c7e"}}
                        onPress={()=>compra()}
                    />
                </View>
                {renderComponent && (
                    <Modal isVisible={showModal} setIsVisible={setShowModal}>
                        {renderComponent}
                    </Modal>
                )}
                </>
            ):(
            <Text>No hay nada</Text>
            )}
        </View>
    )
}
//<Loading isVisible={loading} text={loadingText}/>
function Producto(props) {
    const {cantidad,producto} = props
    const {id,precio,posicion,titulo,imagenes} = producto.item
    const [count,setCount] = useState(1)
    
    const bajar = ()=>{
        if(cantidad[posicion] > 1){ 
            cantidad[posicion] = cantidad[posicion]-1
            setCount(count-1)
        }
    }

    const subir = ()=>{
        if(cantidad[posicion] < 99){
            cantidad[posicion] = cantidad[posicion]+1
            setCount(count+1)
        }
    }

    useEffect(()=>{
        (async()=>{
            //setCount(cantidad[posicion])
            //console.log("posicion",listProduct.indexOf(producto))
            //aconsole.log("se encontro",filter(listProduct,{id:id}))
            //console.log("objeto",listProduct[posicion].cantidad)

        })()
    },[])

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
                        <Text style={styles.botonText}>{count}</Text>
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


/*
Diseño de la Solución

Diagrama de Bloques
Hardware
Arquitectura
Software
Arquitectura
Diagramas (Clases, Casos de Uso, Interacción, Flujo de Procesos, entre otros que considere que apliquen para su proyecto)
Diseño de la Base de Datos
La estructura propuesta es una referencia para el desarrollo de este avance. De acuerdo a cada proyecto considerar lo que mejor aplica. En el caso de existir una gran cantidad de diagramas, lo pueden ubicar en la sección de Anexos y citarlos desde el capítulo 2. Es importante que cada figura/tabla tenga un párrafo que explique en detalle el contenido. Recordar que es un avance por lo que no es necesario culminar con todos los diagramas.

Si tienen alguna inquietud o comentario, la pueden hacer por los grupos privados de cada proyecto.}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}++++++++++++++++/////////5

*/




