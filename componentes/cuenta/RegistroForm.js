import Loading from '../loading'
import {isEmpty,size} from 'lodash'
import * as firebase from 'firebase'
import React,{useState} from 'react'
import {View,StyleSheet} from 'react-native'
import {validaremail} from '../../utils/utils'
import {Input,Button} from 'react-native-elements'
import {useNavigation} from '@react-navigation/native'
import {addRegistroEspecifico} from '../../utils/acciones'

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
            tipo:false,
            email:email,
            telefono:"",
            direccion:"",
            rol:"cliente",
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

  return (
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
      <Button
        title="INICIAR SESIÓN"
        containerStyle={styles.btnentrar}
        buttonStyle={{ backgroundColor: "#128C7E" }}
        onPress={() => navigation.goBack()}
      />
      <Loading isVisible={loading} text="Favor Espere" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F6F8",
    flex: 1,
    marginTop: 20,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
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
  }
})