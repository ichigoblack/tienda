import {isEmpty} from 'lodash'
import Loading from '../loading'
import React,{useRef,useState} from 'react'
import CodeInput from 'react-native-code-input'
import {Button,Icon} from 'react-native-elements'
import {confirmarcodigo} from '../../utils/acciones'
import FirebaseRecapcha from '../../utils/firebaseRecapcha'
import {useRoute,useNavigation} from '@react-navigation/native'
import {Text,View,Alert,Image,StyleSheet,ActivityIndicator} from 'react-native'
import {obtenerToken,ObtenerUsuario,actualizarRegistro,enviarconfirmacionphone,registerForPushNotificationsAsync} from '../../utils/acciones'

export default function EnviarConfirmacion(props) {

    const route = useRoute()
    const inputphone = useRef()
    const navigation = useNavigation()
    const recaptchaVerifier = useRef()
    const [phone, setphone] = useState("")
    const [codigo, setCodigo] = useState(false)
    const [loading, setLoading] = useState(false)
    const [confirmacion, setConfirmacion] = useState(false)

    const enviarCodigo = async () => {
        setCodigo(true)
        setConfirmacion(true)
        const verificationid = await enviarconfirmacionphone(route.params.numero,recaptchaVerifier)
        if(!isEmpty(verificationid)){
            console.log("vamos bien")
            setphone(verificationid)
        }else{
            console.log("vamos mal")
            Alert.alert(
                "Verificación",
                "Favor introduzca un número de teléfono válido",
                [{
                    style: "cancel",
                    text: "Entendido",
                    onPress: () => {
                      inputphone.current.clear()
                      inputphone.current.focus()
                    },
                }]
            )
        }  
    } 

    const confirmarCodigoSMS = async (code) => {
        setLoading(true)
        const resultado = await confirmarcodigo(phone, code)
        console.log(resultado)
        if (resultado) {
            const {uid} = ObtenerUsuario()
            const token = await obtenerToken()
            console.log("token",token)
            const updateDatos = await actualizarRegistro("users",uid,{token:token,telefonoAuth:true})
            console.log("updateDatos",updateDatos)
            setLoading(false)
            navigation.navigate("Perfil")
        } else {
            Alert.alert("Error", "Favor válidar el código introducido", [{
                style: "default",
                text: "Entendido",
            }])
            setLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <Image
                source={require("../../assets/reactNative.png")}
                style={styles.imglogo}
            />    
            <View style={styles.panel}>
                <View style={styles.linea}/>
                <View style={styles.panelinterno}>
                    <Icon
                        name="whatsapp"
                        type="material-community"
                        size={100}
                        color="#25D366"
                        containerStyle={{marginTop:20,marginBottom:10}}
                    />
                    <Text style={styles.titulo}>Favor ingresa tu código de Whatsapp</Text>
                    {codigo &&
                        <View style={styles.viewtelefono}>
                            <CodeInput
                                activeColor="black"
                                inactiveColor="black"
                                autoFocus={true}
                                inputPosition="center"
                                size={50}
                                codeLength={6}
                                containerStyle={{ marginBottom: 20 }}
                                codeInputStyle={{ borderWidth: 1.5 }}
                                onFulfill={(code) => {confirmarCodigoSMS(code)}}
                                secureTextEntry
                            />
                        </View>
                    }
                    {!codigo &&
                        <Button
                            title="Recibir Código"
                            buttonStyle={{ backgroundColor: "#25d366", marginHorizontal: 20 }}
                            onPress={() => enviarCodigo()}
                        />
                    }
                    {confirmacion && (
                        <View style={{marginTop:10}}>
                            <ActivityIndicator size="large" color="#00ff00"/>
                        </View>
                    )}
                </View>
            </View>
            <Loading isVisible={loading} text="Favor espere"/>
            <FirebaseRecapcha referencia={recaptchaVerifier}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#128C7E",
    },
    linea: {
        width: 100,
        borderBottomWidth: 2,
        borderBottomColor: "#25d366",
    },
    imglogo: {
        width: 106,
        height: 106,
        alignSelf: "center",
        marginVertical: 40,
    },
    panel: {
        flex: 1,
        paddingTop: 20,
        alignItems: "center",
        backgroundColor: "#fff",
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    },
    panelinterno: {
        flex: 1,
        marginHorizontal: 20,
    },
    titulo: {
        fontSize: 16,
        marginTop: 20,
        color: "#25d366",
        marginBottom: 10,
        fontWeight: "bold",
        textAlign: "center",
    },
    viewtelefono: {
        height: 70,
        marginTop: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    input: {
        width: "80%",
        height: 50,
        marginLeft: 5,
    },
})