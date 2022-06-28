import React, { useEffect, useState, useCallback } from 'react'
import { View, Platform, KeyboardAvoidingView } from 'react-native'
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

import { signInAnonymously } from 'firebase/auth'

import {
  collection,
  onSnapshot,
  query,
  addDoc,
  orderBy,
} from 'firebase/firestore'
import { db, auth } from '../firebase/firebase'

const Chat = ({ navigation, route }) => {
  const [messages, setMessages] = useState([])
  const [user, setUser] = useState({
    _id: '',
    name: '',
    avatar: '',
  })

  // user name and color pulling in from first screen
  let name = route.params.name
  let color = route.params.color
  
  // screen title using users name
  navigation.setOptions({ title: name })

  // reference to the firestore database
  const messagesRef = collection(db, 'messages')

  useEffect(() => {
    // query the collection of messages, order them by time, descending
    const queryMessages = query(messagesRef, orderBy('createdAt', 'desc'))
    // define snapshot listner
    const unsub = onSnapshot(queryMessages, onCollectionUpdate)

    // sign in
    const unsubUser = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        await signInAnonymously(auth)
      }
      setUser({
        _id: user.uid,
        name: name,
        avatar: 'https://placeimg.com/140/140/any',
      })
    })

    // cleanup: Stop listening to authentication and collection changes
    return () => {
      unsubUser()
      unsub()
    }
  }, [])

  // read the message data from firestore - push it to the message state
  const onCollectionUpdate = (querySnapshot) => {
    let messageArray = []
    querySnapshot.forEach((doc) => {
      let data = doc.data()
      messageArray.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      })
    })
    setMessages(messageArray)
  }

  //add messaage from state to firestore
  const addMessage = (message) => {
    addDoc(messagesRef, {
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
    })
  }

  // need to use the system message to notify on chat entry

  // useEffect(() => {
  //   setMessages([
  //     {
  //       _id: 1,
  //       text: 'Hello ' + name,
  //       createdAt: new Date(),
  //       user: {
  //         _id: 2,
  //         name: 'React Native',
  //         avatar: 'https://placeimg.com/140/140/any',
  //       },
  //     },
  //     {
  //       _id: 2,
  //       text: name + ' has entered the chat!',
  //       createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
  //       system: true,
  //       // Any additional custom parameters are passed through
  //     },
  //   ])
  // }, [])

  //add new messages to state on send
  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    )
    addMessage(messages[0])
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
        // showUserAvatar={true}
        showAvatarForEveryMessage={true}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: user._id,
          name: name,
          avatar: user.avatar,
        }}
      />
      {Platform.OS === 'android' ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  )
}

export default Chat
