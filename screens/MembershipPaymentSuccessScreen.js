import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, TextInput, Image, ScrollView } from 'react-native'
import { getFirestore, collection, getDocs, query, where, doc, setDoc, updateDoc } from 'firebase/firestore'
import illustration from '../assets/undraw_Order_confirmed_re_g0if.png'
import axios from 'axios'
import { UserContext } from '../contexts/UserContext'
import addMonths from '../utils/addMonths'

const MembershipPaymentSuccessScreen = ({ route, navigation }) => {
    const user = React.useContext(UserContext).user
    const { type, price, recurring } = route.params
    const db = getFirestore()

    React.useEffect(() => {
        axios.post('http://192.168.100.50:8080/api/v1/membership', { id: user.uid, price, phone: user.phone, email: user.email })
            .then(() => {
                setDoc(doc(db, 'memberships', user.uid), {
                    type,
                    startDate: new Date().toISOString(),
                    endDate: addMonths(new Date(), 1).toISOString(),
                    recurring
                })
            })
            .catch(err => console.log(err))

        const unsubscribe = navigation.addListener('beforeRemove', e => {
            e.preventDefault()
            unsubscribe()
            navigation.navigate('Membership')
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
                    <Text>Payment confirmed.</Text>
                    <Text>You'll receive your receipt by email/SMS.</Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 30 }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Membership')}
                    style={{ ...styles.price, width: 140, alignItems: 'center', backgroundColor: '#00ADB5', borderColor: '#00ADB5' }}>
                    <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Okay!</Text>
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

export default MembershipPaymentSuccessScreen