import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Navegacion from './interna'
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
                <Stack.Screen name="Carga" component={Carga} />
                <Stack.Screen name="Navegacion" component={Navegacion} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}