import React from 'react'
import {View,StyleSheet} from 'react-native'
import {createStackNavigator} from '@react-navigation/stack'

import Tienda from '../market/market'
import Mensaje from '../market/mensaje'
import Notificacion from '../market/notificaciones'

const Stack = createStackNavigator()

export default function TiendaStack() {
    return (
        <View style={styles.container}>
            <Stack.Navigator>
                <Stack.Screen
                    component={Tienda}
                    name="tienda"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    component={Notificacion}
                    name="notificaciones"
                    options={{
                        title: "Notificaciones",
                        headerStyle: { backgroundColor: "#128C7E" ,height:60},
                        headerTintColor: "#fff",
                    }}
                />
                <Stack.Screen
                    component={Mensaje}
                    name="mensaje"
                    options={{
                        title: "Informacion",
                        headerStyle: { backgroundColor: "#128C7E" ,height:60},
                        headerTintColor: "#fff",
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