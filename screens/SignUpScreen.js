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
import * as yup from 'yup'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import illustration from '../assets/undraw_Certification_re_ifll.png'

let schema = yup.object().shape({
    password: yup.string().min(8, 'Password must be at least 8 characters.').required('Password field is required.'),
    email: yup.string().email('Invalid email format.').required('Email field is required.'),
    lastname: yup.string().required('Lastname field is required.'),
    firstname: yup.string().required('Firstname field is required.')
})

const SignUpScreen = ({ navigation }) => {
    const [data, setData] = React.useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        error: ''
    })
    const auth = getAuth()
    const db = getFirestore()

    const handleSignUp = () => {
        schema.validate({
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            password: data.password
        })
            .then(() => {
                createUserWithEmailAndPassword(auth, data.email, data.password)
                    .then(cred => {
                        setDoc(doc(db, 'users', cred.user.uid), {
                            email: cred.user.email,
                            firstname: data.firstname,
                            lastname: data.lastname,
                            role: 'admin'
                        })
                    })
                    .catch(err => {
                        console.log(err)
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
        <View style={styles.container}>
            <Image source={illustration} style={styles.illustration} />

            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Register an account</Text>

            <View width={300}>
                <Text style={styles.label}>Firstname</Text>
            </View>
            <TextInput style={styles.inputText}
                placeholderTextColor='#c4cfce'
                placeholder='Firstname'
                value={data.firstname}
                onChangeText={text => setData({ ...data, firstname: text })}
            />
            <View width={300}>
                <Text style={styles.label}>Lastname</Text>
            </View>
            <TextInput style={styles.inputText}
                placeholderTextColor='#c4cfce'
                placeholder='Lastname'
                value={data.lastname}
                onChangeText={text => setData({ ...data, lastname: text })}
            />
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

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonTxt}>Create an account</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}>
                <Text style={{ marginRight: 5 }}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Sign In')}>
                    <Text style={styles.buttons}>Login here</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SignUpScreen

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