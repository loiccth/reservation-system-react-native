import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Button, ScrollView } from 'react-native'
import { getFirestore, collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore'
import { UserContext } from '../contexts/UserContext'

const ReservationPreviewScreen = ({ route, navigation }) => {
    const { membership } = React.useContext(UserContext)
    const { complex, reservationDetails, price, discount } = route.params
    const db = getFirestore()

    const handleOnPress = () => {
        if (membership) {
            if (membership.type === 'VIP') {
                navigation.navigate('ReserveSuccess', { complex, reservationDetails, price, discount })
            }
        }
        else {
            navigation.navigate('Payment', { add: true, complex, reservationDetails, price, discount })
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Reservation Review</Text>
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
                        {membership &&
                            <>
                                <View style={{ marginVertical: 10 }}><Text style={{ fontWeight: '700' }}>Gross price</Text></View>
                                <View style={{ marginVertical: 10 }}><Text style={{ fontWeight: '700' }}>Membership discount</Text></View>
                            </>
                        }
                        <View style={{ marginVertical: 10 }}><Text style={{ fontWeight: '700' }}>Total price</Text></View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ alignSelf: 'center' }}><Text style={{ fontSize: 16, fontWeight: '700' }}>Value</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>{complex.name}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>{complex.location}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>{new Date(reservationDetails.date).toLocaleDateString()}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>{reservationDetails.hourSlotDetail}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>{reservationDetails.packageDetails.name}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>Rs {reservationDetails.packageDetails.price}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>Rs {reservationDetails.packageDetails.kidPrice}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>{reservationDetails.people.adult}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>{reservationDetails.people.children}</Text></View>
                        {membership &&
                            <>
                                <View style={{ marginVertical: 10 }}><Text >Rs {price + discount}</Text></View>
                                <View style={{ marginVertical: 10 }}><Text >Rs {discount}</Text></View>
                            </>
                        }
                        <View style={{ marginVertical: 10 }}><Text>Rs {price}</Text></View>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
                    <TouchableOpacity
                        onPress={handleOnPress}
                        style={{ ...styles.price, backgroundColor: price === 0 ? '#8f8f8f' : '#00ADB5', borderColor: price === 0 ? '#8f8f8f' : '#00ADB5' }}>
                        <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Confirm reservation</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
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

export default ReservationPreviewScreen