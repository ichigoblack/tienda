import React,{useEffect} from 'react'
import {Text,View,StyleSheet} from 'react-native'

export default function Carrito(){
    return(
        <View style={styles.container}>
            <Text>carrito</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center'
    }
})