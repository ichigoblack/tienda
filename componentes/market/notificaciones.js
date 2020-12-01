import {size} from 'lodash'
import {Avatar} from 'react-native-elements'
import {FontAwesome} from '@expo/vector-icons'
import moment from 'moment/min/moment-with-locales'
import React,{useEffect,useState,useCallback} from 'react'
import {useNavigation,useFocusEffect} from '@react-navigation/native'
import {Text,View,FlatList,StyleSheet,TouchableOpacity} from 'react-native'
import {ListarOrdenes} from '../../utils/acciones'

export default function Notificaciones() {
    
    const navigation = useNavigation()
    const [mensaje, setmensaje] = useState("Cargando..")
    const [notificaciones, setnotificaciones] = useState(null)


    moment.locale("es")

    useEffect(() => {
        (async () => {
            consultar()
        })()
    }, [])

    useFocusEffect(
        useCallback(() => {
        consultar()
            return () => {
            }
        }, [])
    )
    const consultar = async () => {
        const consulta = await ListarOrdenes()
        if (consulta.statusresponse) {
            setnotificaciones(consulta.data)
        } else {
            setmensaje("No se encontraron mensajes")
        }
    }

    return(
        <View style={styles.principal}>
            {size(notificaciones)>0 ? (
                <View style={{ backgroundColor: "#fff", flex: 1 }}>
                    <FlatList
                        data={notificaciones}
                        renderItem={(item) => (
                            <Notificacion notificacion={item} navigation={navigation} />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View> 
            ):(
                <View style={{ justifyContent: "center",flex:1,alignItems:'center'}}>
                    <View style={styles.containerProductosInterno}>
                        <FontAwesome name="bell" size={100} color="#25d366" style={{ margin: 10 }}/>
                    </View>
                </View>
            )}
        </View>
    )
}

function Notificacion(props) {
  
    const {notificacion,navigation} = props
    const {id,iva,user,total,items,numero,subtotal,fechacreacion} = notificacion.item
    const {nombre,foto} = user

  return (
    <TouchableOpacity
        onPress={() => {navigation.navigate("mensaje", {id:id,contacto:user,items:items,numero:numero,subtotal:subtotal,iva:iva,total:total,})}}
    >
        <View style={styles.container}>
            <View>
                <Avatar
                    size="large"
                    source={foto? {uri:foto}: require("../../assets/avatar.jpg")}
                    rounded
                    style={styles.avatar}
                />
            </View>
            <View>
                <Text style={{ fontWeight: "bold" }}>
                {nombre}
                    <Text style={{ fontWeight: "normal" }}>
                    {" "}
                    ha realizazo un pedido el numero de su orden es{" "}
                    </Text>
                    <Text style={{ fontWeight: "bold" }}> {numero}</Text> -{" "}
                    {moment(fechacreacion.toDate()).startOf("hour").fromNow()}
                </Text>
            </View>
        </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    principal:{
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flexDirection: "row",
        paddingVertical: 20,
        paddingLeft: 10,
        paddingRight: 40,
        borderBottomColor: "#bdbdbd",
        borderBottomWidth: 1,
        alignItems: "center",
        justifyContent: "space-between",
    },
    avatar: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    containerProductosInterno: {
        width:200,
        height:200,
        borderWidth: 1,
        borderRadius: 100,
        alignItems: 'center',
        borderColor: "#25d366",
        justifyContent: "center",
    },
})