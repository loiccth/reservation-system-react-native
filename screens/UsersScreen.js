import React from 'react'
import {
    StyleSheet,
    View,
    Platform,
    StatusBar,
    Text,
    ScrollView,
    TouchableOpacity
} from 'react-native'
import UserList from '../components/UserList'


const UsersScreen = ({ navigation }) => {
    const [tab, setTab] = React.useState('pending')

    return (
        <ScrollView style={styles.container}>
            <View style={{ flexDirection: 'row', backgroundColor: '#3ff', height: 50 }}>
                <TouchableOpacity
                    onPress={() => setTab('pending')}
                    activeOpacity={1}
                    style={{
                        ...styles.tab,
                        backgroundColor: tab === 'pending' ? '#00ADB5' : '#393E46',
                        borderLeftWidth: 0
                    }}
                >
                    <Text style={{ ...styles.tabText, color: tab === 'pending' ? '#eee' : '#eee' }}>Pending</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setTab('rejected')}
                    activeOpacity={1}
                    style={{
                        ...styles.tab,
                        backgroundColor: tab === 'rejected' ? '#00ADB5' : '#393E46'
                    }}
                >
                    <Text style={{ ...styles.tabText, color: tab === 'rejected' ? '#eee' : '#eee' }}>Rejected</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setTab('approved')}
                    activeOpacity={1}
                    style={{
                        ...styles.tab,
                        backgroundColor: tab === 'approved' ? '#00ADB5' : '#393E46',
                        borderRightWidth: 0
                    }}
                >
                    <Text style={{ ...styles.tabText, color: tab === 'approved' ? '#eee' : '#eee' }}>Approved</Text>
                </TouchableOpacity>
            </View>

            <View>
                <UserList tab={tab} navigation={navigation} />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderLeftColor: '#eee',
        borderLeftWidth: 0.5,
        borderRightColor: '#eee',
        borderRightWidth: 0.5
    },
    tabText: {
        fontWeight: '700',
        fontSize: 16
    }
})

export default UsersScreen