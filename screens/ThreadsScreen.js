import { Image, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'

const ThreadsScreen = () => {
  return (
    <SafeAreaView>
      <View style={{flexDirection:'row', alignItems:"center",gap:10,padding:10}}>
        <Image
        style={{width:40,
        height:40,
      borderRadius:20,
    resizeMode:"contain"}}
    source={{uri:"https://cdn-icons-png.flaticon.com/128/149/149071.png"}}
        />

        <Text>
          Abhinav_Tripathi
        </Text>
      </View>
    </SafeAreaView>
  )
}

export default ThreadsScreen

const styles = StyleSheet.create({})