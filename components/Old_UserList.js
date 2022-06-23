import React from 'react'
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore'
import { StyleSheet, View } from 'react-native'
import UserCard from './UserCard'
import NoUsers from './NoUsers'
import { useFocusEffect } from '@react-navigation/native'

const UserList = ({ tab, navigation }) => {
    const db = getFirestore()
    const [users, setUsers] = React.useState([])

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                let temp = []

                getDocs(query(collection(db, 'users'), where('vaccineValidated', '==', tab)))
                    .then(querySnapshot => {
                        querySnapshot.forEach((doc) => {
                            // console.log(doc.id, " => ", doc.data())
                            temp.push({
                                ...doc.data(),
                                uid: doc.id
                            })
                        })
                        setUsers(temp)
                    })
                    .catch(err => console.log(err))
            })()
        }, [tab])
    )

    return (
        <View>
            {users.length === 0 &&
                <NoUsers />
            }

            {users.map((user, index) =>
                <UserCard key={index} user={user} navigation={navigation} />
            )}
        </View>
    )
}

const styles = StyleSheet.create({})

export default UserList