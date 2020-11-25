import {size} from 'lodash'
import AsyncStorage from '@react-native-community/async-storage'
import React,{useRef,useState,useEffect,useCallback} from 'react'
import {Text,View,StyleSheet} from 'react-native'
import {ObtenerUsuario,obtenerDatosUsuario} from '../../utils/acciones'

export default function Carrito(){

    
    const usuario = ObtenerUsuario()
    const [inf, setInf] = useState(null)
    const [total, setTotal] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [listProduct, setListProduct] = useState([])

    useEffect(()=>{
        (async()=>{
            getAllData()
            //setproductlist(await ListarProductos())
            await obtenerDatosUsuario(usuario.uid)
            .then((result) => {
                setInf(result)
             })
             .catch((err) => {
                console.log("err",err)
             })
        })()
    },[])

    const getAllData = () =>{
        AsyncStorage.getAllKeys().then((keys) => {
          return AsyncStorage.multiGet(keys)
            .then((result) => {
                if(size(result)>1){
                    console.log("size",size(JSON.parse(result[1][1])))
                    console.log("aray",JSON.parse(result[1][1]))
                    setTotal(size(JSON.parse(result[1][1])))
                    setListProduct(JSON.parse(result[1][1]))
                }
            }).catch((e) =>{
                console.log(e)
            })
        })
    }

    return(
        <View style={styles.container}>
            <Text>carrito</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center'
    }
})