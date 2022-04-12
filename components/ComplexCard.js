import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Card } from 'react-native-paper'
import ComplexModal from './ComplexModal'

const ComplexCard = ({ complex }) => {
    const [modal, setModal] = React.useState(false)

    const closeModal = () => {
        setModal(false)
    }

    return (
        <Card style={styles.card} elevation={10}>
            <TouchableOpacity onPress={() => setModal(true)}>
                <Card.Cover resizeMethod='resize' style={styles.cover} source={{ uri: complex.images[0] }} />
                <View style={styles.text}>
                    <Text style={styles.name}>{complex.name}</Text>
                    <Text style={styles.address}>{complex.location}</Text>
                    <Text>Category: {complex.category}</Text>
                </View>

                <ComplexModal complex={complex} modal={modal} closeModal={closeModal} />
            </TouchableOpacity>
        </Card>
    )
}

const styles = StyleSheet.create({
    card: { backgroundColor: 'white', margin: 15 },
    cover: { backgroundColor: 'white' },
    name: { fontFamily: 'Lato_900Black' },
    address: { fontFamily: 'Oswald_400Regular' },
    text: { marginHorizontal: 20, marginBottom: 5, marginTop: 5 }
})

export default ComplexCard