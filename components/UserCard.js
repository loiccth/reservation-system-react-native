import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Card } from 'react-native-paper'
import Highlight from '../widgets/Highlight'

const UserCard = ({ user, navigation }) => {
    return (
        <Card style={styles.card} elevation={10}>
            <TouchableOpacity onPress={() => navigation.navigate('Details', { userDetails: user })}>
                <View style={styles.text}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.name}>Name: </Text>
                        <Highlight customStyle={styles.name} attribute="lastname" hit={user} />
                        <Text>, </Text>
                        <Highlight customStyle={styles.name} attribute="firstname" hit={user} />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.address}>Email: </Text>
                        <Highlight customStyle={styles.address} attribute="email" hit={user} />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.address}>Phone: </Text>
                        <Highlight customStyle={styles.address} attribute="phone" hit={user} />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>Role: </Text>
                        <Highlight customStyle={styles.address} attribute="role" hit={user} />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>Status: </Text>
                        <View style={{ ...styles.circleThingy, paddingRight: 10 }}>
                            <Highlight customStyle={styles.highlightText} attribute="vaccineValidated" hit={user} />
                        </View>
                    </View>
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
    },
    highlightText: {
        borderColor: '#393E46',
        color: '#393E46',
    },
    circleThingy: {
        padding: 1,
        paddingBottom: 3,
        paddingHorizontal: 10,
        paddingRight: 7,
        borderWidth: 1,
        borderColor: '#393E46',
        color: '#393E46',
        borderRadius: 50
    }
})

export default UserCard