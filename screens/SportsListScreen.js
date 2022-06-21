import React, { useState, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { StatusBar as ExpoStatusBar } from 'expo-status-bar'
import {
     StyleSheet,
     View,
     SafeAreaView,
     Platform,
     StatusBar,
     ScrollView
} from 'react-native'
import SearchBar from '../components/SearchBar'
import ComplexList from '../components/ComplexList'
import FilterComplex from '../components/FilterComplex'
import { getFirestore, collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore'

const SportsListScreen = ({ navigation }) => {
     const [complexes, setComplexes] = useState([])
     const [filters, setFilters] = useState([])
     const [currentFilter, setCurrentFilter] = useState('All')
     const [search, setSearch] = useState('')
     const db = getFirestore()


     useEffect(async () => {
          const temp = []
          const querySnapshot = await getDocs(query(collection(db, 'complexes'), where('status', '==', 'A')))
          querySnapshot.forEach((doc) => {
               // console.log(doc.id, " => ", doc.data())
               temp.push(doc.data())
          })

          getDoc(doc(db, 'settings', 'filters'))
               .then(res => {
                    if (res.exists()) {
                         setFilters(res.data().data)
                    }
                    else {
                         setFilters([])
                    }
               })
               .catch(err => {
                    console.log(err)
               })

          setComplexes(temp)

          navigation.addListener('beforeRemove', e => {
               e.preventDefault()
               navigation.navigate('App')
          })
     }, [])

     useFocusEffect(
          React.useCallback(() => {
               (async () => {
                    const temp2 = []

                    const querySnapshot = await getDocs(query(collection(db, 'complexes'), where('status', '==', 'A')))
                    querySnapshot.forEach((doc) => {
                         // console.log(doc.id, " => ", doc.data())
                         temp2.push(doc.data())
                    })
                    setComplexes(temp2)
               })()
          }, [])
     )

     const submitSearch = async () => {
          const temp3 = []

          const complexesRef = collection(db, 'complexes')
          const q = query(complexesRef, where('name', '==', search))

          const querySnapshot = await getDocs(q)
          querySnapshot.forEach((doc) => {
               temp3.push(doc.data())
          })

          if (currentFilter === 'All') setComplexes(temp3)
          else setComplexes(temp3.filter(complex => complex.category === value))
     }

     const handleFilterChange = async (value) => {
          setCurrentFilter(value)

          const temp = []

          const querySnapshot = await getDocs(collection(db, 'complexes'))
          querySnapshot.forEach((doc) => {
               temp.push(doc.data())
          })

          if (value === 'All') setComplexes(temp)
          else setComplexes(temp.filter(complex => complex.category === value))
     }

     return (
          <SafeAreaView style={styles.container}>
               <ScrollView>
                    <View style={styles.searchContainer}>
                         <SearchBar
                              term={search}
                              onTermChange={(e) => setSearch(e)}
                              onTermSubmit={submitSearch}
                         />
                    </View>
                    <View style={styles.searchContainer}>
                         <FilterComplex filters={filters} currentFilter={currentFilter} handleFilterChange={handleFilterChange} />
                    </View>
                    <View>
                         <ComplexList complexes={complexes} navigation={navigation} />
                    </View>
               </ScrollView>
               <ExpoStatusBar />
          </SafeAreaView>
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

export default SportsListScreen
