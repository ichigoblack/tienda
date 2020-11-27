import * as firebase from 'firebase'
import React,{useState} from 'react'
import {validaremail} from '../../utils/utils'
import {Text,View,StyleSheet} from 'react-native'
import {Input,Button} from 'react-native-elements'
import {reauthenticate} from '../../utils/acciones'

export default function compraModal(props) {

    const {datos,setShowModal} = props
    const [isLoading, setIsLoading] = useState(false)


    return (
        <View style={styles.view}>
            <View style={{width:'100%',flexDirection:'row'}}>
                <View style={{width:'70%'}}>
                    <Text style={{fontSize:24}}>Subtotal </Text>
                </View>
                <View style={{width:'30%',alignItems:'flex-end'}}>
                    <Text style={{fontSize:20,marginRight:30}}>${datos.subtotal}</Text>
                </View>
            </View>
            <View style={{width:'100%',flexDirection:'row',borderBottomWidth:1,borderBottomColor: "#128c7e"}}>
                <View style={{width:'70%'}}>
                    <Text style={{fontSize:24}}>IVA </Text>
                </View>
                <View style={{width:'30%',alignItems:'flex-end'}}>
                    <Text style={{fontSize:20,marginRight:30}}>${datos.iva}</Text>
                </View>
            </View>
            <View style={{width:'100%',flexDirection:'row'}}>
                <View style={{width:'70%'}}>
                    <Text style={{fontSize:24}}>Total </Text>
                </View>
                <View style={{width:'30%',alignItems:'flex-end'}}>
                    <Text style={{fontSize:20,marginRight:30}}>${datos.total}</Text>
                </View>
            </View>
            <Button
                title="Finalizar Compra"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                //onPress={onSubmit}
                //loading={isLoading}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10,
    },
    input: {
        marginBottom: 10,
    },
    btnContainer: {
        marginTop: 20,
        width: "70%",
    },
    btn: {
        backgroundColor: "#00a680",
    },
})