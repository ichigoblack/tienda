import {size} from 'lodash'
import React,{useState} from 'react'
import * as firebase from 'firebase'
import {Text,View,StyleSheet} from 'react-native'
import {Input,Button} from 'react-native-elements'
import {reauthenticate} from '../../utils/acciones'

export default function ChangePasswordForm(props) {
  
    const {setShowModal} = props
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState(defualtValue())
    const [showPasswordA, setShowPasswordA] = useState(false)
    const [showPasswordN, setShowPasswordN] = useState(false)
    const [showPasswordR, setShowPasswordR] = useState(false)

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }

    const onSubmit = async () => {
        let isSetErrors = true
        let errorsTemp = {}
        setErrors({})
        if (!formData.password || !formData.newPassword || !formData.repeatNewPassword) {
            errorsTemp = {
                password: !formData.password
                ? "La contraseña no puede estar vacia."
                : "",
                newPassword: !formData.newPassword
                ? "La contraseña no puede estar vacia."
                : "",
                repeatNewPassword: !formData.repeatNewPassword
                ? "La contraseña no puede estar vacia."
                : "",
            }
        } else if (formData.newPassword !== formData.repeatNewPassword) {
            errorsTemp = {
                newPassword: "Las contraseñas no son iguales",
                repeatNewPassword: "Las contraseñas no son iguales",
            }
        } else if (size(formData.newPassword) < 6) {
            errorsTemp = {
                newPassword: "La contraseña tiene que ser mayor a 5 caracteres.",
                repeatNewPassword: "La contraseña tiene que ser mayor a 5 caracteres.",
            }
        } else {
            setIsLoading(true)    
            await reauthenticate(formData.password)
            .then(async () => {
                await firebase
                .auth()
                .currentUser.updatePassword(formData.newPassword)
                .then(() => {
                    isSetErrors = false
                    setIsLoading(false)
                    setShowModal(false)
                    firebase.auth().signOut()
                })
                .catch(() => {
                    errorsTemp = {
                        other: "Error al actualizar la contraseña",
                    }
                    setIsLoading(false)
                })
            })
            .catch(() => {
                errorsTemp = {
                    password: "La contraseña no es correcta.",
                }
                setIsLoading(false)
            })
        }
        isSetErrors && setErrors(errorsTemp)
    }

    return (
        <View style={styles.view}>
            <Input
                placeholder="Contraseña actual"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showPasswordA ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: showPasswordA ? "eye-off-outline" : "eye-outline",
                    color: "#128c7e",
                    onPress: () => setShowPasswordA(!showPasswordA),
                }}
                onChange={(e) => onChange(e, "password")}
                errorMessage={errors.password}
            />
            <Input
                placeholder="Nueva contraseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showPasswordN ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: showPasswordN ? "eye-off-outline" : "eye-outline",
                    color: "#128c7e",
                    onPress: () => setShowPasswordN(!showPasswordN),
                }}
                onChange={(e) => onChange(e, "newPassword")}
                errorMessage={errors.newPassword}
            />
            <Input
                placeholder="Repetir nueva contraseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showPasswordR ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: showPasswordR ? "eye-off-outline" : "eye-outline",
                    color: "#128c7e",
                    onPress: () => setShowPasswordR(!showPasswordR),
                }}
                onChange={(e) => onChange(e, "repeatNewPassword")}
                errorMessage={errors.repeatNewPassword}
            />
            <Button
                title="Cambiar contraseña"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading}
            />
            <Text>{errors.other}</Text>
        </View>
    )
}

function defualtValue() {
    return {
        password: "",
        newPassword: "",
        repeatNewPassword: "",
    }
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