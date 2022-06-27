import React, { useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import {
    StyleSheet,
    View,
    Platform,
    StatusBar,
} from 'react-native'
import { InstantSearch } from 'react-instantsearch-native'
import SearchBox from '../widgets/SearchBox'
import InfiniteHitsUpdatePool from '../widgets/InfiniteHitsUpdatePool'
import algoliasearch from "algoliasearch/lite"

const UpdatePoolScreen = ({ navigation }) => {
    const [client, setClient] = React.useState(algoliasearch("9Y1QHHRQ1G", "92b4140444283171a403d678c20388d0"))

    useEffect(async () => {
        navigation.addListener('beforeRemove', e => {
            e.preventDefault()
            navigation.navigate('App')
        })
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            setClient(algoliasearch("9Y1QHHRQ1G", "92b4140444283171a403d678c20388d0"))
        }, [])
    )

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <InstantSearch
                    appId="9Y1QHHRQ1G"
                    apiKey="92b4140444283171a403d678c20388d0"
                    indexName="pools_index"
                    searchClient={client}
                >
                    <SearchBox />
                    <InfiniteHitsUpdatePool navigation={navigation} />
                </InstantSearch>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
    },
    searchContainer: {
        padding: 5
    }
})

export default UpdatePoolScreen
