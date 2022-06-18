import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Button, ScrollView } from 'react-native'
import { getFirestore, collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore'
import DateTimePicker from '@react-native-community/datetimepicker'
import Slider from '@react-native-community/slider'
import { UserContext } from '../contexts/UserContext'

const ReservationScreen = ({ route, navigation }) => {
    const { membership } = React.useContext(UserContext)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [reservationDetails, setReservationDetails] = React.useState({
        hourSlot: -1,
        hourSlotDetail: null,
        date: tomorrow,
        package: 'none',
        packageDetails: null,
        people: {
            adult: 1,
            children: 0
        }
    })
    const [price, setPrice] = React.useState(0)
    const [discount, setDiscount] = React.useState(0)
    const [slots, setSlots] = React.useState([])
    const [splitSlots, setSplitSlots] = React.useState([])
    const [splitPackages, setSplitPackages] = React.useState([])
    const [show, setShow] = React.useState(false)
    const [showDate, setShowDate] = React.useState(false)
    const [membershipFamily, setMembershipFamily] = React.useState(false)
    const { complex } = route.params
    const db = getFirestore()

    React.useEffect(() => {
        getDoc(doc(db, 'settings', 'hours'))
            .then(res => {
                if (res.exists()) {
                    setSlots(res.data().data)
                }
                else {
                    setSlots([])
                }
            })
            .catch(err => {
                console.log(err)
            })

        let temp = []
        if (complex.packages.length != 0) {
            for (let i = 0; i < complex.packages.length; i += 3) {
                if (complex.packages.length < i + 3) {
                    temp.push(complex.packages.slice(i, complex.packages.length))
                }
                else {
                    temp.push(complex.packages.slice(i, i + 3))
                }
            }
            setSplitPackages(temp)
        }

        if (membership) {
            if (membership.type == 'Family') {
                setMembershipFamily(true)
            }
        }
    }, [])

    React.useEffect(() => {
        let splitArray = []
        if (slots.length != 0) {
            for (let i = 0; i < slots.length; i += 3) {
                if (slots.length < i + 3) {
                    splitArray.push(slots.slice(i, slots.length))
                }
                else {
                    splitArray.push(slots.slice(i, i + 3))
                }
            }
            setSplitSlots(splitArray)
        }
    }, [slots])

    React.useEffect(() => {
        if (showDate && reservationDetails.hourSlot != -1 && reservationDetails.package != 'none' && reservationDetails.packageDetails != null) {
            const adultPrice = reservationDetails.packageDetails.price * reservationDetails.people.adult
            const childPrice = reservationDetails.packageDetails.kidPrice * reservationDetails.people.children
            let discount = 0

            if (membership) {
                if (membership.type === 'Basic') {
                    discount += 0.25 * adultPrice
                    discount += 0.25 * childPrice
                }
                else if (membership.type === 'Family') {
                    discount += 0.25 * adultPrice
                    discount += 0.25 * childPrice
                }
                else if (membership.type == 'VIP') {
                    discount += adultPrice
                    discount += childPrice
                }
                setDiscount(discount)
                setPrice((adultPrice + childPrice) - discount)
            }
            else {
                setPrice(adultPrice + childPrice)
            }
        }
    }, [reservationDetails, showDate])

    const clickHour = (i, detail) => {
        setReservationDetails({
            ...reservationDetails,
            hourSlot: i,
            hourSlotDetail: detail
        })
    }

    const clickPackage = (i, details) => {
        setReservationDetails({
            ...reservationDetails,
            package: i,
            packageDetails: details
        })
    }

    const showDatepicker = () => {
        setShow(true)
    }

    const onChangeDate = (event, selectedDate) => {
        setShow(false)

        if (event.type !== 'dismissed') {
            setReservationDetails({
                ...reservationDetails,
                date: selectedDate
            })
            setShowDate(true)
        }
    }

    const updateAdult = (e) => {
        setReservationDetails({
            ...reservationDetails,
            people: {
                ...reservationDetails.people,
                adult: e
            }
        })
    }

    const updateKid = (e) => {
        setReservationDetails({
            ...reservationDetails,
            people: {
                ...reservationDetails.people,
                children: e
            }
        })
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Reservation for {complex.name}</Text>
            </View>
            <View style={styles.reservationInfo}>
                <View style={styles.block}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.headers}>Choose your date:</Text>
                        <TouchableOpacity onPress={showDatepicker} style={styles.hours}>
                            <Text >Choose date</Text>
                        </TouchableOpacity>
                    </View>
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={reservationDetails.date}
                            mode='date'
                            is24Hour={true}
                            minimumDate={tomorrow}
                            onChange={onChangeDate}
                        />
                    )}
                    {showDate && <View style={{ flexDirection: 'row' }}>
                        <Text>Selected date: </Text>
                        <Text style={{ fontWeight: 'bold' }}>{reservationDetails.date.toLocaleDateString()}</Text>
                    </View>}
                </View>
                <View style={styles.block}>
                    <Text style={styles.headers}>Choose your slot:</Text>

                    {splitSlots.map((splitSlot, index1) =>
                        <View key={index1} style={styles.actions}>
                            {splitSlot.map((slot, index2) =>
                                <TouchableOpacity key={index2} onPress={() => clickHour((index1 * 3) + index2, slot)} style={{
                                    ...styles.hours,
                                    backgroundColor: reservationDetails.hourSlot === (index1 * 3) + index2 ? '#00ADB5' : '#fff'
                                }}>
                                    <Text style={{ color: reservationDetails.hourSlot === (index1 * 3) + index2 ? '#EEE' : '#000' }}>{slot}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>

                <View style={styles.block}>
                    <Text style={styles.headers}>Choose your package:</Text>

                    {splitPackages.map((splitPackage, index1) =>
                        <View key={index1} style={styles.actions}>
                            {splitPackage.map((pkg, index2) =>
                                <TouchableOpacity key={index2} onPress={() => clickPackage((index1 * 3) + index2, pkg)} style={{
                                    ...styles.hours,
                                    backgroundColor: reservationDetails.package === (index1 * 3) + index2 ? '#00ADB5' : '#fff'
                                }}>
                                    <Text style={{ color: reservationDetails.package === (index1 * 3) + index2 ? '#EEE' : '#000' }}>{pkg.name}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
                {membershipFamily &&
                    <View style={styles.block}>
                        <Text style={styles.headers}>Number of people:</Text>

                        <View style={{ alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text>Adults: </Text>
                                <Text style={{ fontWeight: 'bold' }}>{reservationDetails.people.adult}</Text>
                            </View>
                            <Slider
                                style={{ width: '80%', height: 40 }}
                                minimumValue={1}
                                maximumValue={10}
                                step={1}
                                value={reservationDetails.people.adult}
                                minimumTrackTintColor="#393E46"
                                maximumTrackTintColor="#222831"
                                thumbTintColor="#00ADB5"
                                onValueChange={updateAdult}
                            />
                        </View>

                        <View style={{ alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Text>Children: </Text>
                                <Text style={{ fontWeight: 'bold' }}>{reservationDetails.people.children}</Text>
                            </View>
                            <Slider
                                style={{ width: '80%', height: 40 }}
                                minimumValue={0}
                                maximumValue={10}
                                step={1}
                                value={reservationDetails.people.children}
                                minimumTrackTintColor="#393E46"
                                maximumTrackTintColor="#222831"
                                thumbTintColor="#00ADB5"
                                onValueChange={updateKid}
                            />
                        </View>
                    </View>
                }
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={styles.price}>Total Price: Rs <Text style={{ fontWeight: '700' }}>{price}</Text></Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                        <TouchableOpacity disabled={price === 0}
                            onPress={() => navigation.navigate('ReservationReview', { complex, reservationDetails: { ...reservationDetails, date: reservationDetails.date.toISOString() }, price, discount })}
                            style={{ ...styles.price, backgroundColor: price === 0 ? '#8f8f8f' : '#00ADB5', borderColor: price === 0 ? '#8f8f8f' : '#00ADB5' }}>
                            <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Proceed to review</Text>
                        </TouchableOpacity>
                    </View>
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
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#EEEEEE',
        marginVertical: 10
    },
    reservationInfo: {
        padding: 10
    },
    headers: {
        fontSize: 16,
        fontWeight: '700'
    },
    hours: {
        borderColor: '#00ADB5',
        borderWidth: 1,
        width: 100,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        borderRadius: 20
    },
    actions: {
        flexDirection: 'row',
        alignSelf: 'center'
    },
    selectDate: {
        borderColor: '#00ADB5',
        borderWidth: 1,
        width: 100,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        borderRadius: 20
    },
    block: {
        marginBottom: 20
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
    }
})

export default ReservationScreen