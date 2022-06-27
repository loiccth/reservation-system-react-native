import React from 'react'
import { StyleSheet, View, TouchableOpacity, Text, TextInput, ToastAndroid, Image, Platform, StatusBar, ScrollView, Switch } from 'react-native'
import * as yup from 'yup'
import * as ImagePicker from 'expo-image-picker'
import { getFirestore, doc, getDoc, collection, updateDoc } from 'firebase/firestore'
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import MapView, { Marker } from 'react-native-maps'
import { Picker } from '@react-native-picker/picker'

let schema = yup.object().shape({
    kid3: yup.string().required('Kid 3 is required.'),
    adult3: yup.string().required('Adult 3 is required.'),
    des3: yup.string().required('Description 3 is required.'),
    name3: yup.string().required('Name 3 is required.'),
    kid2: yup.string().required('Kid 2 is required.'),
    adult2: yup.string().required('Adult 2 is required.'),
    des2: yup.string().required('Description 2 is required.'),
    name2: yup.string().required('Name 2 is required.'),
    kid1: yup.string().required('Kid 1 is required.'),
    adult1: yup.string().required('Adult 1 is required.'),
    des1: yup.string().required('Description 1 is required.'),
    name1: yup.string().required('Name 1 is required.'),
    capacity: yup.string().required('capacity is required.'),
    depth: yup.string().required('Depth is required.'),
    tags: yup.string().required('Tags is required.'),
    activities: yup.string().required('Activities is required.'),
    facilities: yup.string().required('Facilities is required.'),
    description: yup.string().required('Description field is required.'),
    category: yup.string().required('Category field is required.'),
    location: yup.string().required('Location field is required.'),
    name: yup.string().required('Name field is required.')
})

