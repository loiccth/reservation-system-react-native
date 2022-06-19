import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, TextInput, Image, ScrollView, ToastAndroid } from 'react-native'
import { getFirestore, collection, addDoc, query, where, doc, updateDoc } from 'firebase/firestore'
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth'
import illustration from '../assets/undraw_secure_login_pdn4.png'
import * as yup from 'yup'
import { UserContext } from '../contexts/UserContext'

let schema = yup.object().shape({
    confirmPassword: yup.string().min(8, 'Confirm password must be at least 8 characters.').required('Confirm password field is required.'),
    newPassword: yup.string().min(8, 'New password must be at least 8 characters.').required('New password field is required.'),
    oldPassword: yup.string().min(8, 'Password must be at least 8 characters.').required('Password field is required.'),
})

const UpdatePasswordScreen = ({ navigation }) => {
    const db = getFirestore()
    const user = (React.useContext(UserContext).user)
    const [passwords, setPasswords] = React.useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const ref_input1 = React.useRef()
    const ref_input2 = React.useRef()
    const auth = getAuth()

    const updatePasswords = (e, data) => {
        if (e === 'oldPassword') {
            setPasswords({
                ...passwords,
                oldPassword: data
            })
        }
        else if (e === 'newPassword') {
            setPasswords({
                ...passwords,
                newPassword: data
            })
        }
        else if (e === 'confirmPassword') {
            setPasswords({
                ...passwords,
                confirmPassword: data
            })
        }
    }

    const handleUpdatePassword = () => {
        schema.validate({
            oldPassword: passwords.oldPassword,
            newPassword: passwords.newPassword,
            confirmPassword: passwords.confirmPassword
        })
            .then(async () => {
                if (passwords.newPassword === passwords.confirmPassword) {
                    const cred = EmailAuthProvider.credential(user.email, passwords.oldPassword)
                    try {
                        setPasswords({
                            oldPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                        })
                        await reauthenticateWithCredential(auth.currentUser, cred)
                        await updatePassword(auth.currentUser, passwords.newPassword)
                        navigation.navigate('Account')
                        ToastAndroid.show('Password updated.', ToastAndroid.SHORT)
                    } catch (e) {
                        console.log(e)
                        setPasswords({
                            oldPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                        })
                        ToastAndroid.show('Incorrect old password.', ToastAndroid.SHORT)
                    }
                }
                else {
                    setPasswords({
                        oldPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                    })
                    ToastAndroid.show('Confirm password does not match.', ToastAndroid.SHORT)
                }
            })
            .catch(err => {
                console.log(err)
                setPasswords({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                })
                ToastAndroid.show(err.message + '', ToastAndroid.SHORT)
            })
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Update Password</Text>
            </View>

            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image source={illustration} style={styles.illustration} />
            </View>

            <View style={styles.reservationInfo}>
                <View style={{ marginTop: 20 }}>
                    <View width={'100%'} >
                        <Text style={styles.label}>Current password</Text>
                    </View>
                    <TextInput style={styles.inputText}
                        placeholderTextColor='#c4cfce'
                        value={passwords.oldPassword}
                        selectionColor={'#919191'}
                        keyboardType='ascii-capable'
                        secureTextEntry={true}
                        onSubmitEditing={() => ref_input1.current.focus()}
                        onChangeText={text => updatePasswords('oldPassword', text)}
                        returnKeyType='next'
                        blurOnSubmit={false}
                    />
                </View>
                <View style={{ marginTop: 20 }}>
                    <View width={'100%'} >
                        <Text style={styles.label}>New password</Text>
                    </View>
                    <TextInput style={styles.inputText}
                        placeholderTextColor='#c4cfce'
                        value={passwords.newPassword}
                        selectionColor={'#919191'}
                        keyboardType='ascii-capable'
                        secureTextEntry={true}
                        onSubmitEditing={() => ref_input2.current.focus()}
                        onChangeText={text => updatePasswords('newPassword', text)}
                        returnKeyType='next'
                        ref={ref_input1}
                        blurOnSubmit={false}
                    />
                </View>
                <View style={{ marginTop: 20 }}>
                    <View width={'100%'} >
                        <Text style={styles.label}>Confirm password</Text>
                    </View>
                    <TextInput style={styles.inputText}
                        placeholderTextColor='#c4cfce'
                        value={passwords.confirmPassword}
                        selectionColor={'#919191'}
                        keyboardType='ascii-capable'
                        secureTextEntry={true}
                        onChangeText={text => updatePasswords('confirmPassword', text)}
                        ref={ref_input2}
                    />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
                    <TouchableOpacity
                        onPress={handleUpdatePassword}
                        style={{ ...styles.price, width: 140, alignItems: 'center', backgroundColor: '#393E46', borderColor: '#393E46' }}>
                        <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Update password</Text>
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
        width: 250,
        height: 200
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

export default UpdatePasswordScreen