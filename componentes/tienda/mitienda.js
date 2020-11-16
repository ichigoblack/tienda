import {Icon} from 'react-native-elements'
import {useNavigation} from '@react-navigation/native'
import React, {useState,useEffect,useCallback} from 'react'
import {Text,View,Image,FlatList,StyleSheet} from 'react-native'

export default function Mitienda(){

    const navigation = useNavigation()
    
    return(
        <View style={styles.container}>
            <Text>hola</Text>
            <Icon  
                reverse
                name="plus"
                color="#128c7e" 
                type="material-community" 
                containerStyle={styles.btnContainer}
                onPress={()=>{navigation.navigate("add-product")}} />
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
    },
    btnContainer:{
        right: 10,
        bottom: 10,
        shadowOpacity: 0.2,
        position: 'absolute',
        shadowColor: '#000000',
        shadowOffset: {width:1,height:2},
    }
})