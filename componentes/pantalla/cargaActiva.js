import React,{useEffect} from 'react'
import {View,StyleSheet} from 'react-native'
import * as Animatable from 'react-native-animatable'

export default function CargaActiva({navigation}) {

    const photo={
        foto:require("../../assets/reactNative.png"),
    }

    useEffect(() => {
        setTimeout(() => {
            navigation.navigate('Navegacion')
            }, 3000);
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