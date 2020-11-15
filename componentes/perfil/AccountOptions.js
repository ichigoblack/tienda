import {map} from 'lodash'
import Modal from '../Modal'
import React,{useState} from 'react'
import {Text,View,StyleSheet} from 'react-native'
import {ListItem} from 'react-native-elements'
import ChangeDisplayNameForm from './editarPerfil'

export default function AccountOptions(props) {
  
    const {user,userInfo,toastRef} = props
    const [showModal, setShowModal] = useState(false)
    const [renderComponent, setRenderComponent] = useState(null)

    const selectedComponent = (key) =>{
      switch (key) {
        case "datos":
          setRenderComponent(
            <ChangeDisplayNameForm
              toastRef={toastRef}
              setRealoadUserInfo={false}
              setShowModal={setShowModal}
              displayName={userInfo.nombre}
              direccion={userInfo.direccion}
            />
          )
          setShowModal(true)
        break
        case "correo":
          setRenderComponent(
            <Text>datos</Text>
          )
          setShowModal(true)
        break
        case "telefono":
          setRenderComponent(
            <Text>telefono</Text>
          )
          setShowModal(true)
        break
        case "contraseña":
          setRenderComponent(
            <Text>contraseña</Text>
          )
          setShowModal(true)
        break
        default:
          setRenderComponent(null)
          setShowModal(false)
        break
      }
    }

    const menuOptions = generateOptions(selectedComponent)

    return(
        <View>
            {map(menuOptions,(menu,index)=>(
                <ListItem
                    key={index}
                    title={menu.title}
                    leftIcon={{
                        type: menu.iconType,
                        name: menu.iconNameLeft,
                        color: menu.iconColorLeft,
                    }}
                    rightIcon={{
                        type: menu.iconType,
                        name: menu.iconNameRight,
                        color: menu.iconColorRight,
                    }}
                    onPress={menu.onPress}
                    containerStyle={styles.menuItem}
                />
            ))}
            {renderComponent && (
              <Modal isVisible={showModal} setIsVisible={setShowModal}>
                {renderComponent}
              </Modal>
            )}
        </View>
    )
}

function generateOptions(selectedComponent){
    return [
        {
            title: "Cambiar datos",
            iconType: "material-community",
            iconNameLeft: "account-circle",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectedComponent("datos")
        },
        {
            title: "Cambiar correo",
            iconType: "material-community",
            iconNameLeft: "email",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectedComponent("correo")
        },
        {
            title: "Cambiar telefono",
            iconType: "material-community",
            iconNameLeft: "cellphone",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectedComponent("telefono")
        },
        {
            title: "Cambiar contraseña",
            iconType: "material-community",
            iconNameLeft: "lock",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectedComponent("contraseña")
        },
    ]
}

const styles = StyleSheet.create({
    menuItem: {
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3",
    },
})