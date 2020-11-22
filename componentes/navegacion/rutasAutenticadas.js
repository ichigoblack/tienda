import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import User from './user'
import Admin from './admin'
import Carga from '../pantalla/cargaActiva'

const Stack = createStackNavigator();

export default function rutasNoAutenticadas() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Carga"
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="User" component={User} />
                <Stack.Screen name="Admin" component={Admin} />
                <Stack.Screen name="Carga" component={Carga} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}