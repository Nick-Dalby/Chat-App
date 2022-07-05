import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'

import image from '../assets/Background-Image.png'

// background color options
const colors = {
  a: '#090C08',
  b: '#474056',
  c: '#8A95A5',
  d: '#B9C6AE',
}

import { LogBox } from 'react-native'

LogBox.ignoreAllLogs()

const Start = ({ navigation }) => {
  const [name, setName] = useState('')
  const [color, setColor] = useState('')

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <Text style={styles.title}>Chat-App!</Text>
        <View style={styles.start}>
          {/* need to add the user logo in here */}
          <TextInput
            style={styles.input}
            onChangeText={(name) => {
              setName(name)
            }}
            value={name}
            placeholder="Your Name"
          />
          <Text style={{ marginBottom: 15 }}>Choose Background Color:</Text>
          <View style={styles.colorPick}>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Tap me!"
              accessibilityHint="Choose chat screen background color"
              style={[{ backgroundColor: colors.a }, styles.colorChange]}
              onPress={() => setColor(colors.a)}
            />
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Tap me!"
              accessibilityHint="Choose chat screen background color"
              style={[{ backgroundColor: colors.b }, styles.colorChange]}
              onPress={() => setColor(colors.b)}
            />
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Tap me!"
              accessibilityHint="Choose chat screen background color"
              style={[{ backgroundColor: colors.c }, styles.colorChange]}
              onPress={() => setColor(colors.c)}
            />
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Tap me!"
              accessibilityHint="Choose chat screen background color"
              style={[{ backgroundColor: colors.d }, styles.colorChange]}
              onPress={() => setColor(colors.d)}
            />
          </View>
          <Pressable
            accessible={true}
            accessibilityLabel="Tap me!"
            accessibilityHint="Enter the chat"
            style={styles.button}
            onPress={() =>
              navigation.navigate('Chat', { name: name, color: color })
            }
          >
            <Text style={styles.buttonText}>Start Chatting</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  title: {
    marginTop: 'auto',
    marginBottom: 'auto',
    alignContent: 'center',
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  //the box containing the UI elements
  start: {
    width: '88%',
    backgroundColor: '#FFFFFF',

    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
    paddingTop: 10,
    elevation: 3,
  },
  input: {
    width: '88%',
    fontSize: 16,
    fontWeight: '300',
    height: 50,
    margin: 12,
    borderWidth: 1,
    padding: 15,
    backgroundColor: '#FFFFFF',
    color: '#757083',
    borderColor: '#757083',
  },
  colorPick: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  colorChange: {
    width: 50,
    height: 50,
    borderRadius: 25,
    // need to add an outline on press
  },
  button: {
    backgroundColor: '#757083',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    width: '88%',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '600',
    letterSpacing: 0.25,
    color: '#FFFFFF',
  },
})

export default Start
