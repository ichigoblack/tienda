import {map} from 'lodash'
import Modal from '../Modal'
import Loading from '../loading'
import React,{useState} from 'react'
import {View,StyleSheet} from 'react-native'
import {Icon,ListItem} from 'react-native-elements'
import ChangeEmailForm from './ChangeEmailForm'
import ChangePhoneForm from './ChangePhoneForm'
import ChangeDisplayNameForm from './editarPerfil'
import ChangePasswordForm from './ChangePasswordForm'

export default function AccountOptions(props) {
  
    const {user,userInfo,toastRef,setReloadUser} = props
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [loadingText, setLoadingText] = useState(false)
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
            <ChangePhoneForm
              user={user}
              datos={userInfo}
              toastRef={toastRef}
              setShowModal={setShowModal}
              setReloadUser={setReloadUser}
            />
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
                <ListItem key={index} bottomDivider onPress={menu.onPress}>
                  <Icon type={menu.iconType} name={menu.iconNameLeft} color={menu.iconColor}/>
                  <ListItem.Content>
                    <ListItem.Title>{menu.title}</ListItem.Title>
                  </ListItem.Content>
                  <ListItem.Chevron color={menu.iconColor} size={24}/>
                </ListItem>
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
            title: "Datos",
            iconColor: "#128c7e",
            iconType: "material-community",
            iconNameLeft: "account-circle",
            onPress: () => selectedComponent("datos")
        },
        {
            title: "Correo",
            iconColor: "#128c7e",
            iconNameLeft: "email",
            iconType: "material-community",
            onPress: () => selectedComponent("correo")
        },
        {
            title: "Telefono",
            iconColor: "#128c7e",
            iconNameLeft: "cellphone",
            iconType: "material-community",
            onPress: () => selectedComponent("telefono")
        },
        {
            title: "Contraseña",
            iconColor: "#128c7e",
            iconNameLeft: "lock",
            iconType: "material-community",
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