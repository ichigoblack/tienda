import {isEmpty} from 'lodash'
import Loading from '../loading'
import React,{useState} from 'react'
import * as Facebook from 'expo-facebook'
import firebase from '../../utils/firebas'
import {validaremail} from '../../utils/utils'
import {useNavigation} from '@react-navigation/native'
import {Icon,Input,Button,Divider} from 'react-native-elements'
import {View,Alert,StyleSheet,Text,TouchableOpacity} from 'react-native'
import {obtenerDatosUsuario,addRegistroEspecifico} from '../../utils/acciones'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

export default function LoginForm(props) {
    
    const {toastRef} = props
    const navigation = useNavigation()
    const [show, setshow] = useState(true)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setloading] = useState(false)

    
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
            // Get the user's name using Facebook's Graph API
            //const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
            //Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
            const credential = firebase.auth.FacebookAuthProvider.credential(token);
            //console.log("credential",credential)
            firebase.auth().signInWithCredential(credential)
            .then(async(response) => {
                //console.log(response.user)
                const usu = await obtenerDatosUsuario(response.user.uid)
                console.log("usu",usu)
                if(isEmpty(usu)){
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
                }
            })
            .catch(error => {console.log(error)})
          } else {
            // type === 'cancel'
          }
        } catch ({ message }) {
          alert(`Facebook Login Error: ${message}`);
        }
    }

    const iniciarsesion = () => {
        if(isEmpty(email) || isEmpty(password)) {
            toastRef.current.show("Debe ingresar los valores de email y password")
        }else if(!validaremail(email)) {
            toastRef.current.show("Ingrese un correo válido")
        }else{
            setloading(true);
            firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((response) => {
                setloading(false)
            })
            .catch((err) => {
                setloading(false)
                toastRef.current.show("Usuario o Contraseña invalidos")
            })
        }
    }

    function CreateAccount() {
        return(
            <Text style={styles.textRegister}>
                ¿Aún no tienes una cuenta?{" "}
                <Text
                    style={styles.btnRegister}
                    onPress={() => navigation.navigate("Registro")}
                >
                    Regístrate
                </Text>
            </Text>
        )
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
                        type="material-community"//
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
        <KeyboardAwareScrollView style={{flex: 1,
            margin: 5,
            padding: 5,
            elevation: 3,
            borderRadius: 50,
            backgroundColor: "#fff",}}>
            <View style={styles.container}>
                <View style={styles.barra}/>
                <Input
                    value={email}
                    placeholder='Correo' 
                    containerStyle={styles.input}
                    onChangeText={(text) => {setEmail(text)}}
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
                />
                <Input
                    value={password}
                    secureTextEntry={show}
                    placeholder='Contraseña' 
                    containerStyle={styles.input}
                    onChangeText={(text) => {setPassword(text)}}
                    leftIcon={{
                        type: "material-community",
                        name: "security",
                        color: "#128c7e",
                    }}
                    rightIcon={{
                        type: "material-community",
                        name: show ? "eye-outline" : "eye-off-outline",
                        color: "#128c7e",
                        onPress: () => setshow(!show),
                    }}
                />
                <Button title='Iniciar sesión' containerStyle={styles.btnLogin} buttonStyle={{backgroundColor:'#25D366'}} onPress={() => iniciarsesion()}/>
                <CreateAccount/>
                <Divider style={styles.divider}/>
                <Text style={styles.txto}>O</Text>
                <BotonesRedes/>
                <Loading isVisible={loading} text="Iniciando Sesión"/>
            </View>
        </KeyboardAwareScrollView>
    );
}

//const windowWidth = Dimensions.get('window').width;
//const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container:{
        flex:1,
        marginTop:20,
        paddingTop:20,
        alignItems:'center',
        //borderTopLeftRadius:50,
        //borderTopRightRadius:50,
        //backgroundColor:'#F5F6F8',
    },
    barra:{
        width:100,
        borderBottomWidth:2,
        borderBottomColor:'#25D366'
    },
    input:{
        height:50,
        width:'90%',
        marginTop:20,
    },
    btnRegister:{
        color:"#00a680",
        fontWeight:"bold",
    },
    textRegister:{
        marginTop:15,
        marginLeft:10,
        marginRight:10,
    },
    divider:{
        height:1,
        width:'90%',
        marginTop:20,
        backgroundColor:'#128C7E'
    },
    btnLogin:{
        width:'90%',
        marginTop:20,
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