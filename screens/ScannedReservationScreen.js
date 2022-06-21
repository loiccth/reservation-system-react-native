import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, TextInput, Image, ToastAndroid, ScrollView } from 'react-native'
import { getFirestore, collection, getDocs, query, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
import isInThePast from '../utils/pastCheck'
import LoadingReservation from '../components/LoadingReservation'
import { Ionicons } from '@expo/vector-icons'
import Reservation404 from '../components/Reservation404'

const ScannedReservationScreen = ({ route, navigation }) => {
    const db = getFirestore()
    const { reservationId } = route.params
    const [loading, setLoading] = React.useState(true)
    const [reservation, setReservation] = React.useState()

    React.useEffect(() => {
        getDoc(doc(db, 'reservations', reservationId))
            .then(res => {
                if (res.exists()) {
                    setReservation(res.data())
                }
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => setLoading(false))
    }, [])

    const createTwoButtonAlert = () => {
        Alert.alert('Confirmation', 'Are you sure you want to confirm this reservation?', [
            {
                text: 'Cancel',
                onPress: () => { },
                style: 'cancel',
            },
            { text: 'Yes', onPress: () => handleConfirm() },
        ])
    }

    const handleConfirm = () => {
        updateDoc(doc(db, 'reservations', reservationId), {
            status: 'CO',
            completeDate: new Date().toISOString()
        }).then(() => navigation.navigate('Camera'))
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Reservation Details</Text>
            </View>
            {loading ? <LoadingReservation /> :
                !reservation ? <Reservation404 navigation={navigation} msg='Reservation not found.' /> :
                    isInThePast(new Date(reservation.date)) ?
                        <Reservation404 navigation={navigation} msg='Reservation expired.' /> :
                        reservation.status !== 'A' ?
                            <Reservation404 navigation={navigation} msg='Reservation cancelled/expired.' /> :
                            <>
                                <View style={styles.reservationInfo}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 1, alignItems: 'center' }}>
                                            <View><Text style={{ fontSize: 16, fontWeight: '700' }}>Field</Text></View>
                                            <View style={{ marginVertical: 10 }}><Text style={{ fontWeight: '700' }}>User</Text></View>
                                            <View style={{ marginVertical: 10 }}><Text style={{ fontWeight: '700' }}>Pool name</Text></View>
                                            <View style={{ marginVertical: 10 }}><Text style={{ fontWeight: '700' }}>Location</Text></View>
                                            <View style={{ marginVertical: 10 }}><Text style={{ fontWeight: '700' }}>Reservation date</Text></View>
                                            <View style={{ marginVertical: 10 }}><Text style={{ fontWeight: '700' }}>Slot time</Text></View>
                                            <View style={{ marginVertical: 10 }}><Text style={{ fontWeight: '700' }}>Package selected</Text></View>
                                            <View style={{ marginVertical: 10 }}><Text style={{ fontWeight: '700' }}>Adult price</Text></View>
                                            <View style={{ marginVertical: 10 }}><Text style={{ fontWeight: '700' }}>Kid Price</Text></View>
                                            <View style={{ marginVertical: 10 }}><Text style={{ fontWeight: '700' }}>No. of adults</Text></View>
                                            <View style={{ marginVertical: 10 }}><Text style={{ fontWeight: '700' }}>No. of kids</Text></View>
                                            <View style={{ marginVertical: 10 }}><Text style={{ fontWeight: '700' }}>Total price</Text></View>
                                            <View style={{ marginVertical: 10 }}><Text style={{ fontWeight: '700' }}>Payment completed</Text></View>
                                            {reservation.paid &&
                                                <View style={{ marginVertical: 10 }}><Text style={{ fontWeight: '700' }}>Payment date</Text></View>
                                            }
                                            <View style={{ marginVertical: 10 }}><Text style={{ fontWeight: '700' }}>Status</Text></View>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <View style={{}}><Text style={{ fontSize: 16, fontWeight: '700' }}>Value</Text></View>
                                            <View style={{ marginVertical: 10 }}><Text>{reservation.user}</Text></View>
                                            <View style={{ marginVertical: 10 }}><Text>{reservation.complex.name}</Text></View>
                                            <View style={{ marginVertical: 10 }}><Text>{reservation.complex.location}</Text></View>
                                            <View style={{ marginVertical: 10 }}><Text>{new Date(reservation.date).toLocaleDateString()}</Text></View>
                                            <View style={{ marginVertical: 10 }}><Text>{reservation.hourSlotDetail}</Text></View>
                                            <View style={{ marginVertical: 10 }}><Text>{reservation.packageDetails.name}</Text></View>
                                            <View style={{ marginVertical: 10 }}><Text>Rs {reservation.packageDetails.price}</Text></View>
                                            <View style={{ marginVertical: 10 }}><Text>Rs {reservation.packageDetails.kidPrice}</Text></View>
                                            <View style={{ marginVertical: 10 }}><Text>{reservation.people.adult}</Text></View>
                                            <View style={{ marginVertical: 10 }}><Text>{reservation.people.children}</Text></View>
                                            <View style={{ marginVertical: 10 }}><Text>Rs {reservation.packageDetails.price * reservation.people.adult + reservation.packageDetails.kidPrice * reservation.people.children}</Text></View>
                                            <View style={{ marginVertical: 6 }}><Text>{reservation.paid ? <Ionicons name='checkmark-circle-outline' size={25} style={{ color: '#2ed62b' }} /> :
                                                <Ionicons name='alert-circle-outline' size={25} style={{ color: '#d62b2b' }} />}</Text></View>
                                            {reservation.paid &&
                                                <View style={{ marginVertical: 10 }}><Text>{new Date(reservation.paymentDetails.date).toLocaleString()}</Text></View>
                                            }
                                            <View style={{ marginVertical: 10 }}>
                                                <Text>{reservation.status === 'A' ? 'Active' : reservation.status === 'CA' ? 'Cancelled' : 'Completed/Expired'}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {!reservation.paid &&
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{ color: '#d62b2b', fontWeight: '700' }}>Warning: Reservation not paid.</Text>
                                    </View>
                                }
                                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                                    <TouchableOpacity
                                        onPress={createTwoButtonAlert}
                                        style={{ ...styles.price, backgroundColor: '#00ADB5', borderColor: '#00ADB5' }}>
                                        <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Validate reservation</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
            }
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
    header: {
        alignItems: 'center',
        marginVertical: 0,
        width: '100%',
        backgroundColor: '#393E46',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#EEEEEE',
        marginVertical: 10
    },
    price: {
        fontSize: 18,
        margin: 3,
        padding: 8,
        paddingRight: 12,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#393E46',
        color: '#393E46',
        borderRadius: 50
    },
    reservationInfo: {
        padding: 10,
        marginTop: 30
    }
})

export default ScannedReservationScreen