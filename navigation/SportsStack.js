import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import SportsListScreen from '../screens/SportsListScreen'

const Stack = createStackNavigator()

export default function SportsStack() {
    return (
        <Stack.Navigator initialRouteName='Main'
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name='Main' component={SportsListScreen} />
        </Stack.Navigator>
    )
}