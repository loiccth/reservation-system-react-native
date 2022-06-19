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
    ToastAndroid,
    ScrollView
} from 'react-native'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
import * as yup from 'yup'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import * as ImagePicker from 'expo-image-picker'
import illustration from '../assets/undraw_Certification_re_ifll.png'
import { UserContext } from '../contexts/UserContext'

let schema = yup.object().shape({
    uri: yup.string().required('Image is required.'),
    password: yup.string().min(8, 'Password must be at least 8 characters.').required('Password field is required.'),
    phone: yup.string().length(8, 'Invalid phone number.').required('Phone number field is required.'),
    email: yup.string().email('Invalid email format.').required('Email field is required.'),
    lastname: yup.string().required('Lastname field is required.'),
    firstname: yup.string().required('Firstname field is required.')
})

const SignUpScreen = ({ navigation }) => {
    const [data, setData] = React.useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        password: '',
        uri: ''
    })
    const { setUser } = React.useContext(UserContext)
    const auth = getAuth()
    const db = getFirestore()
    const storage = getStorage()
    const ref_input1 = React.useRef()
    const ref_input2 = React.useRef()
    const ref_input3 = React.useRef()
    const ref_input4 = React.useRef()
    const [process, setProcess] = React.useState(false)

    const handleSignUp = () => {
        setProcess(true)

        schema.validate({
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            phone: data.phone,
            password: data.password,
            uri: data.uri
        })
            .then(() => {
                createUserWithEmailAndPassword(auth, data.email, data.password)
                    .then(async (cred) => {
                        const link = await uploadImageAsync(data.uri, uuidv4())

                        setDoc(doc(db, 'users', cred.user.uid), {
                            email: cred.user.email,
                            firstname: data.firstname,
                            lastname: data.lastname,
                            phone: data.phone,
                            role: 'user',
                            lastlogin: new Date().toISOString(),
                            mfa: true,
                            vaccinationCard: link,
                            vaccineValidated: 'Pending'
                        })
                            .then(() => {
                                console.log('here')
                                setUser({
                                    uid: cred.user.uid,
                                    email: cred.user.email,
                                    firstname: data.firstname,
                                    lastname: data.lastname,
                                    phone: data.phone,
                                    role: 'user',
                                    lastlogin: new Date().toISOString(),
                                    mfa: true,
                                    vaccinationCard: link,
                                    vaccineValidated: 'Pending'
                                })
                            })
                            .finally(() => setProcess(false))
                    })
                    .catch(err => {
                        console.log(err)
                        setData({ ...data, password: '' })
                        if (err.message === 'Firebase: Error (auth/email-already-in-use).') {
                            ToastAndroid.show('Email already in use.', ToastAndroid.SHORT)
                        }
                        else {
                            ToastAndroid.show(err.message, ToastAndroid.SHORT)
                        }
                    })
                    .finally(() => setProcess(false))
            })
            .catch(err => {
                ToastAndroid.show(err.message, ToastAndroid.SHORT)
            })
            .finally(() => setProcess(false))
    }

    async function uploadImageAsync(uri, title) {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.onload = function () {
                resolve(xhr.response)
            }
            xhr.onerror = function (e) {
                reject(new TypeError('Network request failed'))
            }
            xhr.responseType = 'blob'
            xhr.open('GET', uri, true)
            xhr.send(null)
        })

        const fileRef = ref(storage, title)
        const result = await uploadBytesResumable(fileRef, blob)

        blob.close()

        return await getDownloadURL(fileRef)
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        })

        if (!result.cancelled) {
            setData({ ...data, uri: result.uri })
        }
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Register Account</Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
                <Image source={illustration} style={styles.illustration} />
            </View>

            <View style={{ ...styles.bodyContainer, alignItems: 'center' }}>
                <View style={{ width: 300 }}>
                    <View width={'100%'} >
                        <Text style={styles.label}>Firstname *</Text>
                    </View>
                    <TextInput style={styles.inputText}
                        placeholderTextColor='#c4cfce'
                        placeholder='Firstname'
                        value={data.firstname}
                        keyboardType='ascii-capable'
                        onChangeText={text => setData({ ...data, firstname: text })}
                        selectionColor={'#919191'}
                        returnKeyType='next'
                        blurOnSubmit={false}
                        onSubmitEditing={() => ref_input1.current.focus()}
                    />
                </View>
                <View style={{ marginTop: 20, width: 300 }}>
                    <View width={'100%'} >
                        <Text style={styles.label}>Lastname *</Text>
                    </View>
                    <TextInput style={styles.inputText}
                        placeholderTextColor='#c4cfce'
                        placeholder='Lastname'
                        value={data.lastname}
                        keyboardType='ascii-capable'
                        onChangeText={text => setData({ ...data, lastname: text })}
                        selectionColor={'#919191'}
                        returnKeyType='next'
                        blurOnSubmit={false}
                        ref={ref_input1}
                        onSubmitEditing={() => ref_input2.current.focus()}
                    />
                </View>
                <View style={{ marginTop: 20, width: 300 }}>
                    <View width={'100%'} >
                        <Text style={styles.label}>Email *</Text>
                    </View>
                    <TextInput style={styles.inputText}
                        placeholderTextColor='#c4cfce'
                        placeholder='Email'
                        value={data.email}
                        keyboardType='email-address'
                        onChangeText={text => setData({ ...data, email: text })}
                        selectionColor={'#919191'}
                        returnKeyType='next'
                        blurOnSubmit={false}
                        autoCapitalize='none'
                        ref={ref_input2}
                        onSubmitEditing={() => ref_input3.current.focus()}
                    />
                </View>
                <View style={{ marginTop: 20, width: 300 }}>
                    <View width={'100%'} >
                        <Text style={styles.label}>Phone *</Text>
                    </View>
                    <TextInput style={styles.inputText}
                        placeholderTextColor='#c4cfce'
                        placeholder='Phone'
                        value={data.phone}
                        keyboardType='numeric'
                        onChangeText={text => setData({ ...data, phone: text })}
                        selectionColor={'#919191'}
                        maxLength={8}
                        returnKeyType='next'
                        blurOnSubmit={false}
                        ref={ref_input3}
                        onSubmitEditing={() => ref_input4.current.focus()}
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
                        keyboardType='ascii-capable'
                        onChangeText={text => setData({ ...data, password: text })}
                        selectionColor={'#919191'}
                        ref={ref_input4}
                    />
                </View>
                <View style={{ marginTop: 20, width: 300 }}>
                    <View width={'100%'} >
                        <Text style={styles.label}>Vaccination card *</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.vaccinationBtn} onPress={pickImage}>
                            <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Select image</Text>
                        </TouchableOpacity>
                    </View>
                    {data.uri !== '' &&
                        <Image resizeMode='contain' source={{ uri: data.uri }} style={{ height: 250, marginTop: 10 }} />}
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 5 }}>
                <Text style={{ marginRight: 5 }}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Sign In')}>
                    <Text style={styles.buttons}>Login here</Text>
                </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 20 }}>
                <TouchableOpacity
                    disabled={process}
                    onPress={handleSignUp}
                    style={{
                        ...styles.action,
                        width: 140,
                        alignItems: 'center',
                        backgroundColor: process ? '#393E46' : '#00ADB5',
                        borderColor: process ? '#393E46' : '#00ADB5',
                    }}>
                    <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Create account</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default SignUpScreen

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
    },
    vaccinationBtn: {
        margin: 3,
        padding: 8,
        paddingRight: 12,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#393E46',
        backgroundColor: '#393E46',
        color: '#393E46',
        borderRadius: 50
    }
})