import React, { useEffect, useState, useCallback } from 'react'
import { View, Platform, KeyboardAvoidingView } from 'react-native'
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

const Chat = ({ navigation, route }) => {
  const [messages, setMessages] = useState([])

  let name = route.params.name
  let color = route.params.color

  useEffect(() => {
    navigation.setOptions({ title: name })
  }, [])

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello ' + name,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: name + ' has entered the chat!',
        createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
        system: true,
        // Any additional custom parameters are passed through
      },
    ])
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    )
  }, [])

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: 'hotpink',
          },
        }}
      />
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: color }}>
      <GiftedChat
        renderBubble={renderBubble}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
      {Platform.OS === 'android' ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  )
}

export default Chat
