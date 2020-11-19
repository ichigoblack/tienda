import {Icon} from 'react-native-elements'
import React, {useState,useEffect,useCallback} from 'react'
import {useNavigation,useFocusEffect} from '@react-navigation/native'
import {Alert,Text,View,Image,FlatList,StyleSheet} from 'react-native'
import {eliminarImagenes,eliminarProducto,actualizarRegistro,ListarMisProductos} from '../../utils/acciones'

export default function Mitienda(){

    const navigation = useNavigation()
    const [productos, setproductos] = useState({})
    
    useEffect(()=>{
        (async()=>{
            setproductos(await ListarMisProductos())
        })()
    },[])

    useFocusEffect(
        useCallback(() => {
            (async () => {
                setproductos(await ListarMisProductos())
            })()
        }, [])
    )

    return(
        <View style={styles.container}>
            {productos.length > 0 ? (
                <FlatList
                    data={productos}
                    renderItem={(item) => (
                        <Producto
                            producto={item}
                            navigation={navigation}
                            setproductos={setproductos}
                        />
                    )}
                />
            ) : (
                <View style={{ alignSelf: "center" }}>
                    <View style={styles.containerProductosInterno}>
                        <Icon
                            size={100}
                            color="#25d366"
                            name="cart-plus"
                            style={{ margin: 10 }}
                            type="material-community"
                        />
                    </View>
                </View>
            )}
            <Icon  
                reverse
                name="plus"
                color="#128c7e" 
                type="material-community" 
                containerStyle={styles.btnContainer}
                onPress={()=>{navigation.navigate("add-product")}} />
        </View>
    )
}

function Producto(props) {
    const {producto,navigation,setproductos} = props
    const {id,status,precio,titulo,imagenes,descripcion} = producto.item
    return (
        <View style={styles.containerProductos}>
            <Image
                resizeMethod="resize"
                source={{ uri: imagenes[0] }}
                style={{ width: 150, height: 150, borderRadius: 10, marginLeft: 10 }}
            />
            <View style={styles.viewmedio}>
                <Text style={styles.titulo}>{titulo}</Text>
                <Text style={styles.descripcion}>
                    {descripcion.length > 20 ? descripcion.substring(0, 20) : descripcion}
                    ...
                </Text>
                <Text style={styles.precio}> $ {parseFloat(precio).toFixed(2)}</Text>
                <View style={styles.iconbar}>
                <View style={styles.icon}>
                    {status === 1 ? (
                        <Icon
                            type="material-community"
                            name="close"
                            color="#25d366"
                            style={styles.icon}
                            onPress={() => {
                                Alert.alert(
                                    "Dar de baja el producto",
                                    "¿Estás Seguro de que deseas dar de baja el producto",
                                    [{
                                        style: "default",
                                        text: "Confirmar",
                                        onPress: async () => {
                                            await actualizarRegistro("productos", id, {
                                                status: 0,
                                            })
                                            setproductos(await ListarMisProductos())
                                        },
                                    },{
                                        style: "default",
                                        text: "Salir",
                                    }]
                                )
                            }}
                        />
                    ):(
                        <Icon
                            type="material-community"
                            name="check-outline"
                            color="#25d366"
                            style={styles.icon}
                            onPress={() => {
                                Alert.alert(
                                    "Dar de alta el producto",
                                    "¿Estás Seguro de que deseas dar de alta el producto",
                                    [{
                                        style: "default",
                                        text: "Confirmar",
                                        onPress: async () => {
                                            await actualizarRegistro("productos", id, {
                                                status: 1,
                                            })
                                            setproductos(await ListarMisProductos())
                                        },
                                    },{
                                        style: "default",
                                        text: "Salir",
                                    }]
                                )
                            }}
                        />
                    )}
                </View>
                <View style={styles.iconedit}>
                    <Icon
                        color="#FFA000"
                        name="pencil-outline"
                        style={styles.iconedit}
                        type="material-community"
                        onPress={() => {
                            navigation.navigate("edit-product", { id })
                        }}
                    />
                </View>
                <View style={styles.icondelete}>
                    <Icon
                        type="material-community"
                        name="trash-can-outline"
                        color="#D32F2F"
                        style={styles.icondelete}
                        onPress={async () => {
                            Alert.alert(
                                "Eliminar Producto",
                                "¿Estás seguro que deseas eliminar el producto",
                                [{
                                    style: "default",
                                    text: "Confirmar",
                                    onPress: async () => {
                                        await eliminarProducto("productos", id)
                                        await eliminarImagenes("productos", imagenes)
                                        setproductos(await ListarMisProductos())
                                    },
                                },{
                                    style: "default",
                                    text: "Salir",
                                }]
                            )
                        }}
                    />
                </View>
            </View>
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
    },
    btnContainer:{
        right: 10,
        bottom: 10,
        shadowOpacity: 0.2,
        position: 'absolute',
        shadowColor: '#000000',
        shadowOffset: {width:1,height:2},
    },
    containerProductos: {
        flex: 1,
        shadowOpacity: 0.9,
        paddingVertical: 10,
        flexDirection: "row",
        shadowColor: "#128C7E",
        borderBottomColor: 0.5,
        shadowOffset: { height: 10 },
        borderBottomColor: "#128C7E",
    },
    containerProductosInterno: {
        width: 120,
        height: 120,
        borderWidth: 1,
        borderRadius: 60,
        alignSelf: "center",
        borderColor: "#25d366",
    },
    viewmedio: {
        flex: 1,
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    titulo: {
        fontSize: 18,
        marginTop: 10,
        color: "#075e54",
        fontWeight: "700",
        textAlign: "center",
    },
    descripcion: {
        fontSize: 16,
        color: "#757575",
    },
    precio: {
        fontSize: 16,
        color: "#128c7e",
    },
    iconbar: {
        marginTop: 20,
        flexDirection: "row",
    },
    icon: {
        padding: 5,
        marginLeft: 20,
        borderWidth: 1,
        borderRadius: 60,
        borderColor: "#25D366",
    },
    iconedit: {
        padding: 5,
        marginLeft: 20,
        borderWidth: 1,
        borderRadius: 50,
        borderColor: "#FFA000",
    },
    icondelete: {
        padding: 5,
        marginLeft: 20,
        borderWidth: 1,
        borderRadius: 50,
        borderColor: "#D32F2F",
    },
})