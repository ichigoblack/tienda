import React from 'react'
import {View,StyleSheet} from 'react-native'
import {createStackNavigator} from '@react-navigation/stack'

import Tienda from '../market/market'
import Detalle from '../market/detalle'

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
                    component={Detalle}
                    name="detalle"
                    options={{
                        headerTransparent: true,
                        headerTintColor: "#128C7E",
                        title: "",
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