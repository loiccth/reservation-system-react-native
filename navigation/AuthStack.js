import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import SignUpScreen from '../screens/SignUpScreen'
import SignInScreen from '../screens/SignInScreen'
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen'

const Stack = createStackNavigator()

export default function AuthStack() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Sign In'
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name='Sign Up' component={SignUpScreen} />
                <Stack.Screen name='Sign In' component={SignInScreen} />
                <Stack.Screen name='ForgotPassword' component={ForgotPasswordScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}