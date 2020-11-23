import {LogBox} from 'react-native'
import {encode,decode} from 'base-64'
import {validarsesion} from './utils/acciones'
import React,{useState,useEffect} from 'react'
import RutasAutenticadas from './componentes/navegacion/rutasAutenticadas'
import RutasNoAutenticadas from './componentes/navegacion/rutasNoAutenticadas'


if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

LogBox.ignoreLogs([
  "Animated",
  "Setting a timer",
  "Avatar.onAccessoryPress",
  "Avatar.showAccessory",
])


export default function App() {
  
  const [user, setuser] = useState(false)

  useEffect(() => {
    validarsesion(setuser)
  }, [])

  return user ? <RutasAutenticadas /> : <RutasNoAutenticadas />

}