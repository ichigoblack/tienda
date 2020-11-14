import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Carga from '../ViewLoad'
import Login from '../cuenta/login'
import Navegacion from './interna'

const Stack = createStackNavigator();

export default function Principal() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Carga"
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="Carga" component={Carga} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Navegacion" component={Navegacion} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}