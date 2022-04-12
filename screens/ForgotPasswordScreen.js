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
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import illustration from '../assets/undraw_Forgot_password_re_hxwm.png'

let schema = yup.object().shape({
    email: yup.string().email().required()
})

const ForgotPasswordScreen = ({ navigation }) => {
    const [data, setData] = React.useState({
        email: '',
        error: ''
    })

    const auth = getAuth()

    const handleSignIn = () => {
        schema.validate({
            email: data.email
        })
            .then(() => {
                signInWithEmailAndPassword(auth, data.email, data.password)
                    .catch(err => {
                        setData({ error: err.message, email: '' })
                    })
            })
            .catch(err => {
                setData({
                    ...data,
                    error: err.errors,
                    email: ''
                })
            })
    }

    return (
        <View style={styles.container}>
            <Image source={illustration} style={styles.illustration} />

            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Forgot Passwword</Text>

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

            {data.error !== '' &&
                <Text style={styles.error}>{data.error}</Text>
            }

            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                <Text style={styles.buttonTxt}>Reset password</Text>
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

export default ForgotPasswordScreen

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