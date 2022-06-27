import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, TextInput, Image, ScrollView, ToastAndroid } from 'react-native'

const TermsConditionsScreen = ({ navigation }) => {

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Terms and Conditions</Text>
            </View>

            <View style={styles.reservationInfo}>
                <Text style={{ marginBottom: 20, textAlign: 'justify' }}>By using this this application, you are agreeing to be bound by these website Terms and Conditions of Service, the Privacy Policy, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. We may modify these Terms and Conditions at any time without notice to you by posting revised Terms and Conditions of Service. Your use of the website constitutes your binding acceptance of these Terms and Conditions of Service, including any modifications that we make. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.
                    The Service includes a combination of content that we create and that other third party content suppliers create. You understand that the Service are provided "AS IS", and that Copyandpasteemoji.com does not guarantee the accuracy, integrity or quality of any content available on the website. Copyandpasteemoji.com disclaims all responsibility and liability for the accuracy, availability, timeliness, security or reliability of the Service. We reserve the right to modify, suspend or discontinue the Service with or without notice at any time and without any liability to you.
                    Access to Sites</Text>

                <Text style={{ marginBottom: 20, textAlign: 'justify' }}>By using this application, you are agreeing to a bide by the vaccination rules of the swimming pools and if you going in group using the Family membership, all participants must also be fully vaccinated.</Text>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Setting')}
                        style={{ ...styles.price, width: 140, alignItems: 'center', backgroundColor: '#393E46', borderColor: '#393E46' }}>
                        <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Accept</Text>
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

export default TermsConditionsScreen