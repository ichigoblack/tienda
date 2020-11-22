import React from 'react'
import {useNavigation} from '@react-navigation/native'
import {MaterialCommunityIcons} from '@expo/vector-icons'
import {StyleSheet,TouchableHighlight} from 'react-native'

export default function ShopButton() {
  
  const navigation = useNavigation()

  return (
    <TouchableHighlight style={styles.container} onPress={() => {navigation.navigate("mitienda")}}>
      <MaterialCommunityIcons name="cart-outline" size={30} color="#fff" />
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  container: {
    top: -20,
    width: 72,
    height: 72,
    padding: 20,
    borderWidth: 3,
    shadowRadius: 5,
    borderRadius: 36,
    shadowOpacity: 0.3,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: {height:10},
    backgroundColor: "#25D366",
  },
})