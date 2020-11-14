/*import React from 'react'
import CustomTab from '../CustomTab'
import {Icon} from 'react-native-elements'
import {View,StyleSheet} from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'


import Perfil from "../perfil/perfil"

const Tab = createBottomTabNavigator();

export default function Interna(){
    return (
        <Tab.Navigator
            initialRouteName="Imbox"
            tabBarOptions={{
                activeTintColor: "#fff",
                activeBackgroundColor: "#feb72b",
                inactiveTintColor: "gray"
            }}
            tabBar={props => <CustomTab {...props} />}
        >
            <Tab.Screen
                name="Home"
                component={Perfil}
                options={{
                    title: "Inicio",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="ios-home" size={size} color={color} />
                    )
                }}
            />
            <Tab.Screen
                name="Imbox"
                component={Perfil}
                options={{
                    title: "Mensajes",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="ios-chatboxes" size={size} color={color} />
                    )
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Perfil}
                    options={{
                    title: "Perfil",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="ios-contact" size={size} color={color} />
                    )
                }}
            />
            <Tab.Screen
                name="Casa"
                component={Perfil}
                options={{
                    title: "Inicio",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="ios-home" size={size} color={color} />
                    )
                }}
            />
            <Tab.Screen
                name="Mensaje"
                component={Perfil}
                options={{
                    title: "Mensajes",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="ios-chatboxes" size={size} color={color} />
                    )
                }}
            />
        </Tab.Navigator>
    )
}

function screenOptions(route , color){
    let iconName;
    
    switch (route.name){
        case "Perfil":
            iconName = "user";
            color = "black";
            break;
        case "Perfil2":
            iconName = "user";
            color = "black";
            break;
        case "Perfil5":
            iconName = "user";
            color = "black";
            break;
        default:
            break;
    }
    return(
        <Icon type="font-awesome-5" name={iconName} size={22} color={color}/>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: 75,
        alignItems: 'center'
      },
})*/

import React from "react"
import {NavigationContainer} from "@react-navigation/native"
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs"
import {createDrawerNavigator} from "@react-navigation/drawer"
import {Icon} from "react-native-elements"
import ShopButton from "../ShopButton"
//import CustomDrawerContent from "../Componentes/CustomDrawerContent"

import MiTienda from "../perfil/com"
import TiendaStack from "../perfil/com"
import PerfilStack from "../navegacion/perfilStack"
//aquí importaremos algunos componentes más tarde.

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

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
  );
};

function mostrarIcono(route, color) {
  let iconName = "";

  switch (route.name) {
    case "tienda":
      iconName = "cart-outline";
      break;

    case "cuenta":
      iconName = "account-circle-outline";
      break;

    case "mitienda":
      iconName = "cart-outline";
      break;
  }

  return (
    <Icon type="material-community" name={iconName} size={24} color={color} />
  );
}

export default function Interna() {
  return (
    <TabBar/>
  );
}
/*
<NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="Tienda"
          component={TabBar}
          options={{
            title: "Tienda",
            drawerIcon: () => {
              <Icon type="material-community" name="store" size={24} />;
            },
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer> */