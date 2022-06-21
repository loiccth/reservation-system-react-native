import React from 'react'
import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore'
import { StyleSheet, View } from 'react-native'
import { Text, TouchableOpacity, Alert } from 'react-native'
import { Card } from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons'
import NoPool from './NoPool'
import { useFocusEffect } from '@react-navigation/native'

const AdminComplexScreen = ({ tab }) => {
    const db = getFirestore()
    const [complexes, setComplexes] = React.useState([])

    const status = tab === 'enabled' ? 'A' : 'D'

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                let temp = []

                getDocs(query(collection(db, 'complexes'), where('status', '==', status)))
                    .then(querySnapshot => {
                        querySnapshot.forEach((doc) => {
                            // console.log(doc.id, " => ", doc.data())
                            temp.push({
                                ...doc.data(),
                                id: doc.id
                            })
                        })
                        setComplexes(temp)
                    })
                    .catch(err => console.log(err))
            })()
        }, [tab])
    )

    const createTwoButtonAlert = (id) => {
        Alert.alert('Status change', `Are you sure you want to ${status === 'A' ? 'disable' : 'enable'} this complex?`, [
            {
                text: 'Cancel',
                onPress: () => { },
                style: 'cancel',
            },
            { text: 'Yes', onPress: () => update(id) },
        ])
    }

    const update = (id) => {
        updateDoc(doc(db, 'complexes', id), {
            status: status === 'A' ? 'D' : 'A'
        }).then(() => {
            let temp = []

            getDocs(query(collection(db, 'complexes'), where('status', '==', status)))
                .then(querySnapshot => {
                    querySnapshot.forEach((doc) => {
                        // console.log(doc.id, " => ", doc.data())
                        temp.push({
                            ...doc.data(),
                            id: doc.id
                        })
                    })
                    setComplexes(temp)
                })
                .catch(err => console.log(err))
        })
    }

    return (
        <View>
            {complexes.length === 0 &&
                <NoPool />
            }

            {complexes.map((complex, index) =>
                <View key={index}>
                    <Card style={styles.card} elevation={10}>
                        <TouchableOpacity onPress={() => createTwoButtonAlert(complex.id)}>
                            <View style={styles.text}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.name}>{complex.name}</Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                        <Text>
                                            <Ionicons name='location-outline' size={20} style={{ color: '#00ADB5' }} /> {complex.location.split(', ')[0]}
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text>Category: </Text>
                                    <Text style={{ padding: 3, paddingRight: 7, paddingHorizontal: 10, borderWidth: 1, borderColor: '#393E46', color: '#393E46', borderRadius: 50 }}>{complex.category}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text><Ionicons name='pricetags-outline' size={20} style={{ color: '#00ADB5' }} /> </Text>
                                    {complex.tags.map(tag =>
                                        <Text key={tag} style={{ margin: 3, padding: 3, paddingRight: 7, paddingHorizontal: 10, borderWidth: 1, borderColor: '#393E46', color: '#393E46', borderRadius: 50 }}>{tag}</Text>
                                    )}
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text>Vaccination required: </Text>
                                    <Text style={{ marginTop: 1 }}>{complex.vaccinationRequired ? <Ionicons name='checkmark-circle-outline' size={25} style={{ color: '#2ed62b' }} /> :
                                        <Ionicons name='alert-circle-outline' size={25} style={{ color: '#d62b2b' }} />}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Card>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        margin: 10
    },
    name: {
        fontSize: 16,
        fontWeight: '700'
    },
    text: {
        marginHorizontal: 10,
        marginBottom: 5,
        marginTop: 5
    }
})

export default AdminComplexScreen