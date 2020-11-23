import {size} from 'lodash'
import React,{useState,useEffect} from 'react'
//import {enviarWhatsapp} from "../../Utils/Utils"
import {Button,Rating} from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage'
import {Text,View,Alert,Dimensions,ScrollView,StyleSheet} from 'react-native'
import {addRegistro,ObtenerUsuario,obternerRegistroxID,sendPushNotification,setMensajeNotificacion} from '../../utils/acciones'

import Carousel from '../carousel'

export default function Detalle(props) {

    const {producto,usuario} = props
    const {tipo} = usuario
    const {id,precio,rating,titulo,imagenes,descripcion} = producto.item

    const [activeslide, setactiveslide] = useState(0)

    const photo={
        foto:require("../../assets/avatar.jpg")
    }

    const saveArticle = async (key, value) =>{
        try {
            console.log("se esta guardando")
            await AsyncStorage.setItem(key, value)
            getAllData()
        } catch (e) {
            console.log(e);
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
                    onPress={() =>saveArticle('product',producto)}
                    //loading={isLoading}
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