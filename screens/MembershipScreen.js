import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Alert, Image, ScrollView, ToastAndroid } from 'react-native'
import { Card } from 'react-native-paper'
import { UserContext } from '../contexts/UserContext'
import { useFocusEffect } from '@react-navigation/native'
import { getFirestore, collection, updateDoc, query, where, doc, getDoc } from 'firebase/firestore'
import isInThePast from '../utils/pastCheck'
import addMonths from '../utils/addMonths'

const MembershipScreen = ({ navigation }) => {
    const { user, membership, setMembership } = React.useContext(UserContext)
    const [loading, setLoading] = React.useState(true)
    const db = getFirestore()

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                getDoc(doc(db, 'memberships', user.uid))
                    .then(res => {
                        if (res.exists()) {
                            if (!isInThePast(new Date(res.data().endDate))) {
                                setMembership(res.data())
                            }
                            else {
                                if (res.data().recurring) {
                                    const newEndDate = addMonths(new Date(res.data().endDate), 1)
                                    setMembership({
                                        ...res.data(),
                                        endDate: newEndDate
                                    })

                                    updateDoc(doc(db, 'memberships', user.uid), {
                                        endDate: newEndDate
                                    })

                                    // TODO: send post request for stripe
                                }
                                else {
                                    setMembership()
                                    deleteDoc(doc(db, 'memberships', user.uid))
                                }
                            }
                        }
                        else {
                            setMembership()
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    .finally(() => setLoading(false))
            })()
        }, [])
    )

    const createTwoButtonAlert = () => {
        Alert.alert('Cancellation', 'Are you sure you want to your recurring subscription payment?', [
            {
                text: 'Cancel',
                onPress: () => { },
                style: 'cancel',
            },
            { text: 'Yes', onPress: () => handleCancel() },
        ])
    }

    const handleCancel = () => {
        updateDoc(doc(db, 'memberships', user.uid), {
            recurring: false
        }).then(() => {
            setMembership({
                ...membership,
                recurring: false
            })
        })

    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>View Memberships</Text>
            </View>

            <View style={styles.reservationInfo}>
                <View style={{ margin: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text>Your membership: </Text>
                        {!membership ?
                            <Text
                                style={{
                                    ...styles.membershipStatus,
                                    backgroundColor: '#fff'
                                }}>None</Text> :
                            <Text
                                style={{
                                    ...styles.membershipStatus,
                                    backgroundColor: membership.type === 'Basic' ? '#EEEEEE' :
                                        membership.type === 'Family' ? '#d4d9d9' : '#c2d1d1'
                                }}>{membership.type}</Text>
                        }
                    </View>
                    {membership &&
                        <>
                            <Text>Membership start date: {new Date(membership.startDate).toLocaleString()}</Text>
                            {!membership.recurring && <Text>Membership end date: {new Date(membership.endDate).toLocaleString()}</Text>}
                            {membership.recurring && <Text>Auto renew date: {new Date(membership.endDate).toLocaleDateString()}</Text>}
                            <Text>Recurring: {membership.recurring === true ? 'Yes' : 'No'}</Text>

                            {membership.recurring &&
                                <TouchableOpacity
                                    onPress={createTwoButtonAlert}
                                    style={{ ...styles.btn, alignSelf: 'flex-end', width: 140, alignItems: 'center', backgroundColor: '#00ADB5', borderColor: '#00ADB5' }}>
                                    <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Cancel recurring</Text>
                                </TouchableOpacity>
                            }

                            <Text style={{ fontSize: 12, marginTop: 10, textAlign: 'justify' }}>Note: You can't change membership type while you have a membership subscription</Text>
                        </>
                    }
                </View>
                <Card style={styles.tabContainer} elevation={10}>
                    <TouchableOpacity
                        disabled={membership || loading}
                        onPress={() => navigation.navigate('MembershipPayment', { type: 'Basic', price: 800 })}
                        style={{ padding: 10, backgroundColor: '#EEEEEE' }}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.membershipTitle}>Basic Package</Text>
                        </View>
                        <View style={styles.bodyContainer}>
                            <Text>25% discount on all reservations</Text>
                            <Text>Additional activities</Text>
                        </View>
                        <View style={styles.priceContainer}>
                            <Text style={styles.price}>As from Rs 800/month</Text>
                        </View>
                    </TouchableOpacity>
                </Card>
                <Card style={styles.tabContainer} elevation={10}>
                    <TouchableOpacity
                        disabled={membership || loading}
                        onPress={() => navigation.navigate('MembershipPayment', { type: 'Family', price: 2500 })}
                        style={{ padding: 10, backgroundColor: '#d4d9d9' }}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.membershipTitle}>Family Package</Text>
                        </View>
                        <View style={styles.bodyContainer}>
                            <Text>25% discount on all reservations</Text>
                            <Text>Posibility to do group reservation (Adults & Children)</Text>
                            <Text>Free towels and swimming pool equipments</Text>
                            <Text>Additional activities</Text>
                        </View>
                        <View style={styles.priceContainer}>
                            <Text style={styles.price}>As from Rs 2500/month</Text>
                        </View>
                    </TouchableOpacity>
                </Card>
                <Card style={styles.tabContainer} elevation={10}>
                    <TouchableOpacity
                        disabled={membership || loading}
                        onPress={() => navigation.navigate('MembershipPayment', { type: 'VIP', price: 4000 })}
                        style={{ padding: 10, backgroundColor: '#c2d1d1' }}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.membershipTitle}>VIP Package</Text>
                        </View>
                        <View style={styles.bodyContainer}>
                            <Text>Access to VIP Club</Text>
                            <Text>Free access to all complexes</Text>
                            <Text>Free towels and swimming pool equipments</Text>
                            <Text>Additional activities</Text>
                        </View>
                        <View style={styles.priceContainer}>
                            <Text style={styles.price}>As from Rs 4000/month</Text>
                        </View>
                    </TouchableOpacity>
                </Card>
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
        marginTop: 20
    },
    tabContainer: {
        backgroundColor: 'white',
        margin: 10
    },
    titleContainer: {
        alignItems: 'center'
    },
    membershipTitle: {
        fontSize: 18,
        fontWeight: '700'
    },
    bodyContainer: {
        marginTop: 30,
        alignItems: 'center'
    },
    priceContainer: {
        alignItems: 'center',
        marginVertical: 20
    },
    price: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#00ADB5',
        fontWeight: '700'
    },
    membershipStatus: {
        padding: 3,
        paddingRight: 7,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#393E46',
        color: '#393E46',
        borderRadius: 50
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

export default MembershipScreen