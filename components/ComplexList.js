import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ComplexCard from './ComplexCard'

const ComplexList = ({ complexes, navigation }) => {
    return (
        <View>
            {complexes.length === 0 &&
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Oswald_400Regular', fontSize: 16 }}>
                        No complex found
                    </Text>
                </View>
            }

            {complexes.map((complex, index) =>
                <ComplexCard key={index} complex={complex} navigation={navigation} />
            )}
        </View>
    )
}

const styles = StyleSheet.create({})

export default ComplexList