import React from 'react'
import { StyleSheet, View, TextInput } from 'react-native'
import PropTypes from 'prop-types'
import { connectSearchBox } from 'react-instantsearch-native'

const SearchBox = ({ currentRefinement, refine }) => {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.inputText}
                onChangeText={value => refine(value)}
                value={currentRefinement}
                placeholder='Search'
            />
        </View>
    )
}

SearchBox.propTypes = {
    currentRefinement: PropTypes.string.isRequired,
    refine: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    inputText: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#aeb0af',
        padding: 3,
        paddingLeft: 10,
        color: '#393E46'
    },
    input: {
        height: 48,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
})

export default connectSearchBox(SearchBox)