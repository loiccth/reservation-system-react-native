import React from 'react'
import { StyleSheet, View, Platform, StatusBar, ToastAndroid } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

const MapScreen = () => {
    const mapRef = React.useRef(null)
    const db = getFirestore()
    const [data, setData] = React.useState([])

    const temp = []

    React.useEffect(async () => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                ToastAndroid.show('Permission to access location was denied', ToastAndroid.SHORT)
                return;
            }

            let location = await Location.getCurrentPositionAsync({});

            mapRef.current.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1
            })
        })()

        const querySnapshot = await getDocs(collection(db, 'complexes'))
        querySnapshot.forEach((doc) => {
            // console.log(doc.id, " => ", doc.data())
            temp.push(doc.data())
        })
        setData(temp)
    }, [])

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={{ flex: 1, width: '100%' }}
                showsCompass={true}
                showsUserLocation={true}
                initialRegion={{
                    latitude: -20.1710715,
                    longitude: 57.5067096,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                }}
            >
                {data.map((mark, index) =>
                    <Marker
                        key={index}
                        coordinate={{
                            latitude: mark.coordinate.latitude,
                            longitude: mark.coordinate.longitude
                        }}
                        description={mark.description}
                        title={mark.name}
                    />
                )}
            </MapView>
        </View>
    )
}

export default MapScreen

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
    },
})