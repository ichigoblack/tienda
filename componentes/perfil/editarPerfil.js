import React,{useState} from 'react'
import * as firebase from 'firebase'
import {View,StyleSheet} from 'react-native'
import {Icon,Input,Button} from 'react-native-elements'

export default function ChangeDisplayNameForm(props) {

  const {displayName,direccion,setShowModal,toastRef,setRealoadUserInfo} = props
  
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [newDireccion, setNewDireccion] = useState(null)
  const [newDisplayName, setNewDisplayName] = useState(null)

   const onSubmit = () => {
      setError(null);
      if (!newDisplayName || !newDireccion) {
         setError("No puede estar vacio los datos")
      } else {
         setIsLoading(true)
         const update = {
            displayName: newDisplayName,
         }
         firebase
         .auth()
            .currentUser.updateProfile(update)
         .then(() => {
            setIsLoading(false)
            setRealoadUserInfo(true)
            setShowModal(false)
         })
         .catch(() => {
            setError("Error al actualizar el nombre.")
            setIsLoading(false)
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
            errorMessage={error}
         />
         <Input
            placeholder="Direccion"
            containerStyle={styles.input}
            rightIcon={<Icon color='#128c7e' name='directions' type='SimpleLineIcons'/>}
            defaultValue={direccion || ""}
            onChange={(e) => setNewDireccion(e.nativeEvent.text)}
            errorMessage={error}
         />
         <Button
            title="Cambiar Datos"
            containerStyle={styles.btnContainer}
            buttonStyle={styles.btn}
            onPress={onSubmit}
            loading={isLoading}
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