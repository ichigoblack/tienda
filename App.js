import {LogBox} from 'react-native'
import {encode,decode} from 'base-64'
import React,{useRef,useState,useEffect} from 'react'
import {validarsesion,iniciarnotificaciones} from './utils/acciones'
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
  
  const responseListener = useRef()
  const notificationListener = useRef()
  const [user, setuser] = useState(false)


  useEffect(() => {
    validarsesion(setuser)
    iniciarnotificaciones(notificationListener,responseListener)
  }, [])

  return user ? <RutasAutenticadas /> : <RutasNoAutenticadas />

}