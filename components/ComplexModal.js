import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Modal, Image, ScrollView } from 'react-native'
import * as Notifications from 'expo-notifications'
import ComplexModalRoute from './ComplexModalRoute'

const ComplexModal = ({ complex, modal, closeModal }) => {
    const [mapModal, setMapModal] = React.useState(false)

    const closeMapModal = () => {
        setMapModal(false)
    }

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

    return (
        <Modal
            visible={modal}
            animationType='slide'
            transparent={true}
            onRequestClose={() => closeModal()}
        >
            <ScrollView style={styles.modalContainer} contentContainerStyle={{ alignItems: 'center' }}>
                <Image source={{ uri: complex.images[0] }} style={{ height: 250, width: '100%' }} />

                <View style={styles.text}>
                    <Text style={styles.name}>{complex.name}</Text>
                    <Text style={styles.address}>{complex.location}</Text>
                    <Text style={styles.address}>[{complex.coordinate.latitude}, {complex.coordinate.longitude}]</Text>
                    <Text>Category: {complex.category}</Text>
                    <Text>Description: {complex.description}</Text>
                </View>

                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity style={styles.button} onPress={sendNotification}>
                        <Text style={styles.buttonTxt}>Reserve slot</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => setMapModal(true)}>
                        <Text style={styles.buttonTxt}>View GPS route</Text>
                    </TouchableOpacity>
                </View>
                <ComplexModalRoute coordinate={complex.coordinate} modal={mapModal} closeModal={closeMapModal} name={complex.name} />
            </ScrollView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#fff',
        flex: 1
    },
    name: { fontFamily: 'Lato_900Black' },
    address: { fontFamily: 'Oswald_400Regular' },
    text: { marginHorizontal: 20, marginBottom: 10, marginTop: 20, alignSelf: 'flex-start' },
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
        color: '#fff'
    },
})

export default ComplexModal