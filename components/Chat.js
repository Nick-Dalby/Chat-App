import React, { useEffect } from 'react'
import { View, Text} from 'react-native';

const Chat = ({ navigation, route }) => {
  let name = route.params.name
  let color = route.params.color

  useEffect(() => {
    navigation.setOptions({ title: name })
  }, [])
  
  

  return ( 
    <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: color}}>
        <Text>Hello {name} how are you?</Text>
      </View>
  )
}

export default Chat