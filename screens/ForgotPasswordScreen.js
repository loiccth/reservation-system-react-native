import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Platform,
    StatusBar,
    ToastAndroid,
    Image
} from 'react-native'
import * as yup from 'yup'
import illustration from '../assets/undraw_Forgot_password_re_hxwm.png'
import axios from 'axios'

let schema = yup.object().shape({
    email: yup.string().email('Incorrect email format.').required('Email field is required.')
})

const ForgotPasswordScreen = ({ navigation }) => {
    const [data, setData] = React.useState({
        email: ''
    })
    const [process, setProcess] = React.useState(false)

    const handleReset = () => {
        setProcess(true)

        schema.validate({
            email: data.email
        })
            .then(() => {
                axios.post('http://192.168.100.50:8080/api/v1/user/reset', { email: data.email })
                    .then(() => {
                        setData({
                            email: '',
                            error: ''
                        })
                        navigation.navigate('Sign In')
                        ToastAndroid.show('Password reset successful.', ToastAndroid.SHORT)
                    })
                    .catch(err => {
                        console.log(err)
                        ToastAndroid.show('Email is not linked to any account.', ToastAndroid.SHORT)
                    })
                    .finally(() => setProcess(false))
            })
            .catch(err => {
                ToastAndroid.show(err.message, ToastAndroid.SHORT)
            })
            .finally(() => setProcess(false))
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Forgot Password</Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
                <Image source={illustration} style={styles.illustration} />
            </View>

            <View style={{ ...styles.bodyContainer, alignItems: 'center', marginTop: 80 }}>
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
                        onChangeText={text => setData({ email: text })}
                        selectionColor={'#919191'}
                    />
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}>
                <Text style={{ marginRight: 5 }}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Sign In')}>
                    <Text style={styles.buttons}>Login here</Text>
                </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                <TouchableOpacity
                    disabled={process}
                    onPress={handleReset}
                    style={{
                        ...styles.action,
                        width: 140,
                        alignItems: 'center',
                        backgroundColor: process ? '#393E46' : '#00ADB5',
                        borderColor: process ? '#393E46' : '#00ADB5',
                    }}>
                    <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Reset password</Text>
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