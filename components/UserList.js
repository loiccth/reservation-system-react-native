import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import UserCard from './UserCard'

const UserList = ({ users }) => {
    return (
        <View>
            {users.length === 0 &&
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Oswald_400Regular', fontSize: 16 }}>
                        No users found
                    </Text>
                </View>
            }

            {users.map((user, index) =>
                <UserCard key={index} user={user} />
            )}
        </View>
    )
}

const styles = StyleSheet.create({})

export default UserList