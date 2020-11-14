import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'

import Perfil from '../perfil/perfil'
import Editar from '../perfil/editarPerfil'
import Actualizar from '../perfil/actualizar'
import Enviar from '../perfil/EnviarConfirmacion'

const Stack = createStackNavigator();

export default function PerfilStack() {
  return (
    <Stack.Navigator 
      initialRouteName="Perfil"
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Editar" component={Editar} />
      <Stack.Screen name="Enviar" component={Enviar} />
      <Stack.Screen name="Perfil" component={Perfil} />
      <Stack.Screen name="Actualizar" component={Actualizar} />
    </Stack.Navigator>
  );
}
