import React from 'react'
import {
    StyleSheet,
    View,
    Platform,
    StatusBar,
} from 'react-native'
import { InstantSearch } from 'react-instantsearch-native'
import SearchBox from '../widgets/SearchBox'
import InfiniteHitsUsers from '../widgets/InfiniteHitsUsers'
import algoliasearch from "algoliasearch/lite"
import { useFocusEffect } from '@react-navigation/native'

const UsersScreen = ({ navigation }) => {
    const [client, setClient] = React.useState(algoliasearch("9Y1QHHRQ1G", "92b4140444283171a403d678c20388d0"))

    useFocusEffect(
        React.useCallback(() => {
            setClient(algoliasearch("9Y1QHHRQ1G", "92b4140444283171a403d678c20388d0"))
        }, [])
    )

    return (
        <View style={styles.container}>
            <InstantSearch
                appId="9Y1QHHRQ1G"
                apiKey="92b4140444283171a403d678c20388d0"
                indexName="members_index"
                searchClient={client}
            >
                <SearchBox />
                <InfiniteHitsUsers navigation={navigation} />
            </InstantSearch>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderLeftColor: '#eee',
        borderLeftWidth: 0.5,
        borderRightColor: '#eee',
        borderRightWidth: 0.5
    },
    tabText: {
        fontWeight: '700',
        fontSize: 16
    }
})

export default UsersScreen