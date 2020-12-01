import {size,isEmpty} from 'lodash'
import React,{useState,useEffect} from 'react'
//import {enviarWhatsapp} from "../../Utils/Utils"
import {Button,Rating} from 'react-native-elements'
import {verificarArray} from '../../utils/acciones'
import AsyncStorage from '@react-native-community/async-storage'
import {Text,View,Alert,Dimensions,ScrollView,StyleSheet} from 'react-native'

import Carousel from '../carousel'

const product = 'ListaProducto'

export default function Detalle(props) {

    const {usuario,producto,setTotal,showModal,listProduct,setShowModal} = props
    const {tipo,telefono} = usuario
    const {id,precio,rating,titulo,imagenes,descripcion} = producto.item

    const [activeslide, setactiveslide] = useState(0)

    const [lista, setLista] = useState([])

    const photo={
        foto:require("../../assets/avatar.jpg")
    }

    const product = 'producto'

    const saveArticle = async (key, value) =>{
        if(isEmpty(telefono)){
            Alert.alert(
                "Alerta","Primero debe registrar un numero de telefono para realizar operaciones",
                [{
                    style: "cancel",
                    text: "Aceptar",
                }]
            )
        }else{
            if(size(listProduct)>0){          
                await verificarArray(listProduct,value)
                .then(async(result)=>{
                     if(result){
                        Alert.alert(
                            "","El producto ya se encuentra en el carrito",
                            [{
                                style: "cancel",
                                text: "Aceptar",
                                onPress: () => setShowModal(false),
                            }]
                        )
                    }else{
                        listProduct.push(value)
                        setTotal(size(listProduct))
                        await AsyncStorage.setItem(key,JSON.stringify(listProduct)).then(() => {
                            setShowModal(false)
                        })
                    }
                })
                .catch((result)=>{
                    console.log(result)
                    setShowModal(false)
                })
            }else{
                setTotal(1)
                listProduct.push(value)
                await AsyncStorage.setItem(key,JSON.stringify(listProduct)).then(() => {
                    console.log('Contacts updated.')
                    setShowModal(false)
                })
            }
        }
     }

    const clearStorage = async (key) => {
        try {
            await AsyncStorage.removeItem(key)
            console.log('Storage successfully cleared!')
        } catch (e) {
            console.log('Failed to clear the async storage.')
        }
    }

    return (
        <>
            <View style={styles.view}>
                <ScrollView >
                    <Carousel
                        height={300}
                        imagenes={imagenes}
                        activeslide={activeslide}
                        setactiveslide={setactiveslide}
                        width={Dimensions.get("window").width}
                    />
                </ScrollView>
            </View>
            <View style={styles.boxsuperior}>
                <View style={styles.interior}/>
                <Text style={styles.titulos}>{titulo}</Text>
                <Text style={styles.precio}>${parseFloat(precio).toFixed(2)}</Text>
                <View>
                    <Text style={styles.descripcion}>{descripcion}</Text>
                    <Rating imageSize={30} startingValue={rating} readonly/>
                </View>
            </View>
            {!tipo &&
                <Button
                    title="Añadir al carrito"
                    containerStyle={styles.btnContainer}
                    buttonStyle={styles.btn}
                    onPress={() =>saveArticle(product,id)}
                />
            } 
        </>
    )
}

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10,
    },
    input: {
        marginBottom: 10,
    },
    btnContainer: {
        marginTop: 20,
        width: "95%",
    },
    btn: {
        backgroundColor: "#00a680",
    },
    interior:{
        width: 100,
        alignSelf: "center",
        borderBottomWidth: 2,
        borderBottomColor: "#25D366",
    },
    boxsuperior: {
        marginTop: -50,
        paddingTop: 20,
        alignItems: "center",
        backgroundColor: "#fff",
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    },
    titulos: {
        fontSize: 24,
        marginTop: 10,
        color: "#075e54",
        fontWeight: "bold",
    },
    precio: {
        fontSize: 18,
        paddingLeft: 10,
        color: "#128c7e",
        fontWeight: "bold",
    },
    descripcion: {
      fontSize: 16,
      color: "#757575",
      fontWeight: "300",
      marginVertical: 10,
      alignSelf: "center",
      textAlign: "center",
      paddingHorizontal: 10,
    },
})