import React from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import PropTypes from 'prop-types'
import { connectInfiniteHits } from 'react-instantsearch-native'
import ComplexCardUpdate from '../components/ComplexCardUpdate'

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

const InfiniteHitsUpdatePool = ({ hits, hasMore, refine, navigation }) => {
    return (
        <FlatList
            style={{ marginBottom: 55 }}
            data={hits}
            keyExtractor={item => item.objectID}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            onEndReached={() => hasMore && refine()}
            renderItem={({ item }) => {
                return <ComplexCardUpdate navigation={navigation} complex={item} />
            }}
        />
    )
}

InfiniteHitsUpdatePool.propTypes = {
    hits: PropTypes.arrayOf(PropTypes.object).isRequired,
    hasMore: PropTypes.bool.isRequired,
    refine: PropTypes.func.isRequired,
}

export default connectInfiniteHits(InfiniteHitsUpdatePool)