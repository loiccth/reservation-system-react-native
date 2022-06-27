import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Card } from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons'
import Highlight from '../widgets/Highlight'
import HighlightAdd from '../widgets/HighlightAdd'

const ComplexCard = ({ complex, navigation }) => {
    return (
        <Card style={styles.card} elevation={10}>
            <TouchableOpacity onPress={() => navigation.navigate('Details', { complex })}>
                <Card.Cover resizeMethod='resize' style={styles.cover} source={{ uri: complex.images[0] }} />
                <View style={styles.text}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <Highlight customStyle={styles.name} attribute="name" hit={complex} />
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text>
                                <Ionicons name='location-outline' size={20} style={{ color: '#00ADB5' }} /> <HighlightAdd customStyle={{}} attribute="location" hit={complex} />
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text>Category: </Text>
                        <View style={{ ...styles.circleThingy, paddingRight: 10 }}>
                            <Highlight customStyle={styles.highlightText} attribute="category" hit={complex} />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                        <Text>Depth: </Text>
                        <View style={{ ...styles.circleThingy, paddingRight: 10 }}>
                            <Text style={styles.highlightText}>{complex.depth}M</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text><Ionicons name='pricetags-outline' size={20} style={{ color: '#00ADB5' }} /> </Text>
                        {complex.tags.map(tag =>
                            <Text key={tag} style={{ margin: 3, ...styles.circleThingy }}>{tag}</Text>
                        )}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text>Vaccination required: </Text>
                        <Text style={{ marginTop: 1 }}>{complex.vaccinationRequired ? <Ionicons name='checkmark-circle-outline' size={25} style={{ color: '#2ed62b' }} /> :
                            <Ionicons name='alert-circle-outline' size={25} style={{ color: '#d62b2b' }} />}</Text>
                    </View>
                    {complex.status === 'disable' &&
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ color: 'red', fontWeight: '700' }}>Temporarily disabled</Text>
                        </View>}
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
    },
    highlightText: {
        borderColor: '#393E46',
        color: '#393E46',
    },
    circleThingy: {
        padding: 3,
        paddingHorizontal: 10,
        paddingRight: 7,
        borderWidth: 1,
        borderColor: '#393E46',
        color: '#393E46',
        borderRadius: 50
    }
})

export default ComplexCard