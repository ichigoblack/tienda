import {map} from 'lodash'
import Modal from '../Modal'
import Loading from '../loading'
import React,{useState} from 'react'
import {Text,View,StyleSheet} from 'react-native'
import {ListItem} from 'react-native-elements'
import ChangeEmailForm from './ChangeEmailForm'
import ChangeDisplayNameForm from './editarPerfil'
import ChangePasswordForm from './ChangePasswordForm'

export default function AccountOptions(props) {
  
    const {user,userInfo,toastRef,setReloadUser} = props
    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [renderComponent, setRenderComponent] = useState(null)

    const selectedComponent = (key) =>{
      switch (key) {
        case "datos":
          setRenderComponent(
            <ChangeDisplayNameForm
              user={user}
              setLoading={setLoading}
              setShowModal={setShowModal}
              displayName={userInfo.nombre}
              setReloadUser={setReloadUser}
              direccion={userInfo.direccion}
              setLoadingText={setLoadingText}
            />
          )
          setShowModal(true)
        break
        case "correo":
          setRenderComponent(
            <ChangeEmailForm
              email={user.email}
              toastRef={toastRef}
              setShowModal={setShowModal}
            />
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
            <ChangePasswordForm setShowModal={setShowModal}/>
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
            <Loading isVisible={loading} text={loadingText} />
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