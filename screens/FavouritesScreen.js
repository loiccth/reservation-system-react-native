import React from 'react'
import { StyleSheet, Text, View, Platform, StatusBar } from 'react-native'

const FavouritesScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Favourites Screen</Text>
        </View>
    )
}

export default FavouritesScreen

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
    }
})