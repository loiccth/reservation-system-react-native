import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, TextInput, Image, ToastAndroid } from 'react-native'
import { Camera } from 'expo-camera'

const QRScannerScreen = ({ navigation }) => {
    const [hasPermission, setHasPermission] = React.useState(null)

    React.useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync()
            setHasPermission(status === 'granted')
        })()
    }, [])

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>
    }

    return (
        <View style={{ ...styles.container, backgroundColor: '#000' }}>
            <View style={styles.header}>
                <Text style={styles.headerText}>QR Scanner</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Camera
                    onBarCodeScanned={(...args) => {
                        const data = args[0].data
                        console.log(data)
                        navigation.navigate('SearchReservation', { reservationId: data })
                    }}
                    barCodeScannerSettings={{
                        barCodeTypes: ['qr'],
                    }}
                    style={{ flex: 1 }}
                />
            </View>
        </View>
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
    }
})

export default QRScannerScreen