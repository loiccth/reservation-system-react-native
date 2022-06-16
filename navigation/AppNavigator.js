
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MapScreen from '../screens/MapScreen'
import { UserContext } from '../contexts/UserContext'
import SettingsStack from './SettingsStack'
import UsersScreen from '../screens/UsersScreen'
import SportsStack from './SportsStack'
import ReservationsStack from './ReservationsStack'

const Tab = createBottomTabNavigator()

const AppNavigator = () => {
    const user = React.useContext(UserContext)

    return (
        <NavigationContainer>
            <Tab.Navigator initialRouteName='Pools'
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                        let iconName

                        if (route.name === 'Pools') {
                            iconName = 'water'
                        } else if (route.name === 'Settings') {
                            iconName = 'settings'
                        } else if (route.name === 'Map') {
                            iconName = 'map'
                        } else if (route.name === 'Favourites') {
                            iconName = 'heart'
                        } else if (route.name === 'Users') {
                            iconName = 'person'
                        } else if (route.name === 'Reservations') {
                            iconName = 'book'
                        }

                        return <Ionicons name={iconName} size={size} color={color} />
                    },
                    tabBarActiveTintColor: '#00ADB5',
                    tabBarInactiveTintColor: '#393E46',
                    headerShown: false
                })}
            >
                <Tab.Screen name='Pools' component={SportsStack} />
                <Tab.Screen name='Map' component={MapScreen} />
                <Tab.Screen name='Reservations' component={ReservationsStack} />
                {user.role === 'admin' &&
                    <Tab.Screen name='Users' component={UsersScreen} />
                }
                <Tab.Screen name='Settings' component={SettingsStack} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator