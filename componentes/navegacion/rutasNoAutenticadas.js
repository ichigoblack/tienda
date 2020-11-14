import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'


import Login from '../cuenta/login'
import Registro from '../cuenta/registro'
import Carga from '../pantalla/cargaPasiva'

const Stack = createStackNavigator();

export default function rutasNoAutenticadas() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Carga"
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="Carga" component={Carga} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Registro" component={Registro} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}