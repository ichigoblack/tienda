import Loading from '../loading'
import LoginForm from './loginForm'
import Toast from 'react-native-easy-toast'
import React,{useRef,useState} from 'react'
import {useNavigation} from '@react-navigation/native'
import {Text,View,Image,StatusBar,StyleSheet} from 'react-native'

export default function Login({}) {

    const toastRef = useRef()
    const navigation = useNavigation()
    const photo = require("../../assets/reactNative.png")
    
    return (
        <View style={styles.container}>
            <Image source={photo} style={styles.logo}/>
            <Text style={styles.textBanner}>¡Bienvenido!</Text>
            <LoginForm toastRef={toastRef}/>
            <Toast ref={toastRef} position='center' opacity={0.9} style={{backgroundColor:'#28872A'}}/>
        </View>
    );
}
//resizeMode="contain" 
//const windowWidth = Dimensions.get('window').width;
//const windowHeight = Dimensions.get('window').height;
// <StatusBar translucent backgroundColor='transparent' />
const styles = StyleSheet.create({
    container:{
        flex:1,
        marginTop:30,
        //height:windowHeight*0.99,
        backgroundColor:'#128C73',
    },
    logo:{
        //height: 150,
        //width: "100%",
        marginTop:40,
        alignSelf:'center'
    },
    textBanner:{
        fontSize:30,
        color:'white',
        fontWeight:'bold',
        alignSelf:'center',
        fontFamily:'Roboto',
    }
})