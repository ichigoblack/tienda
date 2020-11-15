import React,{useState} from 'react'
import {View,StyleSheet} from 'react-native'
import {Icon,Input,Button} from 'react-native-elements'
import {actualizarRegistro} from '../../utils/acciones'

export default function ChangeDisplayNameForm(props) {

  const {
      user,
      direccion,
      setLoading,
      displayName,
      setShowModal,
      setReloadUser,
      setLoadingText,} = props
  
  const [errorDi, setErrorDi] = useState(null)
  const [errorNa, setErrorNa] = useState(null)
  const [newDireccion, setNewDireccion] = useState(direccion)
  const [newDisplayName, setNewDisplayName] = useState(displayName)

   const onSubmit = async() => {
      setErrorDi(null)
      setErrorNa(null)
      if (!newDireccion  || !newDisplayName) {
         if(!newDisplayName){
            setErrorNa("Debe llenar el nombre")
         }
         if(!newDireccion){
            setErrorDi("Debe llenar la direccion")
         } 
      }else{
         setLoadingText("Actualizando datos")
         setLoading(true)
         let datos = {
            nombre:newDisplayName,
            direccion:newDireccion,
         }
         const registro = await actualizarRegistro("users", user.uid, datos)
            .then(() => {
               setLoading(false)
               setReloadUser(true)
               setShowModal(false)
            })
            .catch(() => {
               setErrorNa("Error al actualizar el nombre.")
               setErrorDi("Error al actualizar la direccion.")
               setLoading(false)
            })
      }
   }
   return (
      <View style={styles.view}>
         <Input
            placeholder="Nombre"
            containerStyle={styles.input}
            rightIcon={{
               color: "#128c7e",
               type: "material-community",
               name: "account-circle-outline",
            }}
            defaultValue={displayName || ""}
            onChange={(e) => setNewDisplayName(e.nativeEvent.text)}
            errorMessage={errorNa}
         />
         <Input
            placeholder="Direccion"
            containerStyle={styles.input}
            rightIcon={<Icon color='#128c7e' name='directions' type='SimpleLineIcons'/>}
            defaultValue={direccion || ""}
            onChange={(e) => setNewDireccion(e.nativeEvent.text)}
            errorMessage={errorDi}
         />
         <Button
            title="Cambiar Datos"
            containerStyle={styles.btnContainer}
            buttonStyle={styles.btn}
            onPress={onSubmit}
            //loading={isLoading}
         />
      </View>
   )
}

const styles = StyleSheet.create({
   view: {
      alignItems: "center",
      paddingTop: 10,
      paddingBottom: 10,
   },
   input: {
      marginBottom: 10,
   },
   btnContainer: {
      marginTop: 20,
      width: "95%",
  },
   btn: {
      backgroundColor: "#00a680",
   },
})