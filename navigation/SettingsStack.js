import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import SettingsScreen from '../screens/SettingsScreen'
import AddScreen from '../screens/AddScreen'

const Stack = createStackNavigator()

export default function SettingsStack() {
    return (
        <Stack.Navigator initialRouteName='Setting'
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name='Setting' component={SettingsScreen} />
            <Stack.Screen name='Add' component={AddScreen} />
        </Stack.Navigator>
    )
}