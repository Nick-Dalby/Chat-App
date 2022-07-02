import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import PropTypes from 'prop-types'


export class CustomActions extends Component { 

  onActionPress = () => {
    const options = [
      'Choose from libray',
      'Take Picture',
      'Send Location',
      'Cancel',
    ]

    const cancelButtonIndex = options.length - 1
    console.log(this.context)

    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log('user wants to pick an image')
            return this.pickImage()
          case 1:
            console.log('user wants to take a photo')
            return this.takePhoto()
          case 2:
            console.log('user wants to get location')
          return this.getLocation()
          default:
        }
      }
    )
  }

  pickImage = async () => {
    console.log('pick image');
  }
  
  takePhoto = async () => {
    console.log('take photo');
  }

  getLocation = async () => {
    console.log('get location');
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
