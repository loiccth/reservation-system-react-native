import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, TextInput, Image, ScrollView, ToastAndroid, Modal } from 'react-native'
import ImageView from 'react-native-image-viewing'
import { getFirestore, collection, updateDoc, query, where, doc, getDoc } from 'firebase/firestore'

const UserDetailsScreen = ({ route, navigation }) => {
    const { userDetails } = route.params
    const [status, setStatus] = React.useState(userDetails.vaccineValidated)
    const [viewImg, setViewImg] = React.useState(false)
    const image = [{
        uri: userDetails.vaccinationCard
    }]
    const db = getFirestore()
    const [modalVisible, setModalVisible] = React.useState(false)

    const updateVaccine = (e) => {
        updateDoc(doc(db, 'users', userDetails.uid), {
            vaccineValidated: e
        }).then(() => {
            setStatus(e)
            setModalVisible(false)
            ToastAndroid.show('Status updated.', ToastAndroid.SHORT)
        })
            .catch(err => {
                console.log(err)
                ToastAndroid.show('Unexpected error.', ToastAndroid.SHORT)
            })
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>{userDetails.lastname}, {userDetails.firstname} Info</Text>
            </View>

            <View style={styles.reservationInfo}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <View><Text style={{ fontSize: 16, fontWeight: '700' }}>Field</Text></View>
                        <View style={{ marginVertical: 10 }}><Text style={{ fontWeight: '700' }}>Email</Text></View>
                        <View style={{ marginVertical: 10 }}><Text style={{ fontWeight: '700' }}>Firstname</Text></View>
                        <View style={{ marginVertical: 10 }}><Text style={{ fontWeight: '700' }}>Lastname</Text></View>
                        <View style={{ marginVertical: 10 }}><Text style={{ fontWeight: '700' }}>Phone</Text></View>
                        <View style={{ marginVertical: 10 }}><Text style={{ fontWeight: '700' }}>Role</Text></View>
                        <View style={{ marginVertical: 10 }}><Text style={{ fontWeight: '700' }}>Last time logged in</Text></View>
                        <View style={{ marginVertical: 10 }}><Text style={{ fontWeight: '700' }}>Vaccine status</Text></View>
                        <View style={{ marginVertical: 10, height: 33, justifyContent: 'center' }}><Text style={{ fontWeight: '700' }}>Vaccine card</Text></View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{}}><Text style={{ fontSize: 16, fontWeight: '700' }}>Value</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>{userDetails.email}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>{userDetails.firstname}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>{userDetails.lastname}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>{userDetails.phone}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>{userDetails.role}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text>{new Date(userDetails.lastlogin).toLocaleString()}</Text></View>
                        <View style={{ marginVertical: 10 }}><Text style={{ textTransform: 'capitalize' }}>{status}</Text></View>
                        <View style={{ marginVertical: 10 }}>
                            <TouchableOpacity
                                onPress={() => setViewImg(true)}
                                style={{ ...styles.viewImage, width: 60, alignItems: 'center', backgroundColor: '#00ADB5', borderColor: '#00ADB5' }}>
                                <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>View</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <ImageView
                    images={image}
                    imageIndex={0}
                    visible={viewImg}
                    onRequestClose={() => setViewImg(false)}
                />

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={{ ...styles.price, width: 190, alignItems: 'center', backgroundColor: '#393E46', borderColor: '#393E46' }}>
                        <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Update vaccine status</Text>
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
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <TouchableOpacity
                                    onPress={() => updateVaccine('rejected')}
                                    style={{ ...styles.price, width: 100, alignItems: 'center', backgroundColor: '#eb4034', borderColor: '#eb4034' }}>
                                    <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Rejected</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => updateVaccine('approved')}
                                    style={{ ...styles.price, width: 100, alignItems: 'center', backgroundColor: '#00ADB5', borderColor: '#00ADB5' }}>
                                    <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Approved</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                                <TouchableOpacity
                                    onPress={() => setModalVisible(!modalVisible)}
                                    style={{ ...styles.price, width: 100, alignItems: 'center', backgroundColor: '#393E46', borderColor: '#393E46' }}>
                                    <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('UserReservations', { user: userDetails })}
                        style={{ ...styles.price, width: 190, alignItems: 'center', backgroundColor: '#00ADB5', borderColor: '#00ADB5' }}>
                        <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>View user's reservations</Text>
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
    viewImage: {
        fontSize: 16,
        margin: 3,
        padding: 4,
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

export default UserDetailsScreen