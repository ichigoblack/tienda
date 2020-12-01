import React,{useRef} from "react"
import RegistroForm from "./RegistroForm"
import Toast from "react-native-easy-toast"
import {Text,View,Image,Dimensions,StyleSheet} from "react-native"

export default function Registro() {

  const toastRef = useRef()
  const photo = require("../../assets/reactNative.png")
  
  return (
    <View style={styles.container}>  
        <Image source={photo} style={styles.imglogo}/>
        <Text style={styles.textobaner}>CREAR CUENTA</Text>
        <RegistroForm toastRef={toastRef} />
        <Toast ref={toastRef} position="center" opacity={0.9} style={{backgroundColor:'#28872A'}}/>
    </View>
  )
}
const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop:30,
        height:windowHeight,
        backgroundColor: "#128C73",
    },
    imglogo: {
        width: 106,
        height: 106,
        marginTop: 40,
        alignSelf: "center",
    },
    textobaner: {
        fontSize: 30,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        fontFamily: "Roboto",
    },
});