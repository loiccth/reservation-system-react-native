import React, { useState, useEffect } from 'react'
import { StatusBar as ExpoStatusBar } from 'expo-status-bar'
import {
    StyleSheet,
    View,
    SafeAreaView,
    Platform,
    StatusBar,
    Text,
    ScrollView
} from 'react-native'
import UserList from '../components/UserList'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

const UsersScreen = () => {
    const [users, setUsers] = useState([])
    const db = getFirestore()

    const temp = []

    useEffect(async () => {
        const querySnapshot = await getDocs(collection(db, 'users'))
        querySnapshot.forEach((doc) => {
            // console.log(doc.id, " => ", doc.data())
            temp.push(doc.data())
        })
        setUsers(temp)
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View>
                    <UserList users={users} />
                </View>
            </ScrollView>
            <ExpoStatusBar />
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
    },
    searchContainer: {
        padding: 10
    }
})

export default UsersScreen