import React from 'react'
import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Platform,
    TouchableOpacity
} from 'react-native'
import background from '../assets/background.png'

const WelcomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <ImageBackground source={background} resizeMode='cover' style={styles.image}>
                <View style={styles.welcome}>
                    <Text style={styles.welcomeTxt}>Welcome to XYZ</Text>
                </View>
                <View style={styles.actions}>

                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Sign Up')}>
                        <Text style={styles.buttonTxt}>
                            Sign Up
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Sign In')}>
                        <Text style={styles.buttonTxt}>
                            Sign In
                        </Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    )
}

export default WelcomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
    },
    image: {
        flex: 1,
    },
    welcome: {
        height: 150,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    welcomeTxt: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 24
    },
    actions: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#ddd',
        padding: 20,
        width: 200,
        alignItems: 'center',
        borderRadius: 10,
        margin: 10
    },
    buttonTxt: {
        fontWeight: 'bold',
        fontSize: 18
    }
})