import {map} from 'lodash'
import Modal from '../Modal'
import Loading from '../loading'
import React,{useState} from 'react'
import {View,StyleSheet} from 'react-native'
import {ListItem} from 'react-native-elements'
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
            title: "Datos",
            iconType: "material-community",
            iconNameLeft: "account-circle",
            iconColorLeft: "#128c7e",
            iconNameRight: "chevron-right",
            iconColorRight: "#128c7e",
            onPress: () => selectedComponent("datos")
        },
        {
            title: "Correo",
            iconType: "material-community",
            iconNameLeft: "email",
            iconColorLeft: "#128c7e",
            iconNameRight: "chevron-right",
            iconColorRight: "#128c7e",
            onPress: () => selectedComponent("correo")
        },
        {
            title: "Telefono",
            iconType: "material-community",
            iconNameLeft: "cellphone",
            iconColorLeft: "#128c7e",
            iconNameRight: "chevron-right",
            iconColorRight: "#128c7e",
            onPress: () => selectedComponent("telefono")
        },
        {
            title: "Contraseña",
            iconType: "material-community",
            iconNameLeft: "lock",
            iconColorLeft: "#128c7e",
            iconNameRight: "chevron-right",
            iconColorRight: "#128c7e",
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