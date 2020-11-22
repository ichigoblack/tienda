import * as firebase from 'firebase'
import React,{useState} from 'react'
import {View,StyleSheet} from 'react-native'
import {validaremail} from '../../utils/utils'
import {Input,Button} from 'react-native-elements'
import {reauthenticate} from '../../utils/acciones'

export default function ChangeEmailForm(props) {

    const {email,toastRef,setShowModal} = props
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState(defaultValue())

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }

    const onSubmit = () => {
        setErrors({})
        if (!formData.email || email === formData.email) {
            setErrors({
                email: "El email no ha cambiado.",
            })
        } else if (!validaremail(formData.email)) {
            setErrors({
                email: "Email incorrecto.",
            })
        } else if (!formData.password) {
            setErrors({
                password: "La contraseña no puede estar vacia.",
            })
        } else {
            setIsLoading(true)
            reauthenticate(formData.password)
            .then(() => {
                firebase
                .auth()
                .currentUser.updateEmail(formData.email)
                .then(() => {
                    setIsLoading(false)
                    toastRef.current.show("Email actualizado correctamente",2000)
                    setShowModal(false)
                })
                .catch(() => {
                    setErrors({ email: "Error al actualizar el email." })
                    setIsLoading(false)
                })
            })
            .catch(() => {
                setIsLoading(false)
                setErrors({ password: "La contraseña no es correcta." })
            })
        }
    }

    return (
        <View style={styles.view}>
            <Input
                placeholder="Correo electronico"
                containerStyle={styles.input}
                defaultValue={email || ""}
                rightIcon={{
                    type: "material-community",
                    name: "at",
                    color: "#128c7e",
                }}
                onChange={(e) => onChange(e, "email")}
                errorMessage={errors.email}
            />
            <Input
                placeholder="Contraseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    color: "#128c7e",
                    onPress: () => setShowPassword(!showPassword),
                }}
                onChange={(e) => onChange(e, "password")}
                errorMessage={errors.password}
            />
            <Button
                title="Cambiar email"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading}
            />
        </View>
    )
}

function defaultValue() {
  return {
    email: "",
    password: "",
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