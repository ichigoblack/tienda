import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'

import Perfil from '../perfil/perfil'

const Stack = createStackNavigator();

export default function PerfilStack() {
  return (
    <Stack.Navigator 
      initialRouteName="Perfil"
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Perfil" component={Perfil} />
    </Stack.Navigator>
  );
}
