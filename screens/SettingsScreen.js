import React from 'react'
import { StyleSheet, Text, View, Button, Platform, StatusBar, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import { getAuth, signOut } from 'firebase/auth'
import illustration from '../assets/undraw_set_preferences_kwia.png'
import { UserContext } from '../contexts/UserContext'

const SettingsScreen = ({ navigation }) => {
    const auth = getAuth()
    const user = React.useContext(UserContext)

    return (
        <ScrollView style={styles.container} contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Image source={illustration} style={styles.illustration} />

            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Settings</Text>

            <View width={'94%'}>
                <Text style={styles.label}>Firstname</Text>
            </View>
            <TextInput style={styles.inputText}
                placeholderTextColor='#c4cfce'
                value={user.firstname}
                editable={false}
            />
            <View width={'94%'}>
                <Text style={styles.label}>Lastname</Text>
            </View>
            <TextInput style={styles.inputText}
                placeholderTextColor='#c4cfce'
                value={user.lastname}
                editable={false}
            />
            <View width={'94%'}>
                <Text style={styles.label}>Email</Text>
            </View>
            <TextInput style={styles.inputText}
                placeholderTextColor='#c4cfce'
                value={user.email}
                editable={false}
            />
            <View width={'94%'}>
                <Text style={styles.label}>Role</Text>
            </View>
            <TextInput style={styles.inputText}
                placeholderTextColor='#c4cfce'
                value={user.role}
                editable={false}
            />

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Add')}>
                <Text style={styles.buttonTxt}>Add new complex</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ ...styles.button, backgroundColor: 'red', marginBottom: 25 }} onPress={() => signOut(auth)}>
                <Text style={styles.buttonTxt}>Logout</Text>
            </TouchableOpacity>
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
        width: 200,
        height: 200,
    },
    label: {
        alignSelf: 'flex-start',
        color: '#333',
        fontWeight: 'bold'
    },
    inputText: {
        margin: 10,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#aeb0af',
        padding: 10,
        width: '94%',
        color: '#333'
    },
    button: {
        backgroundColor: '#6C63FF',
        padding: 15,
        width: '94%',
        alignItems: 'center',
        borderRadius: 10,
        margin: 5
    },
    buttonTxt: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#fff'
    }
})