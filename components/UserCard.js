import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Card } from 'react-native-paper'

const UserCard = ({ user, navigation }) => {
    return (
        <Card style={styles.card} elevation={10}>
            <TouchableOpacity onPress={() => navigation.navigate('Details', { userDetails: user })}>
                <View style={styles.text}>
                    <Text style={styles.name}>Name: {user.lastname + ', ' + user.firstname}</Text>
                    <Text style={styles.address}>Email: {user.email}</Text>
                    <Text style={styles.address}>Phone: {user.phone}</Text>
                    <Text>Role: {user.role}</Text>
                </View>
            </TouchableOpacity>
        </Card>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        margin: 10
    },
    name: {
        fontSize: 14,
        fontWeight: '700'
    },
    address: {},
    text: {
        margin: 10
    }
})

export default UserCard