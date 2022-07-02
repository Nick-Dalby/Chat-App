import React, { useEffect, useState, useCallback } from 'react'
import { View, Platform, KeyboardAvoidingView } from 'react-native'
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'

import CustomActions from './CustomActions'

import { signInAnonymously } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo'

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
  const [isConnected, setIsConnected] = useState()

  // user name and color pulling in from first screen
  let name = route.params.name
  let color = route.params.color

  // reference to the firestore database
  const messagesRef = collection(db, 'messages')

  const getMessages = async () => {
    let messages = ''
    try {
      messages = (await AsyncStorage.getItem('messages')) || []
      setMessages(JSON.parse(messages))
    } catch (error) {
      console.log(error.message)
    }
  }

  const saveMessages = async (messages) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messages))
    } catch (error) {
      console.log(error.message)
    }
  }

  const deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages')
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    // screen title using users name
    navigation.setOptions({ title: name })

    let unsub

    // saveMessages()
    // getMessages()
    // deleteMessages()

    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        setIsConnected(true)
        console.log('online')
      } else {
        setIsConnected(false)
        console.log('offline')
      }
    })

    // if online query the collection of messages, order them by time, descending
    if (isConnected) {
      const queryMessages = query(messagesRef, orderBy('createdAt', 'desc'))
      unsub = onSnapshot(queryMessages, onCollectionUpdate)

      return () => unsub()
    } else if (isConnected === false) {
      getMessages()
      navigation.setOptions({ title: 'offline' })
    }

    // sign in
    const unsubUser = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        await signInAnonymously(auth)
      }
    })

    // cleanup: Stop listening to authentication and collection changes
    return () => {
      unsubUser()
    }
  }, [isConnected])

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
    saveMessages(messageArray)
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

  const renderInputToolbar = (props) => {
    if (!isConnected) {
    } else {
      return <InputToolbar {...props} />
    }
  }

  const renderCustomActions = (props) => {
    return <CustomActions {...props} />
  }

  return (
    <View style={{ flex: 1, backgroundColor: color }}>
      <GiftedChat
        renderActions={renderCustomActions}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        messages={messages}
        // showUserAvatar={true}
        showAvatarForEveryMessage={true}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: auth.currentUser?.uid,
          name: name,
          avatar: '',
        }}
      />
      {Platform.OS === 'android' ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  )
}

export default Chat
