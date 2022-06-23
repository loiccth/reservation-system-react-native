import React from 'react'
import { StyleSheet, Text, View, FlatList } from 'react-native'
import PropTypes from 'prop-types'
import { connectInfiniteHits } from 'react-instantsearch-native'
import UserCard from '../components/UserCard'

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

const InfiniteHitsUsers = ({ hits, hasMore, refine, navigation }) => {
    return (
        <FlatList
            style={{ marginBottom: 0 }}
            data={hits}
            keyExtractor={item => item.objectID}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            onEndReached={() => hasMore && refine()}
            renderItem={({ item }) => {
                return <UserCard user={item} navigation={navigation} />
            }}
        />
    )
}

InfiniteHitsUsers.propTypes = {
    hits: PropTypes.arrayOf(PropTypes.object).isRequired,
    hasMore: PropTypes.bool.isRequired,
    refine: PropTypes.func.isRequired,
}

export default connectInfiniteHits(InfiniteHitsUsers)