import React,{useState} from 'react'
import {enviarWhatsapp} from '../../utils/utils'
import {Picker} from '@react-native-picker/picker'
import {actualizarRegistro} from '../../utils/acciones'
import {Icon,Avatar,Button} from 'react-native-elements'
import {useRoute,useNavigation} from '@react-navigation/native'
import {Text,View,Alert,Linking,FlatList,StyleSheet} from 'react-native'



export default function Mensaje() {

    const [selectedValue, setSelectedValue] = useState("1");

    const route = useRoute()
    const navigation = useNavigation()
    const {id,iva,items,total,numero,contacto,subtotal} = route.params
    const {foto,email,codigo,nombre,telefono} = contacto
    const codtel = `${codigo}${telefono}` 
    
    const mensaje = `Hola, ${nombre}. Te escribo de Tienda, me dejaste tu orden numero ${numero}. `

    const actualizar = async() =>{
        if(selectedValue === "1"){
            navigation.goBack()
        }else if(selectedValue === "2"){
            let ord = {
                estado:'completado'
            }
            await actualizarRegistro("orden", id, ord)
            .then(() => {
                Alert.alert(
                    "Actualización completa",
                    "La orden se a cancelado exitosamente",
                    [{
                        style: "cancel",
                        text: "Aceptar",
                        onPress: () => navigation.goBack(),
                    }]
                )
            })
            .catch(() => {
                Alert.alert(
                    "Error durante la actualización",
                    "La orden no se a cancelado exitosamente",
                    [{
                        style: "cancel",
                        text: "Aceptar",
                        onPress: () => navigation.goBack(),
                    }]
                )
            })
        }else{
            let ord = {
                estado:'cancelado'
            }
            await actualizarRegistro("orden", id, ord)
            .then(() => {
                Alert.alert(
                    "Actualización completa",
                    "La orden se a completado exitosamente",
                    [{
                        style: "cancel",
                        text: "Aceptar",
                        onPress: () => navigation.goBack(),
                    }]
                )
            })
            .catch(() => {
                Alert.alert(
                    "Error durante la actualización",
                    "La orden no se a completado exitosamente",
                    [{
                        style: "cancel",
                        text: "Aceptar",
                        onPress: () => navigation.goBack(),
                    }]
                )
            })
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.panel}>
                <Avatar
                    size="large"
                    source={
                        foto ? { uri: foto } : require("../../assets/avatar.jpg")
                    }
                    rounded
                    style={styles.avatar}
                />
                <View style={{ marginLeft: 5 }}>
                    <Text style={styles.text}>{nombre}</Text>
                    <Text style={styles.text}>{email}</Text>
                </View>
                <View style={styles.rowicon}>
                    <Icon
                        type="material-community"
                        name="whatsapp"
                        reverse
                        size={30}
                        color="#25d366"
                        onPress={() => enviarWhatsapp(codtel, mensaje)}
                    />
                    <Icon
                        type="material-community"
                        name="phone-in-talk"
                        reverse
                        size={30}
                        color="#25d366"
                        onPress={() => Linking.openURL(`tel:+${codigo}${telefono}`)}
                    />
                </View>
            </View>
            <View style={styles.informacion}>
                <Text style={{fontSize:30}}>Orden Numero {numero}</Text>
                <View style={{flex:1,marginTop:10}}>
                    <FlatList
                        data={items}
                        renderItem={({ item: rowData }) => {
                            return(
                                <View style={{flex:1,flexDirection:'row'}}>
                                    <View style={{width:'20%',alignItems:'center'}}>
                                        <Text style={{fontSize:22,marginRight:20}}>{rowData.numero}</Text>
                                    </View>
                                    <View style={{width:'40%'}}>
                                        <Text style={{fontSize:22,marginRight:20}}>{rowData.nombre}</Text>
                                    </View>
                                    <View style={{width:'40%',justifyContent:'center',alignItems:'center'}}>
                                        <Text style={{fontSize:22}}>{rowData.cantidad}</Text>
                                    </View>
                                </View>
                            )
                        }}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                <View style={styles.view}>
                    <View style={{width:'100%',flexDirection:'row'}}>
                        <View style={{width:'70%'}}>
                            <Text style={{fontSize:24}}> Subtotal </Text>
                        </View>
                        <View style={{width:'30%',alignItems:'flex-end'}}>
                            <Text style={{fontSize:20,marginRight:30}}>${subtotal}</Text>
                        </View>
                    </View>
                    <View style={{width:'100%',flexDirection:'row',borderBottomWidth:1,borderBottomColor: "#128c7e"}}>
                        <View style={{width:'70%'}}>
                            <Text style={{fontSize:24}}> IVA </Text>
                        </View>
                        <View style={{width:'30%',alignItems:'flex-end'}}>
                            <Text style={{fontSize:20,marginRight:30}}>${iva}</Text>
                        </View>
                    </View>
                    <View style={{width:'100%',flexDirection:'row'}}>
                        <View style={{width:'70%'}}>
                            <Text style={{fontSize:24}}> Total </Text>
                        </View>
                        <View style={{width:'30%',alignItems:'flex-end'}}>
                            <Text style={{fontSize:20,marginRight:30}}>${total}</Text>
                        </View>
                    </View>
                </View>
                <View style={{width:'100%',flexDirection:'row',marginTop:10,marginBottom:50,alignItems:'center'}}>
                    <Text style={{fontSize:20,marginRight:30}}> Estado</Text>
                    <Picker
                        selectedValue={selectedValue}
                        style={{ height: 50, width: 180, marginRight:20}}
                        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                    >
                        <Picker.Item label="Pendiente" value="1" />
                        <Picker.Item label="Cancelado" value="2" />
                        <Picker.Item label="Completado" value="3" />
                    </Picker>
                    <Button
                        title="Guardar"
                        containerStyle={{width:100}}
                        buttonStyle={{backgroundColor:'#25d366'}}
                        onPress={()=>actualizar()}
                    />
                </View>
            </View>
        </View>
    )
}
//<Loading isVisible={loading} text="Se esta registrando su pedido" />
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    view: {
        marginBottom: 10,
        alignItems: "center",
    },
    avatar: { 
        width: 50, 
        height: 50 
    },
    panel: {
        margin: 10,
        padding: 20,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#075e54",
    },
    text: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "bold",
        fontFamily: "Roboto",
    },
    rowicon: {
        flex:1,
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    informacion:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        
    }
})
