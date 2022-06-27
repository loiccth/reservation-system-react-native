import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, TextInput, Image, ToastAndroid } from 'react-native'
import { getFirestore, collection, getDocs, query, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
import { getAuth, signOut } from 'firebase/auth'
import illustration from '../assets/undraw_two_factor_authentication_namy.png'
import axios from 'axios'
import { UserContext } from '../contexts/UserContext'
import isInThePast from '../utils/pastCheck'

const MFAScreen = ({ navigation }) => {
    const { user, setUser } = React.useContext(UserContext)
    const db = getFirestore()
    const auth = getAuth()
    const [disable, setDisable] = React.useState(true)
    const [code, setCode] = React.useState()

    React.useEffect(() => {
        generateMFA()

        setTimeout(() => {
            setDisable(false)
        }, 15000)
    }, [])

    const validateMFA = () => {
        if (!code) return ToastAndroid.show('Code field is required.', ToastAndroid.SHORT)

        getDoc(doc(db, 'mfa', user.email))
            .then(res => {
                if (res.exists()) {
                    if (isInThePast(new Date(res.data().expiry))) {
                        ToastAndroid.show('MFA code expired.', ToastAndroid.SHORT)
                    }
                    else {
                        if (res.data().code == code) {
                            deleteDoc(doc(db, 'mfa', user.email))
                            updateDoc(doc(db, 'users', user.uid), {
                                mfa: false
                            })
                            setUser({
                                ...user,
                                mfa: false
                            })
                            navigation.navigate('App')
                        }
                        else {
                            setCode()
                            ToastAndroid.show('MFA does not match.', ToastAndroid.SHORT)
                        }
                    }
                }
                else {
                    setCode()
                    ToastAndroid.show('MFA validation failed.', ToastAndroid.SHORT)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    const generateMFA = () => {
        axios.post('http://192.168.100.50:8080/api/v1/mfa/generate', { email: user.email, phone: user.phone })
            .catch(err => console.log(err))
    }

    const handleResend = () => {
        setDisable(true)
        generateMFA()

        setTimeout(() => {
            setDisable(false)
        }, 15000)
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>MFA Verification</Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image source={illustration} style={styles.illustration} />
            </View>

            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 60 }}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <Text style={{ fontSize: 16 }}>MFA code sent to </Text>
                    <Text style={{ fontSize: 16, fontWeight: '700' }}>+230{user.phone}</Text>
                </View>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <Text style={{}}>Didn't receive code? </Text>
                    <TouchableOpacity onPress={handleResend} disabled={disable}>
                        <Text style={{ ...styles.buttons, color: disable ? '#393E46' : '#00ADB5' }}>Resend</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ alignItems: 'center' }}>
                <View style={{ marginVertical: 30, width: '60%' }}>
                    <View width={'100%'} >
                        <Text style={styles.label}>MFA Code</Text>
                    </View>
                    <TextInput style={{ ...styles.inputText }}
                        placeholderTextColor='#c4cfce'
                        value={code}
                        keyboardType='numeric'
                        selectionColor={'#919191'}
                        onChangeText={text => setCode(text)}
                    />
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => signOut(auth)}
                    style={{ ...styles.price, width: 140, alignItems: 'center', backgroundColor: '#393E46', borderColor: '#393E46' }}>
                    <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Logout</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={validateMFA}
                    style={{ ...styles.price, width: 140, alignItems: 'center', backgroundColor: '#00ADB5', borderColor: '#00ADB5' }}>
                    <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Validate</Text>
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
        width: 270,
        height: 200,
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
    },
    buttons: {
        fontWeight: 'bold',
        color: '#00ADB5'
    }
})

export default MFAScreen