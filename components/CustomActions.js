import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase/firebase'

import * as ImagePicker from 'expo-image-picker'
import { Camera } from 'expo-camera'
import * as Location from 'expo-location'

export class CustomActions extends Component {
  onActionPress = () => {
    const options = [
      'Choose from library',
      'Take Picture',
      'Send Location',
      'Cancel',
    ]

    const cancelButtonIndex = options.length - 1

    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            return this.pickImage()
          case 1:
            return this.takePhoto()
          case 2:
            return this.getLocation()
          default:
        }
      }
    )
  }

  pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (permission.granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
      }).catch((error) => console.log(error))

      if (!result.cancelled) {
        const imageUrl = await this.uploadImageFetch(result.uri);
        this.props.onSend({ image: imageUrl })
      }
    }
  }

  takePhoto = async () => {
    const permission = await Camera.requestCameraPermissionsAsync()
    if (permission.granted) {
      let result = await ImagePicker.launchCameraAsync().catch((error) =>
        console.log(error)
      )
      if (!result.cancelled) {
        const imageUrl = await this.uploadImageFetch(result.uri);
        this.props.onSend({ image: imageUrl })
      }
    }
  }

  getLocation = async () => {
    try {
      await Location.requestForegroundPermissionsAsync()
      let result = await Location.getCurrentPositionAsync({})
      this.props.onSend({
        location: result,
      })
    } catch (error) {
      console.error('Failed to get location', error)
    }
  }

  uploadImageFetch = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = function () {
        resolve(xhr.response)
      }
      xhr.onerror = function (e) {
        console.log(e)
        reject(new TypeError('Network request failed'))
      }
      xhr.responseType = 'blob'
      xhr.open('GET', uri, true)
      xhr.send(null)
    })

    const imageNameBefore = uri.split('/')
    const imageName = imageNameBefore[imageNameBefore.length - 1]

    const imagesRef = ref(storage, `images/${imageName}`)

    await uploadBytes(imagesRef, blob)
    const downloadUrl = await getDownloadURL(imagesRef)

    return downloadUrl
  }

  render() {
    return (
      <TouchableOpacity style={styles.container} onPress={this.onActionPress}>
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
})

export default CustomActions

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
}
