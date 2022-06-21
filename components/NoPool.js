import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const NoPool = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>No pools found.</Text>
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
        fontWeight: '700'
    }
})

export default NoPool