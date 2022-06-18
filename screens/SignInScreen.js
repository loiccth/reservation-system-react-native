import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Platform,
    StatusBar,
    Image
} from 'react-native'
import { StatusBar as ExpoStatusBar } from 'expo-status-bar'
import * as yup from 'yup'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import illustration from '../assets/undraw_Authentication_re_svpt.png'
import { getFirestore, doc, updateDoc } from 'firebase/firestore'

let schema = yup.object().shape({
    password: yup.string().required('Password field is required.'),
    email: yup.string().email('Invalid email format.').required('Email field is required.')
})

const SignInScreen = ({ navigation }) => {
    const [data, setData] = React.useState({
        email: '',
        password: '',
        error: ''
    })
    const db = getFirestore()
    const auth = getAuth()

    const handleSignIn = () => {
        schema.validate({
            email: data.email,
            password: data.password
        })
            .then(() => {
                signInWithEmailAndPassword(auth, data.email, data.password)
                    .then(() => {
                        updateDoc(doc(db, 'users', auth.currentUser.uid), {
                            lastlogin: new Date().toISOString(),
                            mfa: true
                        })
                    })
                    .catch(err => {
                        setData({ ...data, error: err.message, password: '' })
                    })
            })
            .catch(err => {
                setData({
                    ...data,
                    error: err.errors,
                    password: ''
                })
            })
    }

    return (
        <>
            <ExpoStatusBar style='auto' />
            <View style={styles.container}>
                <Image source={illustration} style={styles.illustration} />

                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Login</Text>

                <View width={300}>
                    <Text style={styles.label}>Email</Text>
                </View>
                <TextInput style={styles.inputText}
                    placeholderTextColor='#c4cfce'
                    placeholder='Email'
                    value={data.email}
                    keyboardType='email-address'
                    autoCapitalize='none'
                    onChangeText={text => setData({ ...data, email: text })}
                />
                <View width={300}>
                    <Text style={styles.label}>Password</Text>
                </View>
                <TextInput style={styles.inputText}
                    placeholderTextColor='#c4cfce'
                    placeholder='Password'
                    value={data.password}
                    secureTextEntry={true}
                    onChangeText={text => setData({ ...data, password: text })}
                />

                {data.error !== '' &&
                    <Text style={styles.error}>{data.error}</Text>
                }

                <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                    <Text style={styles.buttonTxt}>Login</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}>
                    <Text style={{ marginRight: 5 }}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Sign Up')}>
                        <Text style={styles.buttons}>Register here</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.buttons}>
                        Forgot password
                    </Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default SignInScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
    },
    illustration: {
        width: 200,
        height: 200,
    },
    label: {
        alignSelf: 'flex-start',
        color: '#333',
        fontWeight: 'bold'
    },
    inputText: {
        margin: 10,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#aeb0af',
        padding: 10,
        width: 300,
        color: '#333'
    },
    error: {
        color: '#ff0000',
        margin: 5
    },
    button: {
        backgroundColor: '#6C63FF',
        padding: 15,
        width: 300,
        alignItems: 'center',
        borderRadius: 10,
        margin: 10
    },
    buttonTxt: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#fff'
    },
    buttons: {
        fontWeight: 'bold',
        color: '#333'
    }
})