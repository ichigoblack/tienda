import Loading from '../loading'
import Toast from 'react-native-easy-toast'
import React,{useRef,useState} from 'react'
import {View,Text,Image,StyleSheet} from 'react-native'
import {obtenerDatosUsuario} from '../../utils/acciones'
import {cerrarsesion,ObtenerUsuario} from '../../utils/acciones'
import {useNavigation,useFocusEffect} from '@react-navigation/native'

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
   const [telefonoAuth, setTelefonoAuth] = useState(false)

   const photo={
      foto:require("../../assets/avatar.jpg")
   }

   const goEditar=()=>{
      navigation.navigate('Editar',{ loading: true })
   }

   const goActualizar=()=>{
      navigation.navigate('Actualizar')
   }

   const goConfirmar=()=>{
      const ce = inf.codigo
      const ne = inf.telefono
      const numero = `+${ce}${ne}`
      navigation.navigate('Enviar',{ numero: numero })
   }

   /*useEffect(() => {
      (async () => {
         try{
            loading
            if(!fontsLoad){
               loadFonts()
            }
            info = await obtenerDatosUsuario(usuario.uid)
            setInf(info)
            setFoto(info.foto)
            setNombre(info.nombre)
            setTelefonoAuth(info.telefonoAuth)
            setLoading(false)
         }catch(err){
           toastRef.current.show(error,2000)
         }
       })();
   },[loading])*/

   useFocusEffect(
      React.useCallback(() => {
         (async () => {
            setLoading(true)
            console.log('Screen was focused')
            try{
               if(!fontsLoad){
                  loadFonts()
               }
               info = await obtenerDatosUsuario(usuario.uid)
               setInf(info)
               setFoto(info.foto)
               setNombre(info.nombre)
               setTelefonoAuth(info.telefonoAuth)
               setLoading(false)
            }catch(err){
              toastRef.current.show(error,2000)
            }
          })();
         return () => {
            console.log('Screen was unfocused')
         }
      }, [])
   )

   const loadFonts = async () =>{
      await Font.loadAsync({
        // Andala: require('../../assets/fonts/Andala-Script.ttf'),
        // Lobster: require('../../assets/fonts/Lobster-Regular.ttf'),
         Oxygen: require('../../assets/fonts/Oxygen-Regular.ttf'),
      })
      setFontsLoad(true)
   }

   function CabeceraBG(props) {
      const {nombre} = props;
      return (
         <View>
            <View style={styles.bg}>
               <Text style={styles.textCabezera}>
                  {nombre}
               </Text>
            </View>
            <Loading isVisible={loading} text="Cargando" />
         </View>
      );
   }

   function HeaderAvatar(props) {
      const {imagenperfil,setimagenperfil} = props;
      return(
        <View style={styles.avatarinline}>
            <Image style={styles.imagen} source={imagenperfil? {uri:imagenperfil}:photo.foto}/> 
        </View>
      )
   }

   function Opciones(){
      return (
         <View style={styles.botones}>
            <Text style={styles.textOpcion} onPress={goEditar}>Editar perfil</Text>
            {telefonoAuth == true &&
               (<Text style={styles.textOpcion} onPress={goActualizar}>Actualizar Telefono</Text>)
            }
            {telefonoAuth == false &&
               (<Text style={styles.textOpcion} onPress={goConfirmar}>Autenticar Telefono</Text>)
            }
            <Text style={styles.TextSalir} onPress={() => {cerrarsesion()}}>Cerrar Sesión</Text>
         </View>
      )
   }

   return (
     <View style={styles.container}>
         <CabeceraBG nombre={nombre}/>
         <HeaderAvatar imagenperfil={foto} setimagenperfil={setFoto}/>
         <Opciones/>
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
   }
})