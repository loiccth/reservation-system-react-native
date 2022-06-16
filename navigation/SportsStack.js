import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import SportsListScreen from '../screens/SportsListScreen'
import ComplexDetailsScreen from '../screens/ComplexDetailsScreen'
import ReservationScreen from '../screens/ReservationScreen'
import ReservationPreviewScreen from '../screens/ReservationPreviewScreen'
import PaymentScreen from '../screens/PaymentScreen'
import PaymentSuccessScreen from '../screens/PaymentSuccessScreen'

const Stack = createStackNavigator()

export default function SportsStack() {
    return (
        <Stack.Navigator initialRouteName='Main'
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name='Main' component={SportsListScreen} />
            <Stack.Screen name='Details' component={ComplexDetailsScreen} />
            <Stack.Screen name='Reservation' component={ReservationScreen} />
            <Stack.Screen name='ReservationReview' component={ReservationPreviewScreen} />
            <Stack.Screen name='Payment' component={PaymentScreen} />
            <Stack.Screen name='PaymentSuccess' component={PaymentSuccessScreen} />
        </Stack.Navigator>
    )
}