import {isEmpty} from 'lodash'
import Loading from '../loading'
import * as Facebook from 'expo-facebook'
import {StatusBar} from 'expo-status-bar'
import firebase from '../../utils/firebas'
import Toast from 'react-native-easy-toast'
import React,{useRef,useState} from 'react'
import {TextInput} from 'react-native-paper'
import {validateEmail} from '../../utils/validateEmail'
import {View,Alert,Image,Dimensions,StyleSheet} from 'react-native'
import {Text,Button,SocialIcon,ThemeProvider} from 'react-native-elements'
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view"

export default function LoginForm({navigation}) {

    const toastRef = useRef(); 
    const[email, setEmail] = useState("")
    const[password, setPassword] = useState("")
    const[icono, setIcono] = useState("eye-off")
    const[loading, setLoading] = useState(false)
    const[security, setSecurity] = useState(true)

    const photo={
        foto:require("../../assets/reactNative.png"),
    }

    const theme = {
        Button:{
            titleStyle: {
                color: 'black',
                fontWeight : 'bold',
            },
        },
    }

    const clave = () => {
        if(security){
            setIcono("eye")
            setSecurity(false)
        }else{
            setSecurity(true)
            setIcono("eye-off")
        }
    }

    function CreateAccount() {
        //const navigation = useNavigation();
        return (
            <Text style={styles.textRegister}>
                ¿Aún no tienes una cuenta?{" "}
                <Text
                    style={styles.btnRegister}
                    //onPress={() => navigation.navigate("register")}
                >
                    Regístrate
                </Text>
            </Text>
        );
    }

    const initLogin=()=>{
        if(isEmpty(email)||isEmpty(password)){
            toastRef.current.show("Todos los campos son obligatorios");
            console.log("Todos los campos son obligatorios")
        }else if (!validateEmail(email)) {
            toastRef.current.show("El email no es correcto");
            console.log("El email no es valido")
        }else{
            console.log("vamos bien")
            let user={
                email:email.trim(),
                password:password.trim()
            }
            firebase.auth().signInWithEmailAndPassword(user.email,user.password)
            .then((res)=>{
                //toastRef.current.show("resultado bueno",res);
                navigation.navigate('Navegacion')
            })
            .catch((res)=>{
                toastRef.current.show("resultado malo",res);
                console.log("resultado malo",res)
                //toastRef.current.show("Correo o contraseña incorrecta",2000)
            })
        }
    }

     /****************************FACEBOOK ********************************************** */
    async function loginFacbook() {
        try {
            await Facebook.initializeAsync({
                appId: '3403582586374104',
                appName: 'goSender',
                domain: 'connect.facebook.net',
            });
            const {
            type,
            token,
            expires,
            permissions,
            declinedPermissions,
            } = await Facebook.logInWithReadPermissionsAsync({
                permissions: ["public_profile"],
            });
            if (type === "success") {
            // Get the user's name using Facebook's Graph API
                const response = await fetch(
                `https://graph.facebook.com/me?access_token=${token}`
                );
                const credential = firebase.auth.FacebookAuthProvider.credential(token);
                firebase
                .auth()
                .signInWithCredential(credential)
                .catch((error) => {
                    console.log(JSON.stringify(error));
                    alert(error.message);
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

/**************************** FINAL FACEBOOK **************************************** */
    

    return (
        <KeyboardAwareScrollView style={{backgroundColor:'white'}}>
            <View  style={styles.container}>
                <View style={styles.containerHead}>
                    <Image
                        source={photo.foto}
                        resizeMode="contain"
                        style={styles.logo}
                        //style={{width:200,height:200,borderRadius:20}}
                    />
                </View>
                <View style={styles.containerBody}>
                    <TextInput
                        label='Email'
                        value={email}
                        mode='outlined'
                        style={styles.input}
                        onChangeText={text => setEmail(text)}
                        right={<TextInput.Icon name="email"/>}
                        theme={{colors:{text:'grey',primary:'rgb(33,151,186)'}}}
                    />
                    <TextInput
                        mode='outlined'
                        value={password}
                        label='Contraseña'
                        style={styles.input}
                        secureTextEntry={security}
                        right={<TextInput.Icon name={icono} onPress={clave}/>}
                        onChangeText={text => setPassword(text)}
                        theme={{colors:{text:'grey',primary:'rgb(33,151,186)'}}}
                    />
                </View>
                <View style={styles.containerImagen}>
                    <ThemeProvider theme={theme}>
                        <Button 
                            title="Iniciar sesión"
                            buttonStyle={{backgroundColor:'#F92880',borderRadius:20}}
                            onPress={initLogin}
                            containerStyle={styles.boton}
                        />
                    </ThemeProvider>
                    <CreateAccount/>
                </View>
                <View style={styles.containerFooter}>
                    <View style={styles.linea}/>
                    <SocialIcon
                        button
                        type="facebook"
                        style={{width:'60%'}}
                        title="Iniciar sesión"
                        onPress={loginFacbook}
                    />
                </View>
            </View>
            <StatusBar style="auto" />
            <Loading isVisible={loading} text="Iniciando sesión" /> 
            <Toast ref={toastRef} position="center" opacity={0.9} />
        </KeyboardAwareScrollView>
    );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    logo:{
        height: 150,
        width: "100%",
        marginTop: 20,
    },
    input:{
        marginLeft:30,
        marginRight:30
    },
    container:{
        flex:1,
        marginTop:40,
        height:windowHeight*0.99,
        backgroundColor:'pink',
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
    linea:{
        width:'55%',
        marginTop:'10%',
        marginLeft:'10%',
        marginRight:'10%',
        marginBottom:'10%',
        //alignItems:'center',
        borderBottomWidth:2,
        justifyContent:'center',
        borderBottomColor:'grey',
    },
    boton:{ 
        width:'50%', 
        backgroundColor:'#F92880',
    },
    containerHead:{
        flex:1,
        justifyContent:'center',
        //backgroundColor:'orange'  
    },
    containerBody:{
        flex:0.7,
        justifyContent:'center',
        //backgroundColor:'yellow'  
    },
    containerImagen:{
        flex:0.5,
        alignItems:'center',
        justifyContent:'center',
        //backgroundColor:'orange'  
    },
    containerFooter:{
        flex:1,
        alignItems:'center',
        //backgroundColor:'brown'  
    },
})



/*
const loginFacbook = async () => {
        const appId = '3403582586374104';
        await Facebook.initializeAsync(appId);
        const { type, token } = await Facebook.logInWithReadPermissionsAsync({ permissions: ['public_profile'] })
        if (type === "success") {
            const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
            Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
            console.log("ok")
          //setLoading(true);
            const credentials = firebase.auth.FacebookAuthProvider.credential(token);
            console.log(credentials)
            firebase
                .auth()
                .signInWithCredential(credentials)
                .then(() => {
                //setLoading(false);
                //navigation.navigate("account");
                //toastRef.current.show("Inicio de sesion correcto");
                    console.log("Inicio de sesion correcto")
                })
                .catch(() => {
                //setLoading(false);
                    console.log("Credenciales incorrectas.")
                //toastRef.current.show("");
                });
        }else if (type === "cancel") {
            setLoading(false);
            toastRef.current.show("Inicio de sesion cancelado");
        }else {
            setLoading(false);
            toastRef.current.show("Error desconocido, intentelo más tarde");
        }
    } */


    /*import React from 'react'
import CustomTab from '../CustomTab'
import {Icon} from 'react-native-elements'
import {View,StyleSheet} from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'


import Perfil from "../perfil/perfil"

const Tab = createBottomTabNavigator();

export default function Interna(){
    return (
        <Tab.Navigator
            initialRouteName="Imbox"
            tabBarOptions={{
                activeTintColor: "#fff",
                activeBackgroundColor: "#feb72b",
                inactiveTintColor: "gray"
            }}
            tabBar={props => <CustomTab {...props} />}
        >
            <Tab.Screen
                name="Home"
                component={Perfil}
                options={{
                    title: "Inicio",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="ios-home" size={size} color={color} />
                    )
                }}
            />
            <Tab.Screen
                name="Imbox"
                component={Perfil}
                options={{
                    title: "Mensajes",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="ios-chatboxes" size={size} color={color} />
                    )
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Perfil}
                    options={{
                    title: "Perfil",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="ios-contact" size={size} color={color} />
                    )
                }}
            />
            <Tab.Screen
                name="Casa"
                component={Perfil}
                options={{
                    title: "Inicio",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="ios-home" size={size} color={color} />
                    )
                }}
            />
            <Tab.Screen
                name="Mensaje"
                component={Perfil}
                options={{
                    title: "Mensajes",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="ios-chatboxes" size={size} color={color} />
                    )
                }}
            />
        </Tab.Navigator>
    )
}

function screenOptions(route , color){
    let iconName;
    
    switch (route.name){
        case "Perfil":
            iconName = "user";
            color = "black";
            break;
        case "Perfil2":
            iconName = "user";
            color = "black";
            break;
        case "Perfil5":
            iconName = "user";
            color = "black";
            break;
        default:
            break;
    }
    return(
        <Icon type="font-awesome-5" name={iconName} size={22} color={color}/>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: 75,
        alignItems: 'center'
      },
})*/


/*
<NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="Tienda"
          component={TabBar}
          options={{
            title: "Tienda",
            drawerIcon: () => {
              <Icon type="material-community" name="store" size={24} />;
            },
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer> */
