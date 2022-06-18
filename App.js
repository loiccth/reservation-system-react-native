import React from 'react'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore'
import { useFonts, Oswald_400Regular } from '@expo-google-fonts/oswald'
import { Lato_900Black, Lato_400Regular_Italic } from '@expo-google-fonts/lato'
import AppLoading from 'expo-app-loading'
import AppNavigator from './navigation/AppNavigator'
import MFAStack from './navigation/MFAStack'
import AuthStack from './navigation/AuthStack'
import { LogBox } from 'react-native'
import { UserContext } from './contexts/UserContext'
import * as Notifications from 'expo-notifications'
import isInThePast from './utils/pastCheck'
import addMonths from './utils/addMonths'

LogBox.ignoreLogs(['Setting a timer for a long period of time'])
LogBox.ignoreLogs(['AsyncStorage has been extracted from react-native'])
LogBox.ignoreLogs(['VirtualizedLists should never be nested'])
LogBox.ignoreLogs(["Can't perform a React state update on an unmounted component"])

const firebaseConfig = {
    apiKey: 'AIzaSyBVwDjyMoSooHtKB28eU4QY6DHLT6agd1w',
    authDomain: 'sports-8c094.firebaseapp.com',
    databaseURL: 'https://sports-8c094-default-rtdb.firebaseio.com',
    projectId: 'sports-8c094',
    storageBucket: 'sports-8c094.appspot.com',
    messagingSenderId: '742497530729',
    appId: '1:742497530729:web:2f6df34dc0ea7f9f0d43f8'
}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldShowAlert: true
    })
})

export default function App() {
    initializeApp(firebaseConfig)
    const auth = getAuth()
    const db = getFirestore()
    const [user, setUser] = React.useState()
    const [membership, setMembership] = React.useState()
    const [loading, setLoading] = React.useState(true)
    const [fontsLoaded] = useFonts({
        Lato_900Black,
        Lato_400Regular_Italic,
        Oswald_400Regular,
    })

    const checkMFA = (date) => {
        const today = new Date()
        today.setMinutes(today.getMinutes + 3)


    }

    React.useEffect(() => {
        onAuthStateChanged(auth, (user1) => {
            if (user1) {
                // setUser(user)

                getDoc(doc(db, 'users', user1.uid))
                    .then(res => {
                        if (res.exists()) {
                            setUser({
                                uid: user1.uid,
                                ...res.data()
                            })

                            getDoc(doc(db, 'memberships', user1.uid))
                                .then(resMem => {
                                    if (resMem.exists()) {
                                        if (!isInThePast(new Date(resMem.data().endDate))) {
                                            setMembership(resMem.data())
                                        }
                                        else {
                                            if (resMem.data().recurring) {
                                                const newEndDate = addMonths(new Date(resMem.data().endDate), 1)
                                                setMembership({
                                                    ...resMem.data(),
                                                    endDate: newEndDate
                                                })

                                                updateDoc(doc(db, 'memberships', user1.uid), {
                                                    endDate: newEndDate
                                                })

                                                // TODO: send post request for stripe
                                                // TODO: for loop and check number of months
                                            }
                                            else {
                                                setMembership()
                                                deleteDoc(doc(db, 'memberships', user1.uid))
                                            }
                                        }
                                    }
                                })
                        }

                        else {
                            setUser(undefined)
                        }
                        setLoading(false)
                    })
                    .catch(err => {
                        console.log(err)
                    })

            } else {
                setUser(undefined)
                setLoading(false)
            }
        })
    }, [])

    React.useEffect(() => {
        const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => { }
            // console.log(response)
        )
        const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => { }
            // console.log(notification)
        )
        return () => {
            foregroundSubscription.remove()
            backgroundSubscription.remove()
        }
    }, [])

    React.useEffect(() => {
        Notifications.getPermissionsAsync().then(statusObj => {
            if (statusObj.status !== 'granted') {
                Notifications.requestPermissionsAsync().then(statusObj => {
                    if (statusObj.status !== 'granted') {
                        throw new Error('Permission not granted')
                    }
                })
            }
            return statusObj
        })
            .catch(error => console.log(error))
    }, [])

    return loading ? <AppLoading /> : user ? <UserContext.Provider value={{ user, setUser, membership, setMembership }}><MFAStack showMFA={user.mfa} /></UserContext.Provider> : <AuthStack />
}