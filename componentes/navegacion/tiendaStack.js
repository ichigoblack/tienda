import React from 'react'
import {View,StyleSheet} from 'react-native'
import {createStackNavigator} from '@react-navigation/stack'

import MiTienda from '../tienda/mitienda'
import AddProduct from '../tienda/agregarProducto'
import EditarProducto from '../tienda/editarProducto'

const Stack = createStackNavigator()

export default function MiTiendaStack() {
    return (
        <View style={styles.container}>
            <Stack.Navigator
                screenOptions={{
                    headerTintColor: "#fff",
                    headerTitleAlign: 'center',
                    headerTitleContainerStyle: {marginBottom:30},
                    headerStyle: {backgroundColor: "#128C7E",height:50},
                }}
            >
                <Stack.Screen
                    component={MiTienda}
                    name="mitienda"
                    options={{
                        headerLeft: null,
                        title: "Mi Tienda",
                    }}
                />
                <Stack.Screen
                    component={AddProduct}
                    name="add-product"
                    options={{
                        headerTintColor: "#fff",
                        title: "Agregar Nuevo Producto",
                        headerStyle: { backgroundColor: "#128C7E" },
                    }}
                />
                <Stack.Screen
                    component={EditarProducto}
                    name="edit-product"
                    options={{
                        title: "Editar Producto",
                    }}
                />
            </Stack.Navigator>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        marginTop:40,
    }
})