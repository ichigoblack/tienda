import React,{useEffect} from 'react'
import {View,StyleSheet} from 'react-native'
import * as Animatable from 'react-native-animatable'
import {ObtenerUsuario,obtenerDatosUsuario} from '../../utils/acciones'

export default function CargaActiva({navigation}) {

    const usuario = ObtenerUsuario()

    const photo={
        foto:require("../../assets/reactNative.png"),
    }

    useEffect(() => {
        (async () => {
            await obtenerDatosUsuario(usuario.uid)
            .then((result) => {
                if(result.rol){
                    navigation.navigate('Admin')
                }else{
                    navigation.navigate('User')
                }
            })
            .catch((err) => {
                console.log(err)
            })
        })()
    }, [])

    return (
        <View style={styles.container}>
            <Animatable.Image
                easing='ease-out'
                animation='pulse'
                source={photo.foto}
                style={styles.animacion}
                iterationCount='infinite'
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        marginTop:40,
        justifyContent:'center',
        backgroundColor: '#128C73'
    },
    animacion:{
        width:200,
        height:200,
        margin:100
    }
})