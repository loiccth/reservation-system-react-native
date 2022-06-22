import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Image, ScrollView, Modal } from 'react-native'
import * as Notifications from 'expo-notifications'
import ComplexModalRoute from '../components/ComplexModalRoute'
import { Ionicons } from '@expo/vector-icons'
import { doc, onSnapshot, getFirestore, collection, query, limit, orderBy, getDocs } from 'firebase/firestore'
import axios from 'axios'
import { LineChart, YAxis, XAxis, Grid } from 'react-native-svg-charts'

const ComplexDetailsScreen = ({ route, navigation }) => {
    const [mapModal, setMapModal] = React.useState(false)
    const [weather, setWeather] = React.useState()
    const [showWeather, setShowWeather] = React.useState(false)
    const [livetemp, setLivetemp] = React.useState('--')
    const [chart, setChart] = React.useState([])
    const { complex } = route.params
    const db = getFirestore()
    const [modalVisible, setModalVisible] = React.useState(false)

    const closeMapModal = () => {
        setMapModal(false)
    }

    const unsub = onSnapshot(doc(db, 'settings', 'livetemp'), (doc) => {
        setLivetemp(doc.data().temp)
    })

    const openModal = () => {
        console.log('here')
        setModalVisible(true)
        getDocs(query(collection(db, 'temphistory'), limit(12), orderBy('createdAt', 'desc')))
            .then(querySnapshot => {
                const temp = []
                const temp2 = []
                querySnapshot.forEach((doc) => {
                    temp.push(doc.data().temp)
                })
                setChart(temp.reverse())
            })
            .catch(err => console.log(err))
    }

    // TODO: Fix notification
    const sendNotification = () => {
        Notifications.scheduleNotificationAsync({
            content: {
                title: 'Reservation successful',
                body: `Reservation for ${complex.name} completed.`
            },
            trigger: {
                seconds: 5
            }
        })
    }

    React.useEffect(() => {
        axios.get(`https://api.weatherapi.com/v1/current.json?key=c3b74dea0d4047c49d265111221306&q=${complex.location}&aqi=yes`)
            .then(res => {
                setWeather(res.data)
                setShowWeather(true)
            })
            .catch(err => console.log(err))
    }, [])

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ alignItems: 'center' }}>

                <View style={styles.text}>
                    <Text style={styles.name}>{complex.name}</Text>
                    <Text style={styles.address}>{complex.location}</Text>
                </View>

                <Image resizeMethod='resize' source={{ uri: complex.images[0] }} style={{ height: 250, width: '100%' }} />

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.navigate} onPress={() => navigation.navigate('Reservation', { complex })}>
                        <Text style={styles.buttonTxt}>Reserve Slot</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navigate} onPress={() => setMapModal(true)}>
                        <Ionicons name='navigate' size={20} style={{ color: '#00ADB5' }} />
                    </TouchableOpacity>
                </View>
                <ComplexModalRoute coordinate={complex.coordinate} modal={mapModal} closeModal={closeMapModal} name={complex.name} />

                <View style={styles.text}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Tags: </Text>
                        {complex.tags.map(tag =>
                            <Text key={tag} style={{ margin: 3, padding: 3, paddingRight: 7, paddingHorizontal: 10, borderWidth: 1, borderColor: '#393E46', color: '#393E46', borderRadius: 50 }}>{tag}</Text>
                        )}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Category: </Text>
                        <Text style={{ padding: 3, paddingRight: 7, paddingHorizontal: 10, borderWidth: 1, borderColor: '#393E46', color: '#393E46', borderRadius: 50 }}>{complex.category}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Depth: </Text>
                        <Text style={{ padding: 3, paddingRight: 7, paddingHorizontal: 10, borderWidth: 1, borderColor: '#393E46', color: '#393E46', borderRadius: 50 }}>{complex.depth}M</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Capacity: </Text>
                        <Text style={{ padding: 3, paddingRight: 7, paddingHorizontal: 10, borderWidth: 1, borderColor: '#393E46', color: '#393E46', borderRadius: 50 }}>{complex.capacity} Pax</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Vaccination: </Text>
                        <Text style={{ marginTop: 1 }}>{complex.vaccinationRequired ? <Ionicons name='checkmark-circle-outline' size={25} style={{ color: '#2ed62b' }} /> :
                            <Ionicons name='alert-circle-outline' size={25} style={{ color: '#d62b2b' }} />}</Text>
                    </View>
                    <View style={{ marginTop: 15, width: '100%' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }} >Weather info: </Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 5 }}>
                                <Text>Pool water temperature: {livetemp}°C</Text>
                                {showWeather &&
                                    <>
                                        <Text>Air temperature: {weather.current.temp_c}°C</Text>
                                        <Text>Humidity: {weather.current.humidity}%</Text>
                                    </>
                                }
                            </View>
                            <View style={{ flex: 1 }}>
                                {showWeather &&
                                    <Image resizeMethod='resize' source={{ uri: 'http:' + weather.current.condition.icon }}
                                        style={{ height: 40, width: 40 }} />
                                }
                            </View>
                        </View>
                        <View style={{ justifyContent: 'center', width: '100%' }}>
                            <TouchableOpacity style={styles.tempHistoryBtn} onPress={openModal}>
                                <Text>View water temperature history</Text>
                            </TouchableOpacity>
                        </View>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => {
                                setModalVisible(!modalVisible)
                            }}>
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>

                                    <View style={{ height: 200, flexDirection: 'row' }}>
                                        <YAxis
                                            data={chart}
                                            contentInset={{ top: 20, bottom: 20 }}
                                            svg={{
                                                fill: 'grey',
                                                fontSize: 10,
                                            }}
                                            numberOfTicks={10}
                                            formatLabel={(value) => `${value}ºC`}
                                        />
                                        <LineChart
                                            style={{ flex: 1, marginLeft: 16 }}
                                            data={chart}
                                            svg={{ stroke: 'rgb(134, 65, 244)' }}
                                            contentInset={{ top: 20, bottom: 20 }}
                                        >
                                            <Grid />
                                        </LineChart>
                                    </View>

                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{ fontSize: 12 }}>Chart is in a 15 minutes intervals for the past 3 hours.</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                                        <TouchableOpacity
                                            onPress={() => setModalVisible(!modalVisible)}
                                            style={{ ...styles.price, width: 100, alignItems: 'center', backgroundColor: '#00ADB5', borderColor: '#00ADB5' }}>
                                            <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Close</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
                    {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }} >Base price per session: </Text>
                        <Text>Rs 124</Text>
                    </View> */}
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Description: </Text>
                        <Text style={{ textAlign: 'justify' }}>{complex.description}</Text>
                    </View>
                    <View style={{ marginLeft: 10, marginTop: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Facilities: </Text>
                        {complex.facilities.map(facility =>
                            <View key={facility}>
                                <Text> ➜ {facility}</Text>
                            </View>
                        )}
                    </View>
                    <View style={{ marginLeft: 10, marginTop: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Activities: </Text>
                        {complex.activities.map(activity =>
                            <View key={activity}>
                                <Text> ➜ {activity}</Text>
                            </View>
                        )}
                    </View>
                    <View style={{ marginLeft: 10, marginTop: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Packages: </Text>
                        {complex.packages.map((pkg, i) =>
                            <View key={i}>
                                <Text> ➜ {pkg.name} - Rs {pkg.price}/adult ~ Rs {pkg.kidPrice}/kid</Text>
                                <Text style={{ marginLeft: 30 }}>{pkg.description}</Text>
                            </View>
                        )}
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 12 }}>Note: Children under 13 years old are considered kids.</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        paddingTop: 0,
        marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
    },
    name: {
        fontSize: 20,
        fontWeight: '700'
    },
    address: {
        fontSize: 16
    },
    text: {
        marginBottom: 10,
        marginTop: 10,
        alignSelf: 'flex-start',
        width: '100%'
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
        color: '#EEEEEE'
    },
    actions: {
        flexDirection: 'row',
        alignSelf: 'flex-end'
    },
    navigate: {
        alignSelf: 'flex-end',
        padding: 10,
        borderWidth: 1,
        borderRadius: 50,
        borderColor: '#222831',
        backgroundColor: '#393E46',
        marginTop: 5,
        marginRight: 5
    },
    tempHistoryBtn: {
        borderColor: '#00ADB5',
        borderWidth: 1,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        borderRadius: 20
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    }
})

export default ComplexDetailsScreen