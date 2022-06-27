import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Platform,
    StatusBar,
    Image,
    ScrollView,
    ToastAndroid
} from 'react-native'
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
        password: ''
    })
    const db = getFirestore()
    const auth = getAuth()
    const ref_input1 = React.useRef()
    const [process, setProcess] = React.useState(false)

    const handleSignIn = () => {
        setProcess(true)

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
                        setData({
                            ...data,
                            password: ''
                        })
                        ToastAndroid.show('Incorrect email/password.', ToastAndroid.SHORT)
                    })
                    .finally(() => setProcess(false))
            })
            .catch(err => {
                setData({
                    ...data,
                    password: ''
                })
                ToastAndroid.show(err.message, ToastAndroid.SHORT)
            })
            .finally(() => setProcess(false))
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Login</Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image source={illustration} style={styles.illustration} />
            </View>

            <View style={{ ...styles.bodyContainer, alignItems: 'center' }}>
                <View style={{ width: 300 }}>
                    <View width={'100%'} >
                        <Text style={styles.label}>Email *</Text>
                    </View>
                    <TextInput style={styles.inputText}
                        placeholderTextColor='#c4cfce'
                        placeholder='Email'
                        value={data.email}
                        keyboardType='email-address'
                        autoCapitalize='none'
                        onChangeText={text => setData({ ...data, email: text })}
                        selectionColor={'#919191'}
                        returnKeyType='next'
                        blurOnSubmit={false}
                        onSubmitEditing={() => ref_input1.current.focus()}
                    />
                </View>
                <View style={{ marginTop: 20, width: 300 }}>
                    <View width={'100%'} >
                        <Text style={styles.label}>Password *</Text>
                    </View>
                    <TextInput style={styles.inputText}
                        placeholderTextColor='#c4cfce'
                        placeholder='Password'
                        value={data.password}
                        secureTextEntry={true}
                        selectionColor={'#919191'}
                        keyboardType='ascii-capable'
                        ref={ref_input1}
                        onChangeText={text => setData({ ...data, password: text })}
                    />
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}>
                <Text style={{ marginRight: 5 }}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Sign Up')}>
                    <Text style={styles.buttons}>Register here</Text>
                </TouchableOpacity>
            </View>
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.buttons}>
                        Forgot password
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                <TouchableOpacity
                    disabled={process}
                    onPress={handleSignIn}
                    style={{
                        ...styles.action,
                        width: 140,
                        alignItems: 'center',
                        backgroundColor: process ? '#393E46' : '#00ADB5',
                        borderColor: process ? '#393E46' : '#00ADB5',
                    }}>
                    <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Login</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default SignInScreen

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
        height: 270,
        backgroundColor: '#333'
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#EEEEEE',
        marginVertical: 10
    },
    bodyContainer: {
        padding: 10,
        marginTop: 30
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
    action: {
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
    buttons: {
        fontWeight: 'bold',
        color: '#333'
    }
})