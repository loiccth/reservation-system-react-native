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
import AdminComplexList from '../components/AdminComplexList'


const EnableDisablePoolScreen = ({ navigation }) => {
    const [tab, setTab] = React.useState('enabled')

    return (
        <ScrollView style={styles.container}>
            <View style={{ flexDirection: 'row', backgroundColor: '#3ff', height: 50 }}>
                <TouchableOpacity
                    onPress={() => setTab('enabled')}
                    activeOpacity={1}
                    style={{
                        ...styles.tab,
                        backgroundColor: tab === 'enabled' ? '#00ADB5' : '#393E46',
                        borderLeftWidth: 0
                    }}
                >
                    <Text style={{ ...styles.tabText, color: tab === 'enabled' ? '#eee' : '#eee' }}>Enabled</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setTab('disabled')}
                    activeOpacity={1}
                    style={{
                        ...styles.tab,
                        backgroundColor: tab === 'disabled' ? '#00ADB5' : '#393E46'
                    }}
                >
                    <Text style={{ ...styles.tabText, color: tab === 'disabled' ? '#eee' : '#eee' }}>Disabled</Text>
                </TouchableOpacity>
            </View>

            <View>
                <AdminComplexList tab={tab} />
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

export default EnableDisablePoolScreen