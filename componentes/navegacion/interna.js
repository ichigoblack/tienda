import React from 'react'
import ShopButton from '../ShopButton'
import {Icon} from 'react-native-elements'
import {createDrawerNavigator} from '@react-navigation/drawer'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'

import MiTienda from "../perfil/com"
import TiendaStack from "../perfil/com"
import PerfilStack from "../navegacion/perfilStack"

const Tab = createBottomTabNavigator()
const Drawer = createDrawerNavigator()

const TabBar = () => {
  return (
    <Tab.Navigator
      initialRouteName="tienda"
      tabBarOptions={{
        inactiveTintColor: "#fff",
        activeTintColor: "pink",
        style: {
          borderTopLeftRadius: 60,
          borderTopRightRadius: 60,
          alignItems: "center",
          backgroundColor: "#128C7E",
          paddingBottom: 5,
        },
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => mostrarIcono(route, color),
      })}
    >
      <Tab.Screen
        component={TiendaStack}
        name="tienda"
        optiones={{ title: "Tienda" }}
      />
      <Tab.Screen
        component={MiTienda}
        name="mitienda"
        options={{ title: "Medio", tabBarIcon: () => <ShopButton /> }}
      />
      <Tab.Screen
        component={PerfilStack}
        name="cuenta"
        options={{ title: "Cuenta" }}
      />
    </Tab.Navigator>
  )
}

function mostrarIcono(route, color) {
  let iconName = ""

  switch (route.name) {
    case "tienda":
      iconName = "cart-outline"
      break
    case "mitienda":
      iconName = "cart-outline"
      break
    case "cuenta":
      iconName = "account-circle-outline"
      break
  }

  return (
    <Icon type="material-community" name={iconName} size={24} color={color} />
  )
}

export default function Interna() {
  return (
    <TabBar/>
  )
}