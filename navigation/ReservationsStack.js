import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import ViewReservationScreen from '../screens/ViewReservationsScreen'
import ViewReservationDetailsScreen from '../screens/ViewReservationDetailsScreen'
import PaymentScreen from '../screens/PaymentScreen'
import PaymentSuccessScreen from '../screens/PaymentSuccessScreen'

const Stack = createStackNavigator()

export default function ReservationsStack() {
    return (
        <Stack.Navigator initialRouteName='Main'
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name='Main' component={ViewReservationScreen} />
            <Stack.Screen name='DetailsReservation' component={ViewReservationDetailsScreen} />
            <Stack.Screen name='Payment' component={PaymentScreen} />
            <Stack.Screen name='PaymentSuccess' component={PaymentSuccessScreen} />
        </Stack.Navigator>
    )
}