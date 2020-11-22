import React from 'react'
import {View,StyleSheet} from 'react-native'
import {createStackNavigator} from '@react-navigation/stack'

import Micarrito from '../carrito/carrito'

const Stack = createStackNavigator()

export default function CarritoStack() {
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
                    component={Micarrito}
                    name="Micarrito"
                    options={{
                        headerLeft: null,
                        title: "Mi Carrito",
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