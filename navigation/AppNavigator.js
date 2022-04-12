
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import SportsListScreen from '../screens/SportsListScreen'
import MapScreen from '../screens/MapScreen'
import FavouritesScreen from '../screens/FavouritesScreen'
import { UserContext } from '../contexts/UserContext'
import SettingsStack from './SettingsStack'
import UsersScreen from '../screens/UsersScreen'
import SportsStack from './SportsStack'

const Tab = createBottomTabNavigator()

const AppNavigator = () => {
    const user = React.useContext(UserContext)

    return (
        <NavigationContainer>
            <Tab.Navigator initialRouteName='Sports'
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                        let iconName

                        if (route.name === 'Sports') {
                            iconName = 'bicycle'
                        } else if (route.name === 'Settings') {
                            iconName = 'settings'
                        } else if (route.name === 'Map') {
                            iconName = 'map'
                        } else if (route.name === 'Favourites') {
                            iconName = 'heart'
                        } else if (route.name === 'Users') {
                            iconName = 'person'
                        }

                        return <Ionicons name={iconName} size={size} color={color} />
                    },
                    tabBarActiveTintColor: 'tomato',
                    tabBarInactiveTintColor: 'gray',
                    headerShown: false
                })}
            >
                <Tab.Screen name='Sports' component={SportsStack} />
                <Tab.Screen name='Map' component={MapScreen} />
                {/* <Tab.Screen name='Favourites' component={FavouritesScreen} /> */}
                {user.role === 'admin' &&
                    <Tab.Screen name='Users' component={UsersScreen} />
                }
                <Tab.Screen name='Settings' component={SettingsStack} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator