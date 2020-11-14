import Loading from '../loading'
import uuid from 'random-uuid-v4'
import * as firebase from 'firebase'
import Toast from 'react-native-easy-toast'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
import {ObtenerUsuario} from '../../utils/acciones'
import React,{useRef,useState,useEffect} from 'react'
import {Icon,Input,Button} from 'react-native-elements'
import {MaterialCommunityIcons} from '@expo/vector-icons'
import {useRoute,useNavigation} from '@react-navigation/native'
import {View,Image,StyleSheet,TouchableOpacity} from 'react-native'
import {actualizarRegistro,obtenerDatosUsuario} from '../../utils/acciones'
        
import * as Font from 'expo-font'

export default function Perfil () {
   
   var info={}
   const route = useRoute()
   const toastRef = useRef()
   const usuario = ObtenerUsuario()
   const navigation = useNavigation()
   const [foto, setFoto] = useState(null)
   const [nombre, setNombre] = useState("")
   const [imagen, setImagen] = useState(false)
   const [direccion, setDireccion] = useState("")
   const [fotoVieja, setFotoVieja] = useState(null)
   const [fontsLoad, setFontsLoad] = useState(false)
   const [editableDire, setEditableDire] = useState(false)
   const [editableImag, setEditableImag] = useState(false)
   const [editableName, setEditableName] = useState(false)
   const [textLoading, setTextLoading] = useState("cargando")
   const [loading, setLoading] = useState(route.params.loading)

   const photo={
      foto:require("../../assets/avatar.jpg")
   }


   useEffect(() => {
      (async () => {
         try{
            loading
            if(!fontsLoad){
               loadFonts()
            }
            info = await obtenerDatosUsuario(usuario.uid)
            setFoto(info.foto)
            setNombre(info.nombre)
            setDireccion(info.direccion)
            if(info.foto === ""){
               setImagen(true)
            }else{
               setFotoVieja(info.foto)
            }
            setLoading(false)
         }catch(err){
           toastRef.current.show(error,2000)
         }
       })()
   },[loading])

   const loadFonts = async () =>{
      await Font.loadAsync({
        // Andala: require('../../assets/fonts/Andala-Script.ttf'),
        // Lobster: require('../../assets/fonts/Lobster-Regular.ttf'),
         Oxygen: require('../../assets/fonts/Oxygen-Regular.ttf'),
      })
      setFontsLoad(true)
   }

   const uploadImageStorage = async (uri) => {
      const imageBlob = []
      const response = await fetch(uri)
      const blob = await response.blob()
      const ref = firebase.storage().ref("avatar").child(uuid())
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

   function CabeceraBG() {
      return (
         <View>
            <View style={styles.bg}></View>
         </View>
      )
   }

   function HeaderAvatar(props) {
      const {imagenperfil,setimagenperfil} = props
      return(
        <View style={styles.avatarinline}>
            <Image style={styles.imagen} source={imagenperfil? {uri:imagenperfil}:photo.foto}/>
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
            setEditableImag(true)
            setFoto(result.uri)
        }  
      }
   }

   const guardarCambios=async()=>{
      setLoading(true)
      setTextLoading("Actualizando perfil")
      if(editableImag){
         if(imagen){
            uploadImageStorage(foto).then(async(response) => {
               let datos = {
                  nombre:nombre,
                  foto:response[0],
                  direccion:direccion,
               }
               const registro = await actualizarRegistro("users", usuario.uid, datos)
               navigation.navigate("Perfil")
               setLoading(false)
            })
         }else{
            const n = fotoVieja.split('%2F').pop().split('#').shift().split('?').shift()
            const ref = firebase.storage().ref("avatar").child(n)
            await ref.delete().then(function() {
               uploadImageStorage(foto).then(async(response) => {
                  let datos = {
                     nombre:nombre,
                     foto:response[0],
                     direccion:direccion,
                  }
                  const registro = await actualizarRegistro("users", usuario.uid, datos)
                  navigation.navigate("Perfil")
                  setLoading(false)
               })
            }).catch(function(error) {
               toastRef.current.show(error,2000)
            })
         }
      }else{
         let datos = {
            nombre:nombre,
            direccion:direccion,
         }
         const registro = await actualizarRegistro("users", usuario.uid, datos)
         navigation.navigate("Perfil")
         setLoading(false)
      }
   }

   return (
     <View style={styles.container}>
         <CabeceraBG/>
         <HeaderAvatar imagenperfil={foto} setimagenperfil={setFoto} />
         <View style={styles.avatarinavatar}>
            <TouchableOpacity onPress={uploadImage}>
               <MaterialCommunityIcons name="pencil-plus" size={35} color="#128c7e" />
            </TouchableOpacity>
         </View>
         <View style={styles.botones}>
            <Input
               value={nombre}
               placeholder="Nombre"
               editable={editableName}
               containerStyle={styles.input}
               onChangeText={(text) => {setNombre(text)}}
               leftIcon={{name: "account",color: "#128c7e",type: "material-community",}}
               rightIcon={{
                  name: "pencil",
                  type: "material-community",
                  color: editableName ? '#128c7e' : '#c2c2c2',
                  onPress: () => setEditableName(!editableName)}}
            />
            <Input
               value={direccion}
               placeholder="direccion"
               editable={editableDire}
               containerStyle={styles.input}
               onChangeText={(text) => {setDireccion(text)}}
               leftIcon={<Icon color='#128c7e' name='directions' type='SimpleLineIcons'/>}
               rightIcon={{
                  name: "pencil",
                  type: "material-community",
                  color: editableDire ? '#128c7e' : '#c2c2c2',
                  onPress: () => setEditableDire(!editableDire)
               }}
            />
            <View style={{marginTop:40,alignItems:"center"}}>
               <Button title='Guardar Cambios' containerStyle={styles.btnLogin} buttonStyle={{backgroundColor:'#25D366'}} onPress={() => guardarCambios()}/>
            </View>
         </View>
         <Loading isVisible={loading} text={textLoading} />
         <Toast ref={toastRef} position='center' opacity={0.9} style={{backgroundColor:'#28872A'}}/>
     </View>
   )
}

const styles = StyleSheet.create({
   
   container: {
      flex: 1,
   },
   avatarinline: {
      marginTop: -70,
      flexDirection: "row",
      justifyContent: "space-around",
   },
   avatarinavatar: {
      marginTop: -25,
      marginLeft: 65,
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
   imagenSele: {
      width: 50,
      height: 50,
      borderRadius: 50
   },
   botones: {
      flex: 1,
      justifyContent:'center',
   },
   textCabezera: {
      fontSize: 18, 
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
   input: {
      width: "100%",
      marginTop: 20,
      height: 50,
   },
   btnLogin:{
      width:'90%',
   },
})
// <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "#00BCD4" translucent = {true}/>