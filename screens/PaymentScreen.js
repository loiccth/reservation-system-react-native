import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, TextInput, Image, ScrollView, ToastAndroid } from 'react-native'
import { getFirestore, collection, addDoc, query, where, doc, getDoc } from 'firebase/firestore'
import illustration from '../assets/undraw_Credit_card_re_blml.png'
import * as yup from 'yup'
import { UserContext } from '../contexts/UserContext'

let schema = yup.object().shape({
    expiryDate: yup.string().matches(/^(0[1-9]|1[0-2])\/?(2[2-9])$/, 'Invalid expiry date.').required('Expiry date field is required.'),
    address: yup.string().required('Address field is required.'),
    name: yup.string().required('Name field is required.'),
    cvc: yup.string().length(3, 'Invalid CVC length.').required('CVC field is required.'),
    card: yup.string().length(16, 'Invalid card No. length.').required('Card No. field is required.')
})

const PaymentScreen = ({ route, navigation }) => {
    const { add, complex, reservationDetails, price } = route.params
    const [reservationId, setReservationId] = React.useState()
    const user = React.useContext(UserContext)
    const [creditCard, setCreditCard] = React.useState({
        cardNo: '',
        name: '',
        expiryDate: '',
        cvc: '',
        billingAddress: ''
    })
    const db = getFirestore()
    const ref_input1 = React.useRef()
    const ref_input2 = React.useRef()
    const ref_input3 = React.useRef()
    const ref_input4 = React.useRef()

    React.useEffect(() => {
        if (add) {
            addDoc(collection(db, 'reservations'),
                { ...reservationDetails, paid: false, paymentDetails: null, user: user.email, status: 'A', complex })
                .then(result => {
                    console.log(`reservation saved => ${result._key.path.segments[1]}`)
                    setReservationId(result._key.path.segments[1])
                })
                .catch(err => {
                    console.log(err)
                    // ToastAndroid.show(err.message + '', ToastAndroid.SHORT)
                })

            const unsubscribe = navigation.addListener('beforeRemove', e => {
                e.preventDefault()
                unsubscribe()
                navigation.navigate('Main')
            })
        }
        else {
            console.log(`reservation not added => ${reservationDetails.id}`)
            setReservationId(reservationDetails.id)
        }
    }, [])

    const handleFields = (field, data) => {
        if (field === 'card') {
            if (data != '') {
                let noSpace = data.replace(/ /g, '')
                setCreditCard({
                    ...creditCard,
                    cardNo: noSpace.replace(/(.{4})/g, "$1 ")
                })
            }
            else {
                setCreditCard({
                    ...creditCard,
                    cardNo: data
                })
            }
        }
        else if (field === 'name') {
            setCreditCard({
                ...creditCard,
                name: data
            })
        }
        else if (field === 'date') {
            if (data != '') {
                let noSpace = data.replace('/', '')
                setCreditCard({
                    ...creditCard,
                    expiryDate: data.length === 2 ? data : noSpace.replace(/(.{2})/, "$1/")
                })
            }
            else {
                setCreditCard({
                    ...creditCard,
                    expiryDate: data
                })
            }
        }
        else if (field === 'cvc') {
            setCreditCard({
                ...creditCard,
                cvc: data
            })
        }
        else if (field === 'address') {
            setCreditCard({
                ...creditCard,
                billingAddress: data
            })
        }
    }

    const validatePaymentDetails = () => {
        schema.validate({
            expiryDate: creditCard.expiryDate,
            address: creditCard.billingAddress,
            name: creditCard.name,
            cvc: creditCard.cvc,
            card: creditCard.cardNo.replace(/ /g, '')
        })
            .then(() => {
                navigation.navigate('PaymentSuccess', { complex, reservationDetails, reservationId, price })
            })
            .catch(err => {
                console.log(err)
                ToastAndroid.show(err.message + '', ToastAndroid.SHORT)
            })
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Reservation Payment</Text>
            </View>

            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image source={illustration} style={styles.illustration} />
            </View>

            <View style={styles.reservationInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 3, marginRight: 10 }}>
                        <View width={'100%'} >
                            <Text style={styles.label}>Card No.</Text>
                        </View>
                        <TextInput style={styles.inputText}
                            placeholderTextColor='#c4cfce'
                            value={creditCard.cardNo}
                            selectionColor={'#919191'}
                            keyboardType='number-pad'
                            maxLength={19}
                            onChangeText={text => handleFields('card', text)}
                            onSubmitEditing={() => ref_input1.current.focus()}
                            returnKeyType='next'
                            blurOnSubmit={false}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <View width={'100%'}>
                            <Text style={styles.label}>CVC</Text>
                        </View>
                        <TextInput style={styles.inputText}
                            placeholderTextColor='#c4cfce'
                            value={creditCard.cvc}
                            selectionColor={'#919191'}
                            keyboardType='numeric'
                            maxLength={3}
                            onChangeText={text => handleFields('cvc', text)}
                            onSubmitEditing={() => ref_input2.current.focus()}
                            returnKeyType='next'
                            ref={ref_input1}
                            blurOnSubmit={false}
                        />
                    </View>
                </View>
                <View style={{ marginTop: 20 }}>
                    <View width={'100%'} >
                        <Text style={styles.label}>Cardholder Name</Text>
                    </View>
                    <TextInput style={styles.inputText}
                        placeholderTextColor='#c4cfce'
                        value={creditCard.name}
                        selectionColor={'#919191'}
                        keyboardType='ascii-capable'
                        onChangeText={text => handleFields('name', text)}
                        onSubmitEditing={() => ref_input3.current.focus()}
                        returnKeyType='next'
                        ref={ref_input2}
                        blurOnSubmit={false}
                    />
                </View>
                <View style={{ marginTop: 20 }}>
                    <View width={'100%'} >
                        <Text style={styles.label}>Billing Address</Text>
                    </View>
                    <TextInput style={styles.inputText}
                        placeholderTextColor='#c4cfce'
                        value={creditCard.billingAddress}
                        selectionColor={'#919191'}
                        keyboardType='ascii-capable'
                        onChangeText={text => handleFields('address', text)}
                        onSubmitEditing={() => ref_input4.current.focus()}
                        returnKeyType='next'
                        ref={ref_input3}
                        blurOnSubmit={false}
                    />
                </View>
                <View style={{ marginTop: 20, width: '30%' }}>
                    <View width={'100%'} >
                        <Text style={styles.label}>Expiration Date</Text>
                    </View>
                    <TextInput style={styles.inputText}
                        placeholderTextColor='#c4cfce'
                        value={creditCard.expiryDate}
                        selectionColor={'#919191'}
                        keyboardType='numeric'
                        maxLength={5}
                        onChangeText={text => handleFields('date', text)}
                        ref={ref_input4}
                    />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Main')}
                        style={{ ...styles.price, width: 140, alignItems: 'center', backgroundColor: '#393E46', borderColor: '#393E46' }}>
                        <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Pay later</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={validatePaymentDetails}
                        style={{ ...styles.price, width: 140, alignItems: 'center', backgroundColor: '#00ADB5', borderColor: '#00ADB5' }}>
                        <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Confirm payment</Text>
                    </TouchableOpacity>
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

export default PaymentScreen