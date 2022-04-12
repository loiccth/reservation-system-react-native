import React from 'react'
import { StyleSheet, View, TouchableOpacity, Text, TextInput, ToastAndroid, Image, Platform, StatusBar, ScrollView } from 'react-native'
import * as yup from 'yup'
import * as ImagePicker from 'expo-image-picker'
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore'
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
// import * as FileSystem from 'expo-file-system'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import MapView, { Marker } from 'react-native-maps'
import { Picker } from '@react-native-picker/picker'

let schema = yup.object().shape({
    uri: yup.string().required('Image is required.'),
    description: yup.string().required('Description field is required.'),
    category: yup.string().required('Category field is required.'),
    location: yup.string().required('Location field is required.'),
    name: yup.string().required('Name field is required.')
})

const AddScreen = ({ navigation }) => {
    const db = getFirestore()
    const storage = getStorage()
    const [press, setPress] = React.useState(false)
    const [data, setData] = React.useState({
        name: '',
        location: '',
        category: 'Kids',
        description: '',
        uri: '',
        coordinate: {
            latitude: '',
            longitude: ''
        }
    })

    const mapRef = React.useRef(null)

    const addComplex = () => {
        setPress(true)

        schema.validate({
            name: data.name,
            location: data.location,
            category: data.category,
            description: data.description,
            uri: data.uri
        })
            .then(async () => {
                const link = await uploadImageAsync(data.uri, uuidv4())

                addDoc(collection(db, 'complexes'), {
                    name: data.name,
                    location: data.location,
                    category: data.category,
                    description: data.description,
                    images: [link],
                    coordinate: data.coordinate
                }).then((docRef) => {
                    // console.log(docRef.id)
                    ToastAndroid.show('Complex successfully added.', ToastAndroid.SHORT)
                    setData({
                        name: '',
                        location: '',
                        category: 'Kids',
                        description: '',
                        uri: '',
                        coordinate: {
                            latitude: '',
                            longitude: ''
                        }
                    })
                    navigation.navigate('Setting')
                }).catch(err => {
                    ToastAndroid.show(err.message + '', ToastAndroid.SHORT)
                }).finally(() => setPress(false))
            })
            .catch(err => {
                console.log(err)
                ToastAndroid.show(err.errors + '', ToastAndroid.SHORT)
                setPress(false)
            })
    }

    async function uploadImageAsync(uri, title) {
        // Why are we using XMLHttpRequest? See:
        // https://github.com/expo/expo/issues/2402#issuecomment-443726662
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

        // We're done with the blob, close and release it
        blob.close()

        return await getDownloadURL(fileRef)
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })

        if (!result.cancelled) {
            setData({ ...data, uri: result.uri })
        }
    }

    const openCamera = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync()

        if (permissionResult.granted === false) {
            alert("You've refused to allow this appp to access your camera!")
            return
        }

        const result = await ImagePicker.launchCameraAsync()

        if (!result.cancelled) {
            // console.log(result.uri)
            setData({ ...data, uri: result.uri })
        }
    }

    const animateMap = (lat, long) => {
        mapRef.current.animateToRegion({
            latitude: lat,
            longitude: long,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1
        })
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ justifyContent: 'center' }} keyboardShouldPersistTaps='handled'>
            <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Add a new complex</Text>
                <View width={'94%'}>
                    <Text style={styles.label}>Name</Text>
                </View>
                <TextInput style={styles.inputText}
                    placeholderTextColor='#c4cfce'
                    placeholder='Name'
                    value={data.name}
                    onChangeText={text => setData({ ...data, name: text })}
                />
                <View width={'94%'}>
                    <Text style={styles.label}>Location</Text>
                </View>
            </View>
            <GooglePlacesAutocomplete
                placeholder='Location'
                fetchDetails={true}
                onPress={(data2, details = null) => {
                    // console.log(details)
                    // console.log('------------------------------')
                    // console.log(data2)
                    setData({
                        ...data, location: data2.description,
                        coordinate: {
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng
                        }
                    })
                    animateMap(details.geometry.location.lat, details.geometry.location.lng)
                }}
                GooglePlacesDetailsQuery={{ fields: 'geometry' }}
                query={{
                    key: 'AIzaSyDWWaegGGsWXVEvUEHt2Z8RzQjwRJrMgnk',
                    language: 'en',
                    components: 'country:mu'
                }}
                styles={{
                    textInput: {
                        ...styles.inputText
                    },
                    listView: {
                        top: 0
                    }
                }}
            />
            <View style={{ alignItems: 'center' }}>
                <MapView
                    ref={mapRef}
                    style={{ height: 300, width: '94%' }}
                    initialRegion={{
                        latitude: -20.1710715,
                        longitude: 57.5067096,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1,
                    }}
                    onPress={(e) => setData({ ...data, coordinate: e.nativeEvent.coordinate })}
                >
                    {data.coordinate.latitude !== '' &&
                        <Marker
                            coordinate={data.coordinate}
                        />
                    }
                </MapView>
                <View width={'94%'} style={{ marginTop: 15 }}>
                    <Text style={styles.label}>Category</Text>
                </View>
                <View style={{ ...styles.inputText, padding: 0 }}>
                    <Picker
                        style={{ ...styles.inputText, padding: 0, margin: 0 }}
                        selectedValue={data.category}
                        onValueChange={(itemValue, itemIndex) =>
                            setData({ ...data, category: itemValue })
                        }>
                        <Picker.Item label='Kids' value='Kids' />
                        <Picker.Item label='Teenager' value='Teenager' />
                        <Picker.Item label='Adult' value='Adult' />
                    </Picker>
                </View>
                {/* <TextInput style={styles.inputText}
                    placeholderTextColor='#c4cfce'
                    placeholder='Category'
                    value={data.category}
                    onChangeText={text => setData({ ...data, category: text })}
                /> */}
                <View width={'94%'}>
                    <Text style={styles.label}>Description</Text>
                </View>
                <TextInput style={styles.inputText}
                    placeholderTextColor='#c4cfce'
                    placeholder='Description'
                    value={data.description}
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={text => setData({ ...data, description: text })}
                />

                {data.uri === '' &&
                    <View style={styles.imageAction}>
                        <TouchableOpacity style={styles.button} onPress={pickImage}>
                            <Text style={styles.buttonText}>Add Image</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={openCamera}>
                            <Text style={styles.buttonText}>Camera</Text>
                        </TouchableOpacity>
                    </View>
                }

                {data.uri !== '' &&
                    <TouchableOpacity style={{ ...styles.button, backgroundColor: 'red' }} onPress={() => setData({ ...data, uri: '' })}>
                        <Text style={styles.buttonText}>Remove Image</Text>
                    </TouchableOpacity>
                }

                {data.uri !== '' && <Image source={{ uri: data.uri }} style={{ width: 100, height: 100 }} />}

                <TouchableOpacity style={{ ...styles.button, width: '94%', marginBottom: 30 }} onPress={addComplex} disabled={press}>
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
        backgroundColor: '#fff',
        marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
    },
    button: {
        width: '40%',
        alignItems: 'center',
        backgroundColor: '#6C63FF',
        padding: 10,
        borderRadius: 10,
        margin: 5
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#fff'
    },
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#333'
    },
    modalView: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 5,
        paddingTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
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
        width: '94%',
        color: '#333'
    },
    imageAction: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10
    }
})

export default AddScreen