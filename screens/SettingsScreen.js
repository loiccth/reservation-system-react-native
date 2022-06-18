import React from 'react'
import { StyleSheet, Text, View, Button, Platform, StatusBar, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import { getAuth, signOut } from 'firebase/auth'
import illustration from '../assets/undraw_set_preferences_kwia.png'
import { Ionicons } from '@expo/vector-icons'
import { Card } from 'react-native-paper'

const SettingsScreen = ({ navigation }) => {
    const auth = getAuth()

    return (
        <ScrollView style={styles.container}>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <Image source={illustration} style={styles.illustration} />
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 15 }}>Settings</Text>
            </View>

            <View style={styles.settingTabs}>
                <Card style={styles.tabContainer} elevation={10}>
                    <TouchableOpacity style={styles.test} onPress={() => navigation.navigate('Account')}>
                        <View style={{ flex: 4, justifyContent: 'center', padding: 10 }}>
                            <Text style={{ fontSize: 16, fontWeight: '700' }}>Account</Text>
                        </View>
                        <View style={{ flex: 1, alignSelf: 'flex-end', alignItems: 'flex-end', padding: 5 }}>
                            <Ionicons name='arrow-forward-circle-outline' size={30} style={{ color: '#00ADB5' }} />
                        </View>
                    </TouchableOpacity>
                </Card>
                <Card style={styles.tabContainer} elevation={10}>
                    <TouchableOpacity style={styles.test} onPress={() => navigation.navigate('Membership')}>
                        <View style={{ flex: 4, justifyContent: 'center', padding: 10 }}>
                            <Text style={{ fontSize: 16, fontWeight: '700' }}>Membership</Text>
                        </View>
                        <View style={{ flex: 1, alignSelf: 'flex-end', alignItems: 'flex-end', padding: 5 }}>
                            <Ionicons name='arrow-forward-circle-outline' size={30} style={{ color: '#00ADB5' }} />
                        </View>
                    </TouchableOpacity>
                </Card>
                <Card style={styles.tabContainer} elevation={10}>
                    <TouchableOpacity style={styles.test} onPress={() => navigation.navigate('AboutUs')}>
                        <View style={{ flex: 4, justifyContent: 'center', padding: 10 }}>
                            <Text style={{ fontSize: 16, fontWeight: '700' }}>About Us</Text>
                        </View>
                        <View style={{ flex: 1, alignSelf: 'flex-end', alignItems: 'flex-end', padding: 5 }}>
                            <Ionicons name='arrow-forward-circle-outline' size={30} style={{ color: '#00ADB5' }} />
                        </View>
                    </TouchableOpacity>
                </Card>
                <Card style={styles.tabContainer} elevation={10}>
                    <TouchableOpacity style={styles.test} onPress={() => navigation.navigate('TermsConditions')}>
                        <View style={{ flex: 4, justifyContent: 'center', padding: 10 }}>
                            <Text style={{ fontSize: 16, fontWeight: '700' }}>Terms and Conditions</Text>
                        </View>
                        <View style={{ flex: 1, alignSelf: 'flex-end', alignItems: 'flex-end', padding: 5 }}>
                            <Ionicons name='arrow-forward-circle-outline' size={30} style={{ color: '#00ADB5' }} />
                        </View>
                    </TouchableOpacity>
                </Card>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 30 }}>
                <TouchableOpacity
                    onPress={() => signOut(auth)}
                    style={{ ...styles.btn, width: 160, alignItems: 'center', backgroundColor: '#393E46', borderColor: '#393E46' }}>
                    <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Logout</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default SettingsScreen

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
        backgroundColor: '#fff',
        marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
    },
    illustration: {
        width: 270,
        height: 200,
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
    },
    settingTabs: {

    },
    tabContainer: {
        backgroundColor: 'white',
        margin: 10,
        marginBottom: 5
    },
    test: {
        flexDirection: 'row',
    }
})