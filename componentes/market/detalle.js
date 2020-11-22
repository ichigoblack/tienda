import {size} from 'lodash'
import React,{useState,useEffect} from 'react'
//import {enviarWhatsapp} from "../../Utils/Utils"
import {Icon,Input,Avatar,Button,Rating} from 'react-native-elements'
import {Text,View,Alert,Dimensions,ScrollView,StyleSheet} from 'react-native'
import {addRegistro,ObtenerUsuario,obternerRegistroxID,sendPushNotification,setMensajeNotificacion} from '../../utils/acciones'

import Modal from '../Modal'
import Loading from '../loading'
import Carousel from '../carousel'

export default function Detalle(props) {

    const {producto} = props
    const {id,precio,rating,titulo,usuario,imagenes,descripcion} = producto.item

    const [activeslide, setactiveslide] = useState(0)

    const photo={
        foto:require("../../assets/avatar.jpg")
    }
/*
<ScrollView >
                <Carousel
                    height={400}
                    imagenes={imagenes}
                    activeslide={activeslide}
                    setactiveslide={setactiveslide}
                    width={Dimensions.get("window").width}
                />
                
            </ScrollView> */
    return (
        <View style={styles.container}>
            <Text>{titulo}</Text>
            <Text>{titulo}</Text>
            <Text>{titulo}</Text>
            <Text>{titulo}</Text>
            <Text>{titulo}</Text>
            <Text>{titulo}</Text>
        </View>
        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 200,
        backgroundColor: "pink",
    },
})