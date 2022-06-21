import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import QRScannerScreen from '../screens/QRScannerScreen'
import ScannedReservationScreen from '../screens/ScannedReservationScreen'

const Stack = createStackNavigator()

export default function QRStack() {
    return (
        <Stack.Navigator initialRouteName='Camera'
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name='Camera' component={QRScannerScreen} />
            <Stack.Screen name='SearchReservation' component={ScannedReservationScreen} />
        </Stack.Navigator>
    )
}