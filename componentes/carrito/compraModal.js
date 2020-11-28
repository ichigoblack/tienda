import Loading from '../loading'
import React,{useState} from 'react'
import {Button} from 'react-native-elements'
import {Text,View,Alert,StyleSheet} from 'react-native'
import {addRegistro,numberOrden} from '../../utils/acciones'
import AsyncStorage from '@react-native-community/async-storage'

export default function compraModal(props) {

    const {datos,setReload,setShowModal} = props
    const [loading, setloading] = useState(false)

    const generarCompra=async()=>{
        setloading(true)
        datos.numero = await numberOrden()
        //console.log("numero",datos.numero)
        //setShowModal(false)
        const registrar = await addRegistro("orden", datos)
        if (registrar.statusreponse) {
            setloading(false)
            Alert.alert(
                "Registro Exitoso",
                "La orden se ha registrado correctamente",
                [{
                    style: "cancel",
                    text: "Aceptar",
                        onPress: async() => {
                            await clearAllStorage()
                            setReload(true)
                            setShowModal(false)
                        }
                }]
            )
          } else {
            setloading(false)
            Alert.alert(
                "Registro Fallido",
                "Ha ocurrido un error al registrar orden",
                [{
                    style: "cancel",
                    text: "Aceptar",
                }]
            )
        }
    }

    const clearAllStorage = async () => {
        try {
          await AsyncStorage.removeItem("producto")
          //alert('Storage successfully cleared!')
        } catch (e) {
          alert('Failed to clear the async storage.')
        }
    }

    return (
        <View style={styles.view}>
            <View style={{width:'100%',flexDirection:'row'}}>
                <View style={{width:'70%'}}>
                    <Text style={{fontSize:24}}>Subtotal </Text>
                </View>
                <View style={{width:'30%',alignItems:'flex-end'}}>
                    <Text style={{fontSize:20,marginRight:30}}>${datos.subtotal}</Text>
                </View>
            </View>
            <View style={{width:'100%',flexDirection:'row',borderBottomWidth:1,borderBottomColor: "#128c7e"}}>
                <View style={{width:'70%'}}>
                    <Text style={{fontSize:24}}>IVA </Text>
                </View>
                <View style={{width:'30%',alignItems:'flex-end'}}>
                    <Text style={{fontSize:20,marginRight:30}}>${datos.iva}</Text>
                </View>
            </View>
            <View style={{width:'100%',flexDirection:'row'}}>
                <View style={{width:'70%'}}>
                    <Text style={{fontSize:24}}>Total </Text>
                </View>
                <View style={{width:'30%',alignItems:'flex-end'}}>
                    <Text style={{fontSize:20,marginRight:30}}>${datos.total}</Text>
                </View>
            </View>
            <Button
                title="Finalizar Compra"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={()=>generarCompra()}
            />
            <Loading isVisible={loading} text="Se esta registrando su pedido" />
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
        width: "70%",
    },
    btn: {
        backgroundColor: "#00a680",
    },
})