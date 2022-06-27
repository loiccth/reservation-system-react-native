import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, TextInput, Image, ScrollView, ToastAndroid } from 'react-native'
import { getFirestore, collection, addDoc, query, where, doc, updateDoc } from 'firebase/firestore'
import illustration from '../assets/undraw_Profile_re_4a55.png'
import * as yup from 'yup'
import { v4 as uuidv4 } from 'uuid'
import { UserContext } from '../contexts/UserContext'

let schema = yup.object().shape({
    phone: yup.string().length(8, 'Invalid phone number.').required('Phone number field is required.'),
    lastname: yup.string().required('Lastname field is required.'),
    firstname: yup.string().required('Firstname field is required.')
})

const AccountScreen = ({ navigation }) => {
    const db = getFirestore()
    const [user, setUser] = React.useState(React.useContext(UserContext).user)
    const setContextUser = React.useContext(UserContext).setUser
    const [changedImg, setChangeImg] = React.useState(false)
    const [uri, setUri] = React.useState()
    const ref_input2 = React.useRef()
    const ref_input1 = React.useRef()

    const updateUser = (e, data) => {
        if (e === 'firstname') {
            setUser({
                ...user,
                firstname: data
            })
        }
        else if (e === 'lastname') {
            setUser({
                ...user,
                lastname: data
            })
        }
        else if (e === 'phone') {
            setUser({
                ...user,
                phone: data
            })
        }
    }

    const updateProfile = () => {
        schema.validate({
            firstname: user.firstname,
            lastname: user.lastname,
            phone: user.phone
        })
            .then(async () => {
                let link = ''

                if (changedImg) {
                    link = await uploadImageAsync(uri, uuidv4())
                }

                updateDoc(doc(db, 'users', user.uid), {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    phone: user.phone,
                    vaccinationCard: changedImg ? link : user.vaccinationCard

                }).then(() => {
                    ToastAndroid.show('Profile successfully updated.', ToastAndroid.SHORT)

                    setContextUser(user)
                })
                    .catch(() => ToastAndroid.show('Error when updating profile.', ToastAndroid.SHORT))
            })
            .catch(err => {
                console.log(err)
                ToastAndroid.show(err.message + '', ToastAndroid.SHORT)
            })
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
            setChangeImg(true)
            setUri(result.uri)
        }
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Account Settings</Text>
            </View>

            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image source={illustration} style={styles.illustration} />
            </View>

            <View style={styles.reservationInfo}>
                <View>
                    <View width={'100%'} >
                        <Text style={styles.label}>Email</Text>
                    </View>
                    <TextInput style={{ ...styles.inputText, backgroundColor: '#d4d4d4' }}
                        placeholderTextColor='#c4cfce'
                        value={user.email}
                        selectionColor={'#919191'}
                        editable={false}
                    />
                </View>
                <View style={{ marginTop: 20 }}>
                    <View width={'100%'} >
                        <Text style={styles.label}>Firstname</Text>
                    </View>
                    <TextInput style={styles.inputText}
                        placeholderTextColor='#c4cfce'
                        value={user.firstname}
                        selectionColor={'#919191'}
                        keyboardType='ascii-capable'
                        onSubmitEditing={() => ref_input1.current.focus()}
                        onChangeText={text => updateUser('firstname', text)}
                        returnKeyType='next'
                        blurOnSubmit={false}
                    />
                </View>
                <View style={{ marginTop: 20 }}>
                    <View width={'100%'} >
                        <Text style={styles.label}>Lastname</Text>
                    </View>
                    <TextInput style={styles.inputText}
                        placeholderTextColor='#c4cfce'
                        value={user.lastname}
                        selectionColor={'#919191'}
                        keyboardType='ascii-capable'
                        onSubmitEditing={() => ref_input2.current.focus()}
                        onChangeText={text => updateUser('lastname', text)}
                        returnKeyType='next'
                        ref={ref_input1}
                        blurOnSubmit={false}
                    />
                </View>
                <View style={{ marginTop: 20 }}>
                    <View width={'100%'} >
                        <Text style={styles.label}>Phone number</Text>
                    </View>
                    <TextInput style={styles.inputText}
                        placeholderTextColor='#c4cfce'
                        value={user.phone}
                        selectionColor={'#919191'}
                        keyboardType='numeric'
                        maxLength={8}
                        onChangeText={text => updateUser('phone', text)}
                        ref={ref_input2}
                    />
                </View>

                <View style={{ marginTop: 20 }}>
                    <View width={'100%'} >
                        <Text style={styles.label}>Vaccination status</Text>
                    </View>
                    <TextInput style={{ ...styles.inputText, backgroundColor: '#d4d4d4', textTransform: 'capitalize' }}
                        placeholderTextColor='#c4cfce'
                        value={user.vaccineValidated}
                        selectionColor={'#919191'}
                        editable={false}
                    />
                </View>

                <View style={{ marginTop: 20 }}>
                    <View width={'100%'} >
                        <Text style={styles.label}>Vaccination card</Text>
                    </View>
                    <Image resizeMode='contain' source={{ uri: changedImg ? uri : user.vaccinationCard }} style={{ height: 250, marginTop: 10 }} />
                </View>

                {user.vaccineValidated !== 'approved' &&
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={pickImage}
                            style={{ ...styles.price, width: 140, alignItems: 'center', backgroundColor: '#393E46', borderColor: '#393E46' }}>
                            <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Browse image</Text>
                        </TouchableOpacity>
                    </View>
                }

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
                    <TouchableOpacity
                        onPress={updateProfile}
                        style={{ ...styles.price, width: 140, alignItems: 'center', backgroundColor: '#393E46', borderColor: '#393E46' }}>
                        <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Update account</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('UpdatePassword')}
                        style={{ ...styles.price, width: 160, alignItems: 'center', backgroundColor: '#00ADB5', borderColor: '#00ADB5' }}>
                        <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Change password</Text>
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
        width: 270,
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

export default AccountScreen