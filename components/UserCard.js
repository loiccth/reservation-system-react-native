import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Card } from 'react-native-paper'

const UserCard = ({ user }) => {
    const [modal, setModal] = React.useState(false)

    const closeModal = () => {
        setModal(false)
    }

    return (
        <Card style={styles.card} elevation={10}>
            <TouchableOpacity onPress={() => setModal(true)}>
                <View style={styles.text}>
                    <Text style={styles.name}>Name: {user.firstname + ' ' + user.lastname}</Text>
                    <Text style={styles.address}>Email: {user.email}</Text>
                    <Text>Role: {user.role}</Text>
                </View>
            </TouchableOpacity>
        </Card>
    )
}

const styles = StyleSheet.create({
    card: { backgroundColor: 'white', margin: 10 },
    name: { fontFamily: 'Lato_900Black' },
    address: { fontFamily: 'Oswald_400Regular' },
    text: { margin: 10 }
})

export default UserCard