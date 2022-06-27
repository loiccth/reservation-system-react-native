import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Button, ScrollView, Alert } from 'react-native'
import { getFirestore, collection, updateDoc, query, where, doc, getDoc } from 'firebase/firestore'
import { Ionicons } from '@expo/vector-icons'
import QRCode from 'react-native-qrcode-svg'

const ViewReservationDetailsScreen = ({ route, navigation }) => {
    const { complex, reservationDetails, price, discount } = route.params
    const [viewQR, setViewQR] = React.useState(false)
    const db = getFirestore()

    const handleCancel = () => {
        console.log(`cancel reservation => ${reservationDetails.id}`)
        updateDoc(doc(db, 'reservations', reservationDetails.id), {
            status: 'Cancelled',
            cancelDate: new Date().toISOString()
        }).then(() => navigation.navigate('Main'))
    }

    const createTwoButtonAlert = () => {
        Alert.alert('Cancellation', 'Are you sure you want to cancel this reservation?', [
            {
                text: 'Cancel',
                onPress: () => { },
                style: 'cancel',
            },
            { text: 'Yes', onPress: () => handleCancel() },
        ])
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>View Reservation</Text>
            </View>

            {!viewQR && <View style={styles.reservationInfo}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <View><Text style={{ fontSize: 16, fontWeight: '700' }}>Field</Text></View>
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
                        {reservationDetails.paid &&
                            <View style={{ marginVertical: 10 }}><Text style={{ fontWeight: '700' }}>Payment date</Text></View>
                        }
                        <View style={{ marginVertical: 10 }}><Text style={{ fontWeight: '700' }}>Status</Text></View>
                        {reservationDetails.status === 'Cancelled' &&
                            <View style={{ marginVertical: 10 }}><Text style={{ fontWeight: '700' }}>Cancelled date</Text></View>
                        }
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{}}><Text style={{ fontSize: 16, fontWeight: '700' }}>Value</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>{complex.name}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>{complex.location.split(', ')[0]}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>{new Date(reservationDetails.date).toLocaleDateString()}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>{reservationDetails.hourSlotDetail}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>{reservationDetails.packageDetails.name}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>Rs {reservationDetails.packageDetails.price}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>Rs {reservationDetails.packageDetails.kidPrice}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>{reservationDetails.people.adult}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>{reservationDetails.people.children}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>Rs {price - discount}</Text></View>
                        <View style={{ marginVertical: 6 }}><Text>{reservationDetails.paid ? <Ionicons name='checkmark-circle-outline' size={25} style={{ color: '#2ed62b' }} /> :
                            <Ionicons name='alert-circle-outline' size={25} style={{ color: '#d62b2b' }} />}</Text></View>
                        {reservationDetails.paid &&
                            <View style={{ marginVertical: 10 }}><Text>{new Date(reservationDetails.paymentDetails.date).toLocaleString()}</Text></View>
                        }
                        <View style={{ marginVertical: 10 }}>
                            <Text>{reservationDetails.status}</Text>
                        </View>
                        {reservationDetails.status === 'Cancelled' &&
                            <View style={{ marginVertical: 10 }}><Text>{new Date(reservationDetails.cancelDate).toLocaleString()}</Text></View>
                        }
                    </View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30, marginBottom: 10 }}>
                    {reservationDetails.status === 'Active' &&
                        <>
                            <TouchableOpacity
                                onPress={createTwoButtonAlert}
                                style={{ ...styles.price, width: 160, alignItems: 'center', backgroundColor: '#393E46', borderColor: '#393E46' }}>
                                <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Cancel reservation</Text>
                            </TouchableOpacity>
                            {!reservationDetails.paid &&
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Payment', { add: false, complex, reservationDetails, price, discount })}
                                    style={{ ...styles.price, width: 160, alignItems: 'center', backgroundColor: '#00ADB5', borderColor: '#00ADB5' }}>
                                    <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Pay reservation</Text>
                                </TouchableOpacity>
                            }
                            {reservationDetails.paid &&
                                <TouchableOpacity
                                    onPress={() => setViewQR(true)}
                                    style={{ ...styles.price, width: 160, alignItems: 'center', backgroundColor: '#00ADB5', borderColor: '#00ADB5' }}>
                                    <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>View QR Code</Text>
                                </TouchableOpacity>
                            }
                        </>
                    }
                </View>
            </View>}
            {viewQR &&
                <View style={{ alignItems: 'center', marginTop: 30, marginBottom: 10 }}>
                    <View style={{ marginTop: 30, marginBottom: 60 }}>
                        <QRCode
                            size={330}
                            value={reservationDetails.id}
                        />
                    </View>
                    <Text style={{ marginVertical: 10 }}>Present this QR Code at the entrance of the facility.</Text>
                    <TouchableOpacity
                        onPress={() => setViewQR(false)}
                        style={{ ...styles.price, width: 160, alignItems: 'center', backgroundColor: '#393E46', borderColor: '#393E46' }}>
                        <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Close QR</Text>
                    </TouchableOpacity>
                </View>
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
    reservationInfo: {
        padding: 10,
        marginTop: 30
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
    }
})

export default ViewReservationDetailsScreen