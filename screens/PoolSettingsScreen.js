import React from 'react'
import { StyleSheet, Text, View, Button, Platform, StatusBar, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import illustration from '../assets/undraw_Beach_rvmg.png'
import { Ionicons } from '@expo/vector-icons'
import { Card } from 'react-native-paper'
import { UserContext } from '../contexts/UserContext'

const PoolSettingsScreen = ({ navigation }) => {
    const { user } = React.useContext(UserContext)

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Pool Settings</Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <Image source={illustration} style={styles.illustration} />
            </View>

            <View style={styles.settingTabs}>
                <Card style={styles.tabContainer} elevation={10}>
                    <TouchableOpacity style={styles.test} onPress={() => navigation.navigate('AddPool')}>
                        <View style={{ flex: 4, justifyContent: 'center', padding: 10 }}>
                            <Text style={{ fontSize: 16, fontWeight: '700' }}>Add Pool</Text>
                        </View>
                        <View style={{ flex: 1, alignSelf: 'flex-end', alignItems: 'flex-end', padding: 5 }}>
                            <Ionicons name='arrow-forward-circle-outline' size={30} style={{ color: '#00ADB5' }} />
                        </View>
                    </TouchableOpacity>
                </Card>
                <Card style={styles.tabContainer} elevation={10}>
                    <TouchableOpacity style={styles.test} onPress={() => navigation.navigate('EnableDisablePool')}>
                        <View style={{ flex: 4, justifyContent: 'center', padding: 10 }}>
                            <Text style={{ fontSize: 16, fontWeight: '700' }}>Update/Remove Pool</Text>
                        </View>
                        <View style={{ flex: 1, alignSelf: 'flex-end', alignItems: 'flex-end', padding: 5 }}>
                            <Ionicons name='arrow-forward-circle-outline' size={30} style={{ color: '#00ADB5' }} />
                        </View>
                    </TouchableOpacity>
                </Card>
                <Card style={styles.tabContainer} elevation={10}>
                    <TouchableOpacity style={styles.test} onPress={() => navigation.navigate('EnableDisablePool')}>
                        <View style={{ flex: 4, justifyContent: 'center', padding: 10 }}>
                            <Text style={{ fontSize: 16, fontWeight: '700' }}>Enable/Disable Pool</Text>
                        </View>
                        <View style={{ flex: 1, alignSelf: 'flex-end', alignItems: 'flex-end', padding: 5 }}>
                            <Ionicons name='arrow-forward-circle-outline' size={30} style={{ color: '#00ADB5' }} />
                        </View>
                    </TouchableOpacity>
                </Card>
                <Card style={styles.tabContainer} elevation={10}>
                    <TouchableOpacity style={styles.test} onPress={() => navigation.navigate('AddRemoveCategory')}>
                        <View style={{ flex: 4, justifyContent: 'center', padding: 10 }}>
                            <Text style={{ fontSize: 16, fontWeight: '700' }}>Add/Remove category</Text>
                        </View>
                        <View style={{ flex: 1, alignSelf: 'flex-end', alignItems: 'flex-end', padding: 5 }}>
                            <Ionicons name='arrow-forward-circle-outline' size={30} style={{ color: '#00ADB5' }} />
                        </View>
                    </TouchableOpacity>
                </Card>
                <Card style={styles.tabContainer} elevation={10}>
                    <TouchableOpacity style={styles.test} onPress={() => navigation.navigate('UpdateHourSlots')}>
                        <View style={{ flex: 4, justifyContent: 'center', padding: 10 }}>
                            <Text style={{ fontSize: 16, fontWeight: '700' }}>Update hour slots</Text>
                        </View>
                        <View style={{ flex: 1, alignSelf: 'flex-end', alignItems: 'flex-end', padding: 5 }}>
                            <Ionicons name='arrow-forward-circle-outline' size={30} style={{ color: '#00ADB5' }} />
                        </View>
                    </TouchableOpacity>
                </Card>
                <Card style={styles.tabContainer} elevation={10}>
                    <TouchableOpacity style={styles.test} onPress={() => navigation.navigate('Report')}>
                        <View style={{ flex: 4, justifyContent: 'center', padding: 10 }}>
                            <Text style={{ fontSize: 16, fontWeight: '700' }}>End of day report</Text>
                        </View>
                        <View style={{ flex: 1, alignSelf: 'flex-end', alignItems: 'flex-end', padding: 5 }}>
                            <Ionicons name='arrow-forward-circle-outline' size={30} style={{ color: '#00ADB5' }} />
                        </View>
                    </TouchableOpacity>
                </Card>
            </View>
        </ScrollView>
    )
}

export default PoolSettingsScreen

const styles = StyleSheet.create({
    container: {
        padding: 0,
        flex: 1,
        backgroundColor: '#fff',
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
    illustration: {
        width: 270,
        height: 200,
    },
    settingTabs: {
        paddingHorizontal: 10,
        marginTop: 30
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