import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import MFAScreen from '../screens/MFAScreen'
import AppNavigator from './AppNavigator'

const Stack = createStackNavigator()

export default function MFAStack({ showMFA }) {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={showMFA ? 'MFA' : 'App'}
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name='MFA' component={MFAScreen} />
                <Stack.Screen name='App' component={AppNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}