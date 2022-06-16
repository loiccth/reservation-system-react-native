import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, TextInput, Image, ScrollView } from 'react-native'
import { getFirestore, collection, getDocs, query, where, doc, getDoc, updateDoc } from 'firebase/firestore'
import illustration from '../assets/undraw_Order_confirmed_re_g0if.png'
import axios from 'axios'
import { UserContext } from '../contexts/UserContext'

const PaymentSuccessScreen = ({ route, navigation }) => {
    const user = React.useContext(UserContext)
    const { complex, reservationDetails, reservationId, price } = route.params
    const db = getFirestore()

    React.useEffect(() => {
        axios.post('http://192.168.100.50:8080/api/v1/', { complex, reservationDetails, price, phone: user.phone, email: user.email })
            .then(() => {
                updateDoc(doc(db, 'reservations', reservationId), {
                    paid: true,
                    paymentDetails: {
                        date: new Date().toISOString()
                    }
                })
            })
            .catch(err => console.log(err))

        const unsubscribe = navigation.addListener('beforeRemove', e => {
            e.preventDefault()
            unsubscribe()
            navigation.navigate('Main')
        })
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Payment confirmed</Text>
            </View>

            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <Image source={illustration} style={styles.illustration} />
                <View style={{ alignItems: 'center' }}>
                    <Text>Reservation confirmed.</Text>
                    <Text>You'll receive your receipt by email/SMS.</Text>
                    <Text>To view your reservation, go in reservation tab.</Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 30 }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Main')}
                    style={{ ...styles.price, width: 140, alignItems: 'center', backgroundColor: '#00ADB5', borderColor: '#00ADB5' }}>
                    <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Main menu</Text>
                </TouchableOpacity>
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
    illustration: {
        width: 200,
        height: 200,
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
    },
    inputText: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#aeb0af',
        padding: 3,
        paddingLeft: 10,
        color: '#393E46'
    },
    label: {
        alignSelf: 'flex-start',
        color: '#393E46',
        fontWeight: 'bold'
    }
})

export default PaymentSuccessScreen