import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, TextInput, Image, ScrollView, ToastAndroid } from 'react-native'

const AboutUs = ({ navigation }) => {

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>About Us</Text>
            </View>

            <View style={styles.reservationInfo}>
                <Text style={{ marginBottom: 20, textAlign: 'justify' }}>PiscineDansMoris is a developed by Loic Chung Tai Him as part of the final year project to complete a BSc Software Engeering degree from Universite des Mascareignes. It was developed with the knowledge aquired throughout the three intensive years of courses. Went through the toughest part of life due to Covid19, we had to suddenly shift to online teaching. This made us very resilient and able to any changes that are thrown to us in the near future.</Text>
                <Text style={{ marginBottom: 20, textAlign: 'justify' }}>The motivation that for this project from IoT projects that students and professionals built during online competitions, one example was from linkedin where a student built a small system that detects when the level of water is too high and opens valves to prevent over flooding like the one that happened in 30 March 2013. From these ideas, I implemented an IoT system that gets live temperature of the pool water.</Text>
                <Text style={{ marginBottom: 20, textAlign: 'justify' }}>PiscineDansMoris' main vision is to be one of the best reservation/booking application in Mauritius</Text>
                <Text style={{ marginBottom: 20, textAlign: 'justify' }}>PiscineDansMoris' main mission is help mauritius do more exercise as we, as a community, are unhealthy and lack exercise. Swimming is one of the best exercise that is available, if we could increase the number of people using our complexes and our app, this would be one of the best achievement.</Text>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Setting')}
                        style={{ ...styles.price, width: 140, alignItems: 'center', backgroundColor: '#393E46', borderColor: '#393E46' }}>
                        <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Okay!</Text>
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
    }
})

export default AboutUs