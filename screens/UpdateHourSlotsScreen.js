import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, TextInput, Image, ScrollView, ToastAndroid } from 'react-native'
import { getFirestore, collection, getDocs, query, where, doc, getDoc, updateDoc } from 'firebase/firestore'
import { Ionicons } from '@expo/vector-icons'

const UpdateHourSlotsScreen = () => {
    const db = getFirestore()
    const [categories, setCategories] = React.useState([])

    React.useEffect(() => {
        getDoc(doc(db, 'settings', 'hours'))
            .then(res => {
                if (res.exists()) {
                    setCategories(res.data().data)
                }

            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    const addRow = () => {
        setCategories([...categories, ''])
    }

    const updateText = (i, text) => {
        let temp = [...categories]
        temp[i] = text
        setCategories(temp)
    }

    const deleteCat = (i) => {
        let temp = [...categories]
        temp.splice(i, 1)
        setCategories(temp)
    }

    const moveUp = (i) => {
        let temp = [...categories]
        const value1 = temp[i]
        temp[i] = temp[i - 1]
        temp[i - 1] = value1
        setCategories(temp)
    }

    const moveDown = (i) => {
        let temp = [...categories]
        const value1 = temp[i]
        temp[i] = temp[i + 1]
        temp[i + 1] = value1
        setCategories(temp)
    }

    const save = () => {
        updateDoc(doc(db, 'settings', 'filters'), {
            data: categories
        }).then(() => {
            ToastAndroid.show('Slots updated.', ToastAndroid.SHORT)
        })
            .catch(err => {
                console.log(err)
                ToastAndroid.show('Unexpected error.', ToastAndroid.SHORT)
            })
    }



    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Add/Remove Hour Slots</Text>
            </View>

            <View style={styles.reservationInfo}>
                <View>
                    {categories.map((category, i) =>
                        <View key={i}>
                            <View style={{ marginTop: i === 0 ? 0 : 10, flexDirection: 'row' }}>
                                <TextInput style={{ ...styles.inputText, flex: 1, marginRight: 10 }}
                                    placeholderTextColor='#c4cfce'
                                    value={category}
                                    selectionColor={'#919191'}
                                    keyboardType='ascii-capable'
                                    onChangeText={text => updateText(i, text)}
                                />
                                <TouchableOpacity disabled={i === 0 ? true : false} onPress={() => moveUp(i)}>
                                    <Ionicons name='arrow-up-circle-outline' size={35} style={{ color: i === 0 ? '#393E46' : '#00ADB5', marginHorizontal: 5 }} />
                                </TouchableOpacity>
                                <TouchableOpacity disabled={i === categories.length - 1 ? true : false} onPress={() => moveDown(i)}>
                                    <Ionicons name='arrow-down-circle-outline' size={35} style={{ color: i === categories.length - 1 ? '#393E46' : '#00ADB5', marginHorizontal: 5 }} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => deleteCat(i)}>
                                    <Ionicons name='close-circle-outline' size={35} style={{ color: '#d62b2b', marginHorizontal: 5 }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
                    <TouchableOpacity
                        onPress={addRow}
                        style={{ ...styles.price, width: 140, alignItems: 'center', backgroundColor: '#393E46', borderColor: '#393E46' }}>
                        <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Add new row</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
                    <TouchableOpacity
                        onPress={save}
                        style={{ ...styles.price, width: 140, alignItems: 'center', backgroundColor: '#00ADB5', borderColor: '#00ADB5' }}>
                        <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Save</Text>
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
    },
    inputText: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#aeb0af',
        padding: 3,
        paddingLeft: 10,
        color: '#393E46'
    }
})

export default UpdateHourSlotsScreen