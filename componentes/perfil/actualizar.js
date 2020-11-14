import {isEmpty} from 'lodash'
import Loading from '../loading'
import React,{useRef,useState} from 'react'
import CodeInput from 'react-native-code-input'
import {Button,Icon} from 'react-native-elements'
import {confirmarcodigo} from '../../utils/acciones'
import FirebaseRecapcha from '../../utils/firebaseRecapcha'
import CountryPicker from 'react-native-country-picker-modal'
import {useRoute,useNavigation} from '@react-navigation/native'
import {Text,View,Alert,Image,TextInput,StyleSheet,ActivityIndicator} from 'react-native'
import {obtenerToken,ObtenerUsuario,actualizarRegistro,enviarconfirmacionphone,registerForPushNotificationsAsync} from '../../utils/acciones'

export default function Actualizar() {

    const route = useRoute()
    const inputphone = useRef()
    const navigation = useNavigation()
    const recaptchaVerifier = useRef()
    const [phone, setphone] = useState("")
    const [codigo, setCodigo] = useState(false)
    const [loading, setLoading] = useState(false)

    const [country, setcountry] = useState("EC")
    const [callingCode, setcallingcode] = useState("593")

    const enviarCodigo = async () => {
        setCodigo(true)
        const ce = callingCode
        const ne = phone
        const numero = `+${ce}${ne}`
        console.log("numero",numero)
        const verificationid = await enviarconfirmacionphone(numero,recaptchaVerifier)
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
            //navigation.goBack()
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
                    {codigo &&(
                        <View style={styles.viewtelefono}>
                            <Text style={styles.titulo}>Favor ingresa tu código de Whatsapp</Text>
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
                            <View style={{marginTop:40}}>
                                <ActivityIndicator size="large" color="#00ff00"/>
                            </View>
                        </View>
                    )}
                    {!codigo &&(
                        <View style={styles.viewtelefono}>
                            <Text style={styles.titulo}>Favor ingrese su numero telefonico</Text>
                            <View style={styles.viewTelefonoCodigo}>
                                <CountryPicker
                                    withFlag
                                    withCallingCode
                                    //withFilter
                                    withCallingCodeButton
                                    withAlphaFilter
                                    countryCode={country}
                                    translation={"spa"}
                                    countryCodes={"EC"}
                                    region={"Americas"}
                                    onSelect={(Country) => {
                                        setcountry(Country.cca2)
                                        setcallingcode(...Country.callingCode)
                                    }}
                                />
                                <Text style={{ color: "#fff" }}>  | </Text>
                                <TextInput
                                    value={phone}
                                    ref={inputphone}
                                    maxLength={9}
                                    keyboardType="numeric"
                                    style={styles.inputNumero}
                                    placeholderTextColor="#fff"
                                    placeholder="Número Telefónico"
                                    onChangeText={(text) => setphone(text)}
                                />
                            </View>
                            <Button
                                title="Recibir Código"
                                buttonStyle={{ backgroundColor: "#25d366", marginHorizontal: 20 }}
                                //containerStyle={{ alignItems:'flex-end' }}
                                onPress={() => enviarCodigo()}
                            />
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
    viewTelefonoCodigo: {
        height: 50,
        marginTop:20,
        //marginLeft:40,
        //marginRight:40,
        borderRadius: 10,
        marginBottom: 20,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(37, 211, 106, 0.6)",
      },
    input: {
        width: "80%",
        height: 50,
        marginLeft: 5,
    },
})
/**
 * 
                    {codigo &&
                        <Button
                            title="Confirmar Numero"
                            buttonStyle={{ backgroundColor: "#25d366", marginHorizontal: 20 }}
                            //containerStyle={{ alignItems:'flex-end' }}
                            //onPress={() => enviarconfirmacion()}
                        />
                    }
 */