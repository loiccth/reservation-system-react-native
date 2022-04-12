import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Picker } from '@react-native-picker/picker'

const FilterComplex = ({ filters, currentFilter, handleFilterChange }) => {
    return (
        <View>
            <Text style={styles.text}>Filter by category</Text>
            <Picker
                style={styles.dropdown}
                selectedValue={currentFilter}
                onValueChange={(itemValue) =>
                    handleFilterChange(itemValue)
                }
            >
                <Picker.Item label='All' value='All' />
                {filters.map(filter =>
                    <Picker.Item label={filter} value={filter} key={filter} />
                )}
            </Picker>
        </View>
    )
}

const styles = StyleSheet.create({
    dropdown: {
        backgroundColor: '#f0eeee',
        padding: 10,
        marginHorizontal: 10,
        borderRadius: 10
    },
    text: {
        paddingHorizontal: 10
    }
})

export default FilterComplex