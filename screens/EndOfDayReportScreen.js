import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, TextInput, Image, ScrollView, ToastAndroid } from 'react-native'
import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore'
import { useFocusEffect } from '@react-navigation/native'
import DateTimePicker from '@react-native-community/datetimepicker'
import NoReservations from '../components/NoReservations'
import { Card } from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons'

const EndOfDayReportScreen = ({ navigation }) => {
    const [currentDate, setCurrentDate] = React.useState(Date.now())
    const [epoch, setEpoch] = React.useState({
        start: 0,
        end: 0
    })
    const [show, setShow] = React.useState(false)
    const [count, setCount] = React.useState({
        adults: 0,
        children: 0,
        gross: 0
    })
    const [reservations, setReservations] = React.useState([])
    const db = getFirestore()

    React.useEffect(() => {
        const z = new Date(currentDate)
        z.setHours(0, 0, 0, 0)
        console.log('today => ' + z)

        const today = new Date(currentDate)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(0, 0, 0, 0)
        console.log('tomorrow => ' + tomorrow)

        setEpoch({
            start: Date.parse(z),
            end: Date.parse(tomorrow)
        })
    }, [currentDate])

    const onChangeDate = (event, selectedDate) => {
        setShow(false)

        if (event.type !== 'dismissed') {
            setCurrentDate(Date.parse(selectedDate))
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                let temp = []
                let adults = 0
                let children = 0
                let gross = 0

                getDocs(query(collection(db, 'reservations'), where('status', '==', 'Completed'), where('date', '<', epoch.end), where('date', '>=', epoch.start)))
                    .then(querySnapshot => {
                        querySnapshot.forEach((doc) => {
                            // console.log(doc.id, " => ", doc.data())
                            temp.push({
                                ...doc.data(),
                                id: doc.id
                            })
                            adults += doc.data().people.adult
                            children += doc.data().people.children
                            gross += ((doc.data().people.adult * doc.data().packageDetails.price) + (doc.data().people.children * doc.data().packageDetails.kidPrice))
                        })
                        setReservations(temp)
                        setCount({
                            adults,
                            children,
                            gross
                        })
                    })
                    .catch(err => console.log(err))
            })()
        }, [epoch])
    )

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>End of Day Report</Text>
            </View>

            <View style={styles.reservationInfo}>
                <View >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text>Report date: </Text>
                                <Text style={{ fontWeight: 'bold' }}>{new Date(currentDate).toLocaleDateString()}</Text>
                            </View>
                        </View>
                        <View style={{ alignItems: 'flex-end', flex: 1 }}>
                            <TouchableOpacity onPress={() => setShow(true)} style={{ ...styles.hours }}>
                                <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Choose date</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {show && (
                        <DateTimePicker
                            value={new Date(currentDate)}
                            mode='date'
                            is24Hour={true}
                            onChange={onChangeDate}
                            maximumDate={new Date()}
                        />
                    )}
                </View>

                {reservations.length === 0 ? <NoReservations /> :
                    <View style={{ margin: 10 }}>
                        {reservations.map((reser, i) =>
                            <>
                                <Card key={i} style={styles.card} elevation={10}>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('DetailsReservation', {
                                            complex: reser.complex,
                                            reservationDetails: reser,
                                            price: (reser.packageDetails.price * reser.people.adult) + (reser.packageDetails.kidPrice * reser.people.children)
                                        })}>
                                        <View style={styles.text}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text>User: </Text>
                                                <Text style={styles.name}>{reser.user}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                                    <Text>Location: </Text>
                                                    <Text style={styles.name}>{reser.complex.name}</Text>
                                                </View>
                                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                    <Text>
                                                        <Ionicons name='location-outline' size={20} style={{ color: '#00ADB5' }} /> {reser.complex.location.split(', ')[0]}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text>
                                                    <Ionicons name='calendar-outline' size={20} style={{ color: '#00ADB5' }} /> {new Date(reser.date).toLocaleDateString() + ' @ ' + reser.hourSlotDetail}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text>
                                                    <Ionicons name='people-outline' size={20} style={{ color: '#00ADB5' }} /> Adults: {reser.people.adult}, Children: {reser.people.children}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text>Total price: Rs {(reser.packageDetails.price * reser.people.adult) + (reser.packageDetails.kidPrice * reser.people.children)}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </Card>

                                <View style={{ marginTop: 10, alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text>Total adults: </Text>
                                        <Text style={{ fontWeight: '700' }}>{count.adults}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text>Total children: </Text>
                                        <Text style={{ fontWeight: '700' }}>{count.children}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text>Gross total: </Text>
                                        <Text style={{ fontWeight: '700' }}>Rs {count.gross}</Text>
                                    </View>
                                </View>
                            </>
                        )}
                    </View>
                }
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
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#EEEEEE',
        marginVertical: 10
    },
    reservationInfo: {
        padding: 10,
        marginTop: 10
    },
    headers: {
        fontSize: 16,
        fontWeight: '700'
    },
    hours: {
        borderColor: '#00ADB5',
        backgroundColor: '#00ADB5',
        borderWidth: 1,
        width: 100,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        borderRadius: 20
    },
    name: {
        fontWeight: '700'
    },
    card: {
        backgroundColor: 'white',
        marginVertical: 10
    },
    text: {
        marginHorizontal: 10,
        marginBottom: 5,
        marginTop: 5
    }
})

export default EndOfDayReportScreen