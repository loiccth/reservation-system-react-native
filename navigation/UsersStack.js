import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import UsersScreen from '../screens/UsersScreen'
import UserDetailsScreen from '../screens/UserDetailsScreen'
import ViewUserReservationsScreen from '../screens/ViewUserReservationsScreen'
import ViewUserReservationDetailsScreen from '../screens/ViewUserReservationDetailsScreen'

const Stack = createStackNavigator()

export default function UsersStack() {
    return (
        <Stack.Navigator initialRouteName='Main'
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name='Main' component={UsersScreen} />
            <Stack.Screen name='Details' component={UserDetailsScreen} />
            <Stack.Screen name='UserReservations' component={ViewUserReservationsScreen} />
            <Stack.Screen name='UserReservationDetails' component={ViewUserReservationDetailsScreen} />
        </Stack.Navigator>
    )
}