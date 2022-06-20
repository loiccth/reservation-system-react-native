import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Button, ScrollView, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const ViewUserReservationDetailsScreen = ({ route, navigation }) => {
    const { complex, reservationDetails, price } = route.params

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>View Reservation</Text>
            </View>

            <View style={styles.reservationInfo}>
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
                        {reservationDetails.status === 'CA' &&
                            <View style={{ marginVertical: 10 }}><Text style={{ fontWeight: '700' }}>Cancelled date</Text></View>
                        }
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{}}><Text style={{ fontSize: 16, fontWeight: '700' }}>Value</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>{complex.name}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>{complex.location}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>{new Date(reservationDetails.date).toLocaleDateString()}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>{reservationDetails.hourSlotDetail}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>{reservationDetails.packageDetails.name}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>Rs {reservationDetails.packageDetails.price}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>Rs {reservationDetails.packageDetails.kidPrice}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>{reservationDetails.people.adult}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>{reservationDetails.people.children}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>Rs {price}</Text></View>
                        <View style={{ marginVertical: 6 }}><Text>{reservationDetails.paid ? <Ionicons name='checkmark-circle-outline' size={25} style={{ color: '#2ed62b' }} /> :
                            <Ionicons name='alert-circle-outline' size={25} style={{ color: '#d62b2b' }} />}</Text></View>
                        {reservationDetails.paid &&
                            <View style={{ marginVertical: 10 }}><Text>{new Date(reservationDetails.paymentDetails.date).toLocaleString()}</Text></View>
                        }
                        <View style={{ marginVertical: 10 }}>
                            <Text>{reservationDetails.status === 'A' ? 'Active' : reservationDetails.status === 'CA' ? 'Cancelled' : 'Completed/Expired'}</Text>
                        </View>
                        {reservationDetails.status === 'CA' &&
                            <View style={{ marginVertical: 10 }}><Text>{new Date(reservationDetails.cancelDate).toLocaleString()}</Text></View>
                        }
                    </View>
                </View>
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
    }
})

export default ViewUserReservationDetailsScreen