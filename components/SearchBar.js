import React from 'react'
import { StyleSheet, View, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const SearchBar = ({ term, onTermChange, onTermSubmit }) => {
    return (
        <View style={styles.search}>
            <Ionicons name='md-search' size={28} color={'gray'} />
            <TextInput
                placeholder='Search'
                style={styles.searchInput}
                onChangeText={onTermChange}
                value={term}
                autoCapitalize='none'
                autoCorrect={false}
                onEndEditing={onTermSubmit}
            />
        </View>
    )
}

export default SearchBar

const styles = StyleSheet.create({
    search: {
        flexDirection: 'row',
        backgroundColor: '#f0eeee',
        padding: 10,
        marginHorizontal: 10
    },
    searchInput: {
        fontSize: 16,
        marginLeft: 10,
        flex: 1
    }
})
