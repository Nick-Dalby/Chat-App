import 'react-native-gesture-handler'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Start from './components/Start'
import Chat from './components/Chat'

const Stack = createStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Screen1">
        <Stack.Screen
          name="Start"
          component={Start}
          options={{
            headerTransparent: true, title: ''
          }}
        />
        <Stack.Screen name="Chat" component={Chat}  options={{
            headerTransparent: true,
          }}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
