import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Card } from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons'

const ComplexCard = ({ complex, navigation }) => {
    return (
        <Card style={styles.card} elevation={10}>
            <TouchableOpacity onPress={() => navigation.navigate('Details', { complex })}>
                <Card.Cover resizeMethod='resize' style={styles.cover} source={{ uri: complex.images[0] }} />
                <View style={styles.text}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.name}>{complex.name}</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text>
                                <Ionicons name='location-outline' size={20} style={{ color: '#00ADB5' }} /> {complex.location.split(', ')[0]}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text>Category: </Text>
                        <Text style={{ padding: 3, paddingRight: 7, paddingHorizontal: 10, borderWidth: 1, borderColor: '#393E46', color: '#393E46', borderRadius: 50 }}>{complex.category}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                        <Text>Depth: </Text>
                        <Text style={{ padding: 3, paddingRight: 7, paddingHorizontal: 10, borderWidth: 1, borderColor: '#393E46', color: '#393E46', borderRadius: 50 }}>{complex.depth}M</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text><Ionicons name='pricetags-outline' size={20} style={{ color: '#00ADB5' }} /> </Text>
                        {complex.tags.map(tag =>
                            <Text key={tag} style={{ margin: 3, padding: 3, paddingRight: 7, paddingHorizontal: 10, borderWidth: 1, borderColor: '#393E46', color: '#393E46', borderRadius: 50 }}>{tag}</Text>
                        )}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text>Vaccination required: </Text>
                        <Text style={{ marginTop: 1 }}>{complex.vaccinationRequired ? <Ionicons name='checkmark-circle-outline' size={25} style={{ color: '#2ed62b' }} /> :
                            <Ionicons name='alert-circle-outline' size={25} style={{ color: '#d62b2b' }} />}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Card>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        margin: 10
    },
    cover: {
        backgroundColor: 'white'
    },
    name: {
        fontSize: 16,
        fontWeight: '700'
    },
    text: {
        marginHorizontal: 10,
        marginBottom: 5,
        marginTop: 5
    }
})

export default ComplexCard