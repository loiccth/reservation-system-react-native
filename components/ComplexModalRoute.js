import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Modal, Image, ScrollView } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import MapViewDirections from 'react-native-maps-directions'

const ComplexModalRoute = ({ coordinate, modal, closeModal, name }) => {
    const mapRef = React.useRef(null)
    const [coor, setCoor] = React.useState([])

    React.useEffect(async () => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                ToastAndroid.show('Permission to access location was denied', ToastAndroid.SHORT)
                return;
            }

            let location = await Location.getCurrentPositionAsync({});

            const temp = []
            temp.push({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            })
            temp.push(coordinate)
            setCoor(temp)
        })()

    }, [])

    React.useEffect(() => {
        if (modal && mapRef.current !== null && coor.length === 2) {
            setTimeout(() => {
                mapRef.current.animateToRegion({
                    latitude: coor[0].latitude,
                    longitude: coor[0].longitude,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1
                })
            }, 1000)
        }
    }, [mapRef.current])

    return (
        <Modal
            visible={modal}
            animationType='slide'
            transparent={true}
            onRequestClose={() => closeModal()}
        >
            <View style={styles.modalContainer}>
                <MapView
                    ref={mapRef}
                    style={{ flex: 1, width: '100%' }}
                    showsUserLocation={true}
                    initialRegion={{
                        latitude: -20.2883264,
                        longitude: 57.5746552,
                        latitudeDelta: 1,
                        longitudeDelta: 1
                    }}
                >
                    {coor.length === 2 &&
                        <>
                            <MapViewDirections
                                lineDashPattern={[1]}
                                origin={coor[0]}
                                destination={coor[1]}
                                apikey={'AIzaSyDWWaegGGsWXVEvUEHt2Z8RzQjwRJrMgnk'}
                                strokeWidth={5}
                                strokeColor="hotpink"
                            />
                            <Marker
                                coordinate={coor[1]}
                                title='Destination'
                                description={name}
                            />
                        </>
                    }
                </MapView>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: '#fff',
        flex: 1
    },
})

export default ComplexModalRoute