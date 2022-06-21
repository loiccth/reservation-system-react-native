import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

const Reservation404 = ({ navigation, msg }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{msg}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Camera')}
                    style={{ ...styles.price, backgroundColor: '#00ADB5', borderColor: '#00ADB5' }}>
                    <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Back!</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        alignItems: 'center',
        marginTop: 50
    },
    text: {
        fontSize: 16,
        fontWeight: '700',
        color: '#d62b2b'
    },
    price: {
        fontSize: 18,
        margin: 3,
        padding: 8,
        paddingRight: 12,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#393E46',
        color: '#393E46',
        borderRadius: 50
    }
})

export default Reservation404