import React from 'react'
import { StyleSheet, Text, View, FlatList } from 'react-native'
import Highlight from './Highlight'
import PropTypes from 'prop-types'
import { connectInfiniteHits } from 'react-instantsearch-native'
import ComplexCard from '../components/ComplexCard'

const styles = StyleSheet.create({
    separator: {
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    item: {
        padding: 10,
        flexDirection: 'column',
    },
    titleText: {
        fontWeight: 'bold',
    },
})

const InfiniteHits = ({ hits, hasMore, refine, navigation }) => {
    return (
        <FlatList
            style={{ marginBottom: 55 }}
            data={hits}
            keyExtractor={item => item.objectID}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            onEndReached={() => hasMore && refine()}
            renderItem={({ item }) => {
                // console.log(item.objectID)
                return <ComplexCard navigation={navigation} complex={item} />
            }}
        />
    )
}

InfiniteHits.propTypes = {
    hits: PropTypes.arrayOf(PropTypes.object).isRequired,
    hasMore: PropTypes.bool.isRequired,
    refine: PropTypes.func.isRequired,
}

export default connectInfiniteHits(InfiniteHits)