import Loading from '../loading'
import * as firebase from 'firebase'
import Toast from 'react-native-easy-toast'
import AccountOptions from './AccountOptions'
import {FontAwesome5} from '@expo/vector-icons'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
import {View,Text,Alert,StyleSheet} from 'react-native'
import {Avatar,Button} from 'react-native-elements'
import React,{useRef,useEffect,useState} from 'react'
import {useNavigation} from '@react-navigation/native'
import {obtenerDatosUsuario} from '../../utils/acciones'
import {cerrarsesion,ObtenerUsuario,actualizarRegistro} from '../../utils/acciones'
                          
import * as Font from 'expo-font'

export default function Perfil () {
   
   var info={}
   const toastRef = useRef()
   const usuario = ObtenerUsuario()
   const navigation = useNavigation()
   const [inf, setInf] = useState(null)
   const [foto, setFoto] = useState(null)
   const [nombre, setNombre] = useState("")
   const [loading, setLoading] = useState(false)
   const [fontsLoad, setFontsLoad] = useState(false)
   const [reloadUser, setReloadUser] = useState(false)
   const [loadingText, setLoadingText] = useState("Cargando")

   const photo={
      foto:require("../../assets/avatar.jpg")
   }

   useEffect(() => {
      (async () => {
         try{
            setLoading(true)
            if(!fontsLoad){
               loadFonts()
            }
            info = await obtenerDatosUsuario(usuario.uid)
            setInf(info)
            setFoto(info.foto)
            setNombre(info.nombre)
            setLoading(false)
         }catch(err){
           toastRef.current.show(error,2000)
         }
      })()
      setReloadUser(false)
   },[reloadUser])

   
   const loadFonts = async () =>{
      await Font.loadAsync({
         Andala: require('../../assets/fonts/Andala-Script.ttf'),
         Lobster: require('../../assets/fonts/Lobster-Regular.ttf'),
         Oxygen: require('../../assets/fonts/Oxygen-Regular.ttf'),
      })
      setFontsLoad(true)
   }

   function CabeceraBG(props) {
      const {nombre} = props
      return (
         <View>
            <View style={styles.bg}>
               <Text style={styles.textCabezera}>
                  {nombre}
               </Text>
            </View>
            <Loading isVisible={loading} text={loadingText} />
         </View>
      )
   }

   function HeaderAvatar(props) {
      const {imagenperfil} = props
      return(
         <View style={styles.avatarinline}>
            <Avatar
               rounded
               size='xlarge'
               showAccessory
               onPress={uploadImage}
               source={imagenperfil? {uri:imagenperfil}:photo.foto}
            />
        </View>
      )
   }

   const uploadImage = async () => {
      const permissionResult = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      if(permissionResult === "denied"){
         toastRef.current.show("Es necesario aceptar los permisos de galeria, si lo has rechazado tienes que ir a ajustes y activarlos manualmente",3000)
      }else{
         const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing:true,
         })
         if(result.cancelled){
            toastRef.current.show("Has cerrado sin seleccionar ninguna imagen",2000)
         }else{
            setFoto(result.uri)
            uploadImageStorage(result.uri)
            .then(async(response) => {
               let fotoPerfil = {
                  foto:response[0],
               }
               const registro = await actualizarRegistro("users", usuario.uid, fotoPerfil)
               setLoading(false)
            })
            .catch(() => {
               toastRef.current.show("Error al actualizar el avatar.")
            })
        }  
      }
   }

   const uploadImageStorage = async (uri) => {
      setLoadingText("Actualizando Avatar")
      setLoading(true)
      const imageBlob = []
      const response = await fetch(uri)
      const blob = await response.blob()
      const ref = firebase.storage().ref().child(`avatar/${usuario.uid}`)
      await ref.put(blob).then(async (result) => {
         await firebase
         .storage()
         .ref(`avatar/${result.metadata.name}`)
         .getDownloadURL()
         .then((photoUrl) => {
            imageBlob.push(photoUrl)
         })
      })
      return imageBlob
   }

   const finalizar=()=>{
      Alert.alert(
         "Cerrar sesion",
         "estas seguro de salir?",
         [{
            style: "cancel",
            text: "Cancelar",
         },{
            style: "cancel",
            text: "Salir",
            onPress: () => cerrarsesion(),
         }]
      )
   }

   return (
     <View style={styles.container}>
         <CabeceraBG nombre={nombre}/>
         <HeaderAvatar imagenperfil={foto}/>
         <AccountOptions user={usuario} userInfo={inf} toastRef={toastRef} setReloadUser={setReloadUser} />
         <Button
            icon={<FontAwesome5 name="door-open" size={24} color="#128c7e" />}
            iconRight
            title="Cerrar sesión " 
            onPress={() => {finalizar()}} 
            buttonStyle={styles.btnCloseSession} 
            titleStyle={styles.btnCloseSessionText}/>
         <Toast ref={toastRef} position='center' opacity={0.9} style={{backgroundColor:'#28872A'}}/>
     </View>
   )
}

const styles = StyleSheet.create({
   
   container: {
      flex: 1,
      marginTop:40,
   },
   avatarinline: {
      marginTop: -70,
      marginBottom: 40,
      flexDirection: "row",
      justifyContent: "space-around",
   },
   bg: {
      height: 200,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#128C7E",
      borderBottomLeftRadius: 200,
      borderBottomRightRadius: 200,
   },
   imagen: {
      width: 110,
      height: 110,
      borderRadius: 50
   },
   botones: {
      flex: 1,
      justifyContent:'flex-end',
   },
   textCabezera: {
      fontSize: 26, 
      color: "#fff", 
      fontWeight: "bold"
   },
   TextSalir: {
      fontSize: 26, 
      marginTop: 60,
      marginLeft: 30,
      color: "#128C7E",
      marginBottom: 80,
      fontFamily:'Oxygen'
   },
   textOpcion: {
      fontSize: 18,  
      marginLeft: 30,
      color: "#128C7E",
      marginBottom: 20,
      fontFamily:'Oxygen'
   },
   btnCloseSession: {
      marginTop: 30,
      paddingTop: 10,
      borderRadius: 0,
      marginBottom: 40,
      borderTopWidth: 1,
      paddingBottom: 10,
      borderBottomWidth: 1,
      backgroundColor: "#fff",
      borderTopColor: "#e3e3e3",
      borderBottomColor: "#e3e3e3",
  },
  btnCloseSessionText: {
      color: "#00a680",
  },
})