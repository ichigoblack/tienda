import Loading from '../loading'
import {isEmpty,size} from 'lodash'
import * as firebase from 'firebase'
import React,{useState} from 'react'
import * as Facebook from 'expo-facebook'
import {validaremail} from '../../utils/utils'
import {useNavigation} from '@react-navigation/native'
import {addRegistroEspecifico} from '../../utils/acciones'
import {Icon,Input,Button,Divider} from 'react-native-elements'
import {Text,View,StyleSheet,TouchableOpacity} from 'react-native'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

export default function RegistroForm(props) {

  const {toastRef} = props
  const navigation = useNavigation()
  const [email, setemail] = useState("")
  const [show, setshow] = useState(false)
  const [showC, setshowC] = useState(false)
  const [password, setpassword] = useState("")
  const [loading, setloading] = useState(false)
  const [repetirpassword, setrepetirpassword] = useState("")

  function crearcuenta(){
    if (isEmpty(email) || isEmpty(password) || isEmpty(repetirpassword)) {
      toastRef.current.show("Todos los campos son obligatorios")
    } else if (!validaremail(email)) {
      toastRef.current.show("Correo no es válido")
    } else if (password !== repetirpassword) {
      toastRef.current.show("Las contraseñas tienen que ser iguales")
    } else if (size(password) < 6) {
      toastRef.current.show("Las contraseñas deben tener al menos 6 carácteres")
    } else {
      setloading(true)
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async(response) => {
          let usuario = {
            foto:"",
            token:"",
            codigo:"",
            rol:"User",
            email:email,
            telefono:"",
            direccion:"",
            tipo:"correo",
            nombre:"usuario",
            telefonoAuth:false,
          }
          const registro = await addRegistroEspecifico("users", response.user.uid, usuario)
          setloading(false)
        })
        .catch((err) => {
          setloading(false)
          toastRef.current.show("Ha ocurrido un error o puede que este usuario esté registrado")
        })
    }
  }

  async function logIn() {
    try {
      await Facebook.initializeAsync({
        appId: '3403582586374104',
      });
      const {
        type,
        token,
        expirationDate,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        setloading(true)
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        //console.log("credential",credential)
        firebase.auth().signInWithCredential(credential)
        .then(async(response) => {
            console.log(response.user)
            let usuario = {
              foto:response.user.photoURL,
              token:"",
              codigo:"",
              rol:"User",
              email:response.user.email,
              telefono:response.user.phoneNumber,
              direccion:"",
              tipo:"facebook",   
              nombre:response.user.displayName,  
              telefonoAuth:false,
            }
            const registro = await addRegistroEspecifico("users", response.user.uid, usuario)
            setloading(false)
        })
        .catch(error => {console.log(error)})
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }
  function BotonesRedes() {
    return(
        <View style={styles.btnRedes}>
            <TouchableOpacity style={styles.btnloginsocial}>
                <Icon
                    size={24}
                    type="material-community"
                    name="google"
                    color="#fff"
                    backgroundColor="transparent"
                    //onPress={() => signInAsync()}
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnloginsocial}>
                <Icon
                    size={24}
                    type="material-community"
                    name="facebook"
                    color="#fff"
                    onPress={() => logIn()}
                    backgroundColor="transparent"
                />
            </TouchableOpacity>
        </View>
    )
  }

  return (
    <KeyboardAwareScrollView 
      style={{
        flex: 1,
        margin: 5,
        padding: 5,
        elevation: 3,
        borderRadius: 50,
        backgroundColor: "#fff",
      }}
    >
      <View style={styles.container}>
      <View
        style={{
          borderBottomColor: "#25D366",
          borderBottomWidth: 2,
          width: 100,
        }}
      />
        <Input
          placeholder="Correo"
          containerStyle={styles.input}
          rightIcon={{
            type: "material-community",
            name: "at",
            color: "#128c7e",
          }}
          leftIcon={{
            type: "material-community",
            name: "account-circle-outline",
            color: "#128c7e",
          }}
          onChangeText={(text) => {setemail(text)}}
          value={email}
        />
        <Input
          placeholder="Contraseña"
          containerStyle={styles.input}
          leftIcon={{
            type: "material-community",
            name: "security",
            color: "#128c7e",
          }}
          rightIcon={{
            type: "material-community",
            name: show ? "eye-off-outline" : "eye-outline",
            color: "#128c7e",
            onPress: () => setshow(!show),
          }}
          onChangeText={(text) => {setpassword(text)}}
          secureTextEntry={!show}
          value={password}
        />
        <Input
          placeholder="Repetir Contraseña"
          containerStyle={styles.input}
          leftIcon={{
            type: "material-community",
            name: "security",
            color: "#128c7e",
          }}
          rightIcon={{
            type: "material-community",
            name: showC ? "eye-off-outline" : "eye-outline",
            color: "#128c7e",
            onPress: () => setshowC(!showC),
          }}
          onChangeText={(text) => {setrepetirpassword(text)}}
          secureTextEntry={!showC}
          value={repetirpassword}
        />
        <Button
          title="CREAR CUENTA"
          containerStyle={styles.btnentrar}
          buttonStyle={{ backgroundColor: "#25d366" }}
          onPress={() => crearcuenta()}
        />   
        <Divider style={styles.divider}/>
        <Text style={styles.txto}>O</Text>
        <BotonesRedes/>
        <Divider style={styles.divider}/>
        <Button
          title="INICIAR SESIÓN"
          containerStyle={styles.btnentrar}
          buttonStyle={{ backgroundColor: "#128C7E" }}
          onPress={() => navigation.goBack()}
        />
      </View>
      <Loading isVisible={loading} text="Favor Espere" />
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    //backgroundColor: "#F5F6F8",
    flex: 1,
    marginTop: 20,
    //borderTopLeftRadius: 50,
    //borderTopRightRadius: 50,
    alignItems: "center",
    paddingTop: 20,
  },
  input: {
    width: "90%",
    marginTop: 20,
    height: 50,
  },
  btnentrar: {
    width: "90%",
    marginTop: 20,
  },
  divider:{
      height:1,
      width:'90%',
      marginTop:20,
      backgroundColor:'#128C7E'
  },
  txto: {
      fontSize: 20,
      marginTop: 20,
      color: "#128c7e",
      fontWeight: "bold",
  },
  btnRedes: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-around",
    },
  btnloginsocial: {
      borderRadius: 5,
      paddingVertical: 10,
      paddingHorizontal: 40,
      backgroundColor: "#25d366",
  },
})