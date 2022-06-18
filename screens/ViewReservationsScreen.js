import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, TextInput, ScrollView, ToastAndroid } from 'react-native'
import { getFirestore, collection, addDocs, query, where, doc, getDocs } from 'firebase/firestore'
import { UserContext } from '../contexts/UserContext'
import { useFocusEffect } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { Card } from 'react-native-paper'
import NoReservation from '../components/NoReservations'

const ViewReservationScreen = ({ navigation }) => {
    const [tab, setTab] = React.useState('active')
    const [active, setActive] = React.useState([])
    const [completed, setCompleted] = React.useState([])
    const user = React.useContext(UserContext).user
    const db = getFirestore()

    // console.log(active)
    // console.log(completed)

    // React.useEffect(async () => {
    //     const temp = []

    //     const complexesRef = collection(db, 'reservations')
    //     const q = query(complexesRef, where('user', '==', user.email))

    //     const querySnapshot = await getDocs(q)
    //     querySnapshot.forEach((doc) => {
    //         temp.push({ ...doc.data(), id: doc.id })
    //     })

    //     setActive(temp.filter(reser => reser.status === 'A'))
    //     setCompleted(temp.filter(reser => reser.status === 'C'))
    // }, [])

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                const temp = []

                const complexesRef = collection(db, 'reservations')
                const q = query(complexesRef, where('user', '==', user.email))

                const querySnapshot = await getDocs(q)
                querySnapshot.forEach((doc) => {
                    temp.push({ ...doc.data(), id: doc.id })
                })

                setActive(temp.filter(reser => reser.status === 'A'))
                setCompleted(temp.filter(reser => reser.status === 'CA' || reser.status === 'CO'))
            })()
        }, [])
    )

    return (
        <ScrollView style={styles.container}>
            <View style={{ flexDirection: 'row', backgroundColor: '#3ff', height: 50 }}>
                <TouchableOpacity
                    onPress={() => setTab('active')}
                    activeOpacity={1}
                    style={{
                        ...styles.tab,
                        backgroundColor: tab === 'active' ? '#00ADB5' : '#393E46',
                    }}
                >
                    <Text style={{ ...styles.tabText, color: tab === 'active' ? '#eee' : '#eee' }}>Active</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setTab('completed')}
                    activeOpacity={1}
                    style={{
                        ...styles.tab,
                        backgroundColor: tab === 'completed' ? '#00ADB5' : '#393E46',
                    }}
                >
                    <Text style={{ ...styles.tabText, color: tab === 'completed' ? '#eee' : '#eee' }}>Others</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {tab === 'active' &&
                    <View style={{ margin: 10 }}>
                        {active.map((reser, i) =>
                            <Card key={i} style={styles.card} elevation={10}>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('DetailsReservation', {
                                        complex: reser.complex,
                                        reservationDetails: reser,
                                        price: (reser.packageDetails.price * reser.people.adult) + (reser.packageDetails.kidPrice * reser.people.children)
                                    })}>
                                    <View style={styles.text}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.name}>{reser.complex.name}</Text>
                                            </View>
                                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                <Text>
                                                    <Ionicons name='location-outline' size={20} style={{ color: '#00ADB5' }} /> {reser.complex.location.split(', ')[0]}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text>
                                                <Ionicons name='calendar-outline' size={20} style={{ color: '#00ADB5' }} /> {new Date(reser.date).toLocaleDateString() + ' @ ' + reser.hourSlotDetail}
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text>
                                                <Ionicons name='people-outline' size={20} style={{ color: '#00ADB5' }} /> Adults: {reser.people.adult}, Children: {reser.people.children}
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text>Payment: </Text>
                                            <Text style={{ marginTop: 1 }}>{reser.paid ? <Ionicons name='checkmark-circle-outline' size={25} style={{ color: '#2ed62b' }} /> :
                                                <Ionicons name='alert-circle-outline' size={25} style={{ color: '#d62b2b' }} />}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </Card>
                        )}
                        {active.length === 0 && <NoReservation />}
                    </View>
                }
                {tab === 'completed' &&
                    <View style={{ margin: 10 }}>
                        {completed.map((reser, i) =>
                            <Card key={i} style={styles.card} elevation={10}>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('DetailsReservation', {
                                        complex: reser.complex,
                                        reservationDetails: reser,
                                        price: (reser.packageDetails.price * reser.people.adult) + (reser.packageDetails.kidPrice * reser.people.children)
                                    })}>
                                    <View style={styles.text}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.name}>{reser.complex.name}</Text>
                                            </View>
                                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                <Text>
                                                    <Ionicons name='location-outline' size={20} style={{ color: '#00ADB5' }} /> {reser.complex.location.split(', ')[0]}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text>
                                                <Ionicons name='calendar-outline' size={20} style={{ color: '#00ADB5' }} /> {new Date(reser.date).toLocaleDateString() + ' @ ' + reser.hourSlotDetail}
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text>
                                                <Ionicons name='people-outline' size={20} style={{ color: '#00ADB5' }} /> Adults: {reser.people.adult}, Children: {reser.people.children}
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text>Payment:  </Text>
                                            <Text style={{ marginTop: 1 }}>{reser.paid ? <Ionicons name='checkmark-circle-outline' size={25} style={{ color: '#2ed62b' }} /> :
                                                <Ionicons name='alert-circle-outline' size={25} style={{ color: '#d62b2b' }} />}</Text>
                                        </View>
                                        <Text>{reser.status === 'CA' ? 'Reservation cancelled' : 'Reservation expired'}</Text>
                                    </View>
                                </TouchableOpacity>
                            </Card>
                        )}
                        {completed.length === 0 && <NoReservation />}
                    </View>
                }
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 0,
        marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabText: {
        fontWeight: '700',
        fontSize: 16
    },
    name: {
        fontWeight: '700'
    },
    card: {
        backgroundColor: 'white',
        margin: 10
    },
    text: {
        marginHorizontal: 10,
        marginBottom: 5,
        marginTop: 5
    }
})

export default ViewReservationScreen