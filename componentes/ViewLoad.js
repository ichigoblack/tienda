import React,{useState,useEffect} from 'react'
import firebase from '../utils/firebas'
import {View,StyleSheet} from 'react-native'
import * as Animatable from 'react-native-animatable'

export default function ViewLoad({navigation}) {

    const photo={
        foto:require("../assets/reactNative.png"),
    }

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            setTimeout(() => {
                if(user){
                    console.log("u",user)
                    console.log("logueado")
                    navigation.navigate('Navegacion')
                }else{
                    console.log("u",user)
                    console.log("no logueado")
                    navigation.navigate('Login')
                }
            }, 3000);
        })
        return () => unsubscribe()
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
        backgroundColor: 'yellow'
    },
    animacion:{
        width:200,
        height:200,
        margin:100
    }
})