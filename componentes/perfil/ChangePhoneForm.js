import {size,isEmpty} from 'lodash'
import React,{useRef,useState} from 'react'
import CodeInput from 'react-native-code-input'
import {Input,Button} from 'react-native-elements'
import {Text,View,Alert,StyleSheet} from 'react-native'
import FirebaseRecapcha from '../../utils/firebaseRecapcha'
import CountryPicker from 'react-native-country-picker-modal'
import {obtenerToken,confirmarcodigo,reConfirmarcodigo,actualizarRegistro,enviarconfirmacionphone} from '../../utils/acciones'

export default function ChangePhoneForm(props) {

    const {user,datos,setShowModal,setReloadUser} = props

    const inputphone = useRef()
    const recaptchaVerifier = useRef()
    const [phone, setphone] = useState("")
    const [error, setError] = useState(null)
    const [country, setcountry] = useState("EC")
    const [codigoVal, setCodigoVal] = useState(false)
    const [validador, setValidador] = useState(false)
    const [phoneNumber, setphoneNumber] = useState("")
    const [callingCode, setcallingcode] = useState("593")
    const [textA, setTextA] = useState("Agregar Telefono")
    const [textB, setTextB] = useState("Cambiar Telefono")
    const [isLoading, setIsLoading] = useState(datos.telefonoAuth)

    const onSubmit = () => {
        setError(null)
        if(!phone){
            setError("Debe llenar el campo")
        }else if(size(phone) < 6){
            setError("Debe colocar un numero valido")
        }else if(!datos.telefonoAuth){
            setTextB("Recibir Codigo")
            setIsLoading(true)
            setValidador(true)
        }else{
            if(phone === datos.telefono && callingCode === datos.codigo){
                setError("Debe colocar un nuevo numero")
            }else{
                setTextA("Recibir Codigo")
                setIsLoading(false)
                setValidador(true)
            }
        }
    }

    const onCodigo = () => {
        const ce = callingCode
        const ne = phone
        const numero = `+${ce}${ne}` 
        if(datos.telefonoAuth){
            setCodigoVal(true)
            enviarCodigo(numero)
        }else{
            setCodigoVal(true)
            enviarCodigo(numero)
        }
    }

    const confirmarCodigoSMS = async (code) => {
        if(datos.telefonoAuth){
            const resultado = await reConfirmarcodigo(phoneNumber, code)
            if (resultado) {
                const token = await obtenerToken()
                let datosTelefono = {
                    token:token,
                    telefono:phone,
                    codigo:callingCode,
                }
                const updateDatos = await actualizarRegistro("users",user.uid,datosTelefono)
                setReloadUser(true)
                setShowModal(false)
            } else {
                Alert.alert("Error", "Favor válidar el código introducido", [{
                    style: "default",
                    text: "Entendido",
                }])
            }
        }else{
            const resultado = await confirmarcodigo(phoneNumber, code)
            if (resultado) {
                const token = await obtenerToken()
                let datosTelefono = {
                    token:token,
                    telefono:phone,
                    telefonoAuth:true,
                    codigo:callingCode,
                }
                const updateDatos = await actualizarRegistro("users",user.uid,datosTelefono)
                setReloadUser(true)
                setShowModal(false)
            } else {
                Alert.alert("Error", "Favor válidar el código introducido", [{
                    style: "default",
                    text: "Entendido",
                }])
            }
        }
    }

    const enviarCodigo = async (numero) => {
        const verificationid = await enviarconfirmacionphone(numero,recaptchaVerifier)
        if(!isEmpty(verificationid)){
            setphoneNumber(verificationid)
        }else{
            Alert.alert(
                "Verificación",
                "Favor introduzca un número de teléfono válido",
                [{
                    style: "cancel",
                    text: "Entendido",
                    onPress: () => {
                        setCodigoVal(false)
                        setValidador(false)
                    },
                }]
            )
        }  
    } 

    return (
        <View style={styles.view}>
            {!validador &&
                <View style={styles.viewtelefono}>
                    <CountryPicker
                        withFlag
                        withCallingCode
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
                    <Input
                        value={phone}
                        maxLength={9}
                        ref={inputphone}
                        errorMessage={error}
                        keyboardType="numeric"
                        inputStyle={{fontSize:15}}
                        placeholderTextColor="#fff"
                        placeholder="Número Telefónico"
                        containerStyle={styles.inputNumero}
                        onChangeText={(text) => setphone(text)}
                        inputContainerStyle={{borderBottomWidth:0}}
                    />
                </View>
            }
            {codigoVal &&
                <View style={styles.viewCodeInput}>
                    <CodeInput
                        size={50}
                        codeLength={6}
                        secureTextEntry
                        autoFocus={true}
                        activeColor="black"
                        inactiveColor="black"
                        inputPosition="center"
                        containerStyle={{ marginBottom: 20 }}
                        codeInputStyle={{ borderWidth: 1.5 }}
                        onFulfill={(code) => {confirmarCodigoSMS(code)}}
                    />
                </View>
            }
            <Button
                loading={codigoVal}
                buttonStyle={styles.btn}
                title={isLoading ? textB : textA}
                containerStyle={styles.btnContainer}
                onPress={validador ? onCodigo : onSubmit}
            />
            <FirebaseRecapcha referencia={recaptchaVerifier}/>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: "center",
    },
    input: {
        marginBottom: 10,
    },
    btnContainer: {
        width: "95%",
        marginTop: 20,
    },
    btn: {
        backgroundColor: "#00a680",
    },
    viewtelefono: {
        height: 50,
        marginTop:20,
        marginLeft:40,
        marginRight:40,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(37, 211, 106, 0.6)",
    },
    inputNumero: {
        height: 50,
        width: "80%",
        marginTop: 10,
        marginLeft: 5,
    },
    viewCodeInput: {
        height: 70,
        marginTop: 10,
        borderRadius: 10,
        marginBottom: 20,
    },
})