const UpdatePoolDetails = ({ route, navigation }) => {
    const { complex } = route.params
    const db = getFirestore()
    const storage = getStorage()
    const [categories, setCategories] = React.useState([])
    const [press, setPress] = React.useState(false)
    const [vaccine, setVaccine] = React.useState(true)
    const mapRef = React.useRef(null)
    const [changedImg, setChangedImg] = React.useState(false)
    const [data, setData] = React.useState({
        name: '',
        location: '',
        category: '',
        description: '',
        depth: '',
        capacity: '',
        activities: '',
        facilities: '',
        tags: '',
        uri: '',
        coordinate: {
            latitude: '',
            longitude: ''
        }
    })
    const [packages, setPackages] = React.useState([
        {
            description: '',
            kidPrice: '',
            name: '',
            price: ''
        },
        {
            description: '',
            kidPrice: '',
            name: '',
            price: ''
        },
        {
            description: '',
            kidPrice: '',
            name: '',
            price: ''
        }
    ])

    React.useEffect(() => {
        setData({
            name: complex.name,
            location: '',
            category: complex.category,
            description: complex.description,
            depth: complex.depth,
            capacity: complex.capacity,
            activities: complex.activities.join(', '),
            facilities: complex.facilities.join(', '),
            tags: complex.tags.join(', '),
            uri: '',
            coordinate: complex.coordinate
        })
        setPackages(complex.packages)
        setVaccine(complex.vaccinationRequired)

    }, [])

    React.useEffect(() => {
        getDoc(doc(db, 'settings', 'filters'))
            .then(res => {
                if (res.exists()) {
                    setCategories(res.data().data)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    const handlePackage = (i, field, text) => {
        let temp = [...packages]

        if (field === 'name') {
            temp[i].name = text
        }
        else if (field === 'description') {
            temp[i].description = text
        }
        else if (field === 'price') {
            temp[i].price = text
        }
        else if (field === 'kidPrice') {
            temp[i].kidPrice = text
        }

        setPackages(temp)
    }

    const addComplex = () => {
        setPress(true)

        schema.validate({
            kid3: packages[2].kidPrice,
            adult3: packages[2].price,
            des3: packages[2].description,
            name3: packages[2].name,
            kid2: packages[1].kidPrice,
            adult2: packages[1].price,
            des2: packages[1].description,
            name2: packages[1].name,
            kid1: packages[0].kidPrice,
            adult1: packages[0].price,
            des1: packages[0].description,
            name1: packages[0].name,
            capacity: data.capacity,
            depth: data.depth,
            tags: data.tags,
            activities: data.activities,
            facilities: data.facilities,
            description: data.description,
            category: data.category,
            location: data.location,
            name: data.name
        })
            .then(async () => {
                let link = ''

                if (changedImg) {
                    link = await uploadImageAsync(data.uri, uuidv4())
                }

                updateDoc(doc(db, 'complexes', complex.objectID), {
                    name: data.name,
                    location: data.location,
                    category: data.category,
                    description: data.description,
                    images: changedImg ? [link] : [complex.images[0]],
                    coordinate: data.coordinate,
                    capacity: data.capacity,
                    depth: data.depth,
                    tags: data.tags.split(', '),
                    activities: data.activities.split(', '),
                    facilities: data.facilities.split(', '),
                    vaccinationRequired: vaccine,
                    packages
                }).then((docRef) => {
                    console.log(docRef)
                    ToastAndroid.show('Pool successfully updated.', ToastAndroid.SHORT)
                    navigation.navigate('UpdatePool')
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
            aspect: [4, 3],
            quality: 1,
        })

        if (!result.cancelled) {
            setChangedImg(true)
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
            <View style={styles.header}>
                <Text style={styles.headerText}>Updating existing pool</Text>
            </View>

            <View style={styles.reservationInfo}>
                <View>
                    <View width={'100%'} >
                        <Text style={styles.label}>Name</Text>
                    </View>
                    <TextInput style={styles.inputText}
                        placeholderTextColor='#c4cfce'
                        selectionColor={'#919191'}
                        value={data.name}
                        keyboardType='ascii-capable'
                        onChangeText={text => setData({ ...data, name: text })}
                    />
                </View>
                <View style={{ marginTop: 20 }}>
                    <View width={'100%'} >
                        <Text style={styles.label}>Location</Text>
                    </View>
                    <GooglePlacesAutocomplete
                        placeholder='Location'
                        fetchDetails={true}
                        onPress={(data2, details = null) => {
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
                                ...styles.inputText,
                                height: 35
                            },
                            listView: {
                                top: 0
                            }
                        }}
                    />
                    <View style={{ alignItems: 'center' }}>
                        <MapView
                            ref={mapRef}
                            style={{ height: 300, width: '100%' }}
                            initialRegion={{
                                latitude: parseFloat(data.coordinate.latitude),
                                longitude: parseFloat(data.coordinate.longitude),
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
                    </View>
                </View>
                <View style={{ marginTop: 20 }}>
                    <View width={'100%'} >
                        <Text style={styles.label}>Category</Text>
                    </View>
                    <View style={{ ...styles.inputText, padding: 0, justifyContent: 'center' }}>
                        <Picker
                            style={{ ...styles.inputText, padding: 0, margin: 0, height: 35 }}
                            selectedValue={data.category}
                            onValueChange={(itemValue, itemIndex) =>
                                setData({ ...data, category: itemValue })
                            }>
                            {categories.map(category =>
                                <Picker.Item key={category} label={category} value={category} />
                            )}
                            {/* <Picker.Item label='Kids' value='Kids' />
                            <Picker.Item label='Teenager' value='Teenager' />
                            <Picker.Item label='Adult' value='Adult' /> */}
                        </Picker>
                    </View>
                </View>
                <View style={{ marginTop: 20 }}>
                    <View width={'100%'} >
                        <Text style={styles.label}>Description</Text>
                    </View>
                    <TextInput style={styles.inputText}
                        placeholderTextColor='#c4cfce'
                        selectionColor={'#919191'}
                        keyboardType='ascii-capable'
                        value={data.description}
                        multiline={true}
                        numberOfLines={4}
                        onChangeText={text => setData({ ...data, description: text })}
                    />
                </View>
                <View style={{ marginTop: 20 }}>
                    <View width={'100%'} >
                        <Text style={styles.label}>Facilities</Text>
                    </View>
                    <TextInput style={styles.inputText}
                        placeholderTextColor='#c4cfce'
                        selectionColor={'#919191'}
                        value={data.facilities}
                        keyboardType='ascii-capable'
                        onChangeText={text => setData({ ...data, facilities: text })}
                    />
                    <View><Text style={{ fontSize: 12 }}>Seperate by comma (,)</Text></View>
                </View>
                <View style={{ marginTop: 20 }}>
                    <View width={'100%'} >
                        <Text style={styles.label}>Activities</Text>
                    </View>
                    <TextInput style={styles.inputText}
                        placeholderTextColor='#c4cfce'
                        selectionColor={'#919191'}
                        value={data.activities}
                        keyboardType='ascii-capable'
                        onChangeText={text => setData({ ...data, activities: text })}
                    />
                    <View><Text style={{ fontSize: 12 }}>Seperate by comma (,)</Text></View>
                </View>
                <View style={{ marginTop: 20 }}>
                    <View width={'100%'} >
                        <Text style={styles.label}>Tags</Text>
                    </View>
                    <TextInput style={styles.inputText}
                        placeholderTextColor='#c4cfce'
                        selectionColor={'#919191'}
                        value={data.tags}
                        keyboardType='ascii-capable'
                        onChangeText={text => setData({ ...data, tags: text })}
                    />
                    <View><Text style={{ fontSize: 12 }}>Seperate by comma (,)</Text></View>
                </View>
                <View style={{ marginTop: 20, flexDirection: 'row' }}>
                    <View style={{ flex: 1, marginRight: 5 }}>
                        <View width={'100%'} >
                            <Text style={styles.label}>Depth</Text>
                        </View>
                        <TextInput style={styles.inputText}
                            placeholderTextColor='#c4cfce'
                            selectionColor={'#919191'}
                            value={data.depth}
                            keyboardType='numeric'
                            onChangeText={text => setData({ ...data, depth: text })}
                        />
                    </View>
                    <View style={{ flex: 1, marginLeft: 5 }}>
                        <View width={'100%'} >
                            <Text style={styles.label}>Capacity</Text>
                        </View>
                        <TextInput style={styles.inputText}
                            placeholderTextColor='#c4cfce'
                            selectionColor={'#919191'}
                            value={data.capacity}
                            keyboardType='numeric'
                            onChangeText={text => setData({ ...data, capacity: text })}
                        />
                    </View>
                    <View style={{ flex: 1, marginLeft: 10, alignItems: 'center' }}>
                        <View width={'100%'} >
                            <Text style={styles.label}>Vaccine</Text>
                        </View>
                        <Switch
                            trackColor={{ false: '#393E46', true: '#00ADB5' }}
                            thumbColor={'#f4f3f4'}
                            onValueChange={(e) => setVaccine(e)}
                            value={vaccine}
                        />
                    </View>
                </View>


                <View style={{ marginTop: 20 }}>
                    <View width={'100%'} >
                        <Text style={styles.label}>Packages</Text>
                    </View>
                    <View style={{ marginLeft: 20 }}>
                        {packages.map((pkg, i) =>
                            <View key={i} style={{ marginBottom: 30 }}>
                                <View>
                                    <View width={'100%'} >
                                        <Text style={styles.label}>Name for package {i + 1}</Text>
                                    </View>
                                    <TextInput style={styles.inputText}
                                        placeholderTextColor='#c4cfce'
                                        selectionColor={'#919191'}
                                        value={pkg.name}
                                        keyboardType='ascii-capable'
                                        onChangeText={text => handlePackage(i, 'name', text)}
                                    />
                                </View>
                                <View style={{ marginTop: 5 }}>
                                    <View width={'100%'} >
                                        <Text style={styles.label}>Description for package {i + 1}</Text>
                                    </View>
                                    <TextInput style={styles.inputText}
                                        placeholderTextColor='#c4cfce'
                                        selectionColor={'#919191'}
                                        value={pkg.description}
                                        keyboardType='ascii-capable'
                                        onChangeText={text => handlePackage(i, 'description', text)}
                                    />
                                </View>
                                <View style={{ marginTop: 5, flexDirection: 'row' }}>
                                    <View style={{ flex: 1, marginRight: 2.5 }}>
                                        <View width={'100%'} >
                                            <Text style={styles.label}>Adult price for package {i + 1}</Text>
                                        </View>
                                        <TextInput style={styles.inputText}
                                            placeholderTextColor='#c4cfce'
                                            selectionColor={'#919191'}
                                            value={pkg.price}
                                            keyboardType='numeric'
                                            onChangeText={text => handlePackage(i, 'price', text)}
                                        />
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 2.5 }}>
                                        <View width={'100%'} >
                                            <Text style={styles.label}>Kid price for package {i + 1}</Text>
                                        </View>
                                        <TextInput style={styles.inputText}
                                            placeholderTextColor='#c4cfce'
                                            selectionColor={'#919191'}
                                            value={pkg.kidPrice}
                                            keyboardType='numeric'
                                            onChangeText={text => handlePackage(i, 'kidPrice', text)}
                                        />
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
                    <TouchableOpacity
                        onPress={pickImage}
                        style={{ ...styles.btn, width: 160, alignItems: 'center', backgroundColor: '#393E46', borderColor: '#393E46' }}>
                        <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Select image</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ alignItems: 'center' }}>
                    <Image resizeMode='contain' source={{ uri: changedImg ? data.uri : complex.images[0] }} style={{ height: 250, width: '100%', marginTop: 10 }} />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
                    <TouchableOpacity
                        onPress={addComplex}
                        disabled={press}
                        style={{
                            ...styles.btn,
                            width: 160,
                            alignItems: 'center',
                            backgroundColor: press ? '#393E46' : '#00ADB5',
                            borderColor: press ? '#393E46' : '#00ADB5'
                        }}>
                        <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Update</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 0,
        flex: 1,
        backgroundColor: '#fff',
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
    btn: {
        fontSize: 18,
        margin: 3,
        padding: 8,
        paddingRight: 12,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#393E46',
        color: '#393E46',
        borderRadius: 50
    }
})

export default UpdatePoolDetails