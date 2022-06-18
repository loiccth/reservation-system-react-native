import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, TextInput, Image, ScrollView, ToastAndroid } from 'react-native'

const AboutUs = ({ navigation }) => {

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>About Us</Text>
            </View>

            <View style={styles.reservationInfo}>
                <Text style={{ marginBottom: 20, textAlign: 'justify' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec aliquam fermentum nunc quis scelerisque. Aliquam bibendum orci vitae placerat feugiat. Quisque sit amet dictum nisl. Fusce rutrum ut orci sed placerat. Duis pharetra venenatis purus eget hendrerit. Nunc ex sapien, ultricies non iaculis quis, tristique sed arcu. Curabitur placerat lacus sit amet mattis facilisis. Curabitur sodales nulla odio, at euismod nunc maximus sit amet. Ut varius pharetra euismod. Quisque eleifend malesuada leo facilisis vestibulum. Integer tortor felis, ornare eget vestibulum eu, placerat non sem. Nam at placerat mauris, nec mattis felis. Pellentesque lacinia massa ac metus egestas, sit amet luctus nisi rutrum. Phasellus eu nunc sollicitudin, dignissim tellus eget, fermentum risus. Duis ipsum ligula, dictum id semper non, vulputate at ligula. </Text>
                <Text style={{ marginBottom: 20, textAlign: 'justify' }}>Curabitur accumsan, justo sed hendrerit sollicitudin, elit lectus porta metus, vitae imperdiet mi nibh in nisl. Morbi interdum nisi vel augue dignissim, non pharetra massa auctor. Nulla massa massa, imperdiet a tristique vel, condimentum vitae turpis. Maecenas quis gravida ligula. Morbi interdum eu nunc in mollis. Cras tortor mi, congue quis sagittis quis, laoreet consectetur sapien. Mauris mollis, magna sit amet interdum convallis, diam tellus elementum leo, eget viverra sapien purus et tellus. </Text>
                <Text style={{ marginBottom: 20, textAlign: 'justify' }}>Vivamus elit massa, interdum quis sapien quis, faucibus condimentum ipsum. Vivamus euismod massa congue sem blandit molestie. Vestibulum at ex a quam venenatis aliquet at sit amet neque. Etiam aliquam, risus sed porta rutrum, nunc nulla placerat lacus, eget vestibulum erat mauris eget nulla. Quisque at arcu arcu. Quisque convallis lorem nec pellentesque ultrices. Suspendisse fermentum mi sit amet elit sagittis porta. Nullam nec gravida justo. Quisque mollis egestas finibus. Donec consectetur porttitor laoreet. Sed elementum nibh quam, a cursus nulla malesuada tristique. </Text>
                <Text style={{ marginBottom: 20, textAlign: 'justify' }}>Nunc pellentesque justo non vulputate fermentum. Nulla vulputate, tortor sit amet commodo hendrerit, risus purus tristique justo, eu facilisis dolor eros eget ligula. Quisque quis dui nec arcu cursus tempor nec eu augue. Phasellus consequat vestibulum neque ac gravida. Aliquam eget ipsum sed purus sagittis feugiat. Sed vel tempus purus. Vestibulum ullamcorper quam ac nunc euismod sollicitudin. Duis interdum, mi eget maximus congue, leo purus ornare tortor, eu lobortis sapien ipsum vel felis. Suspendisse felis lorem, malesuada nec sagittis eget, sagittis ac leo. Fusce at mi fermentum, laoreet enim sit amet, cursus massa. Praesent rhoncus ex eu molestie feugiat. Mauris enim erat, mattis a luctus at, mollis nec nunc. Aenean sit amet est metus. </Text>
                <Text>Praesent vel laoreet leo. Donec interdum erat quis purus pretium molestie. Suspendisse dolor ante, efficitur vel eros sed, ultricies malesuada massa. Integer non commodo massa. Nullam tristique, sem eget bibendum scelerisque, libero eros pharetra tortor, ac volutpat diam dolor quis odio. Phasellus accumsan dui in mi elementum gravida. Sed auctor vehicula lacus, suscipit luctus leo vehicula ut. Duis facilisis mi ut est congue, quis aliquam lectus sodales. Cras et est in erat convallis lacinia. Vivamus ac dui sem. Nulla pulvinar est in quam rutrum tempus. Donec interdum hendrerit diam in hendrerit. </Text>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Setting')}
                        style={{ ...styles.price, width: 140, alignItems: 'center', backgroundColor: '#393E46', borderColor: '#393E46' }}>
                        <Text style={{ color: '#EEEEEE', fontWeight: '700' }}>Okay!</Text>
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
    }
})

export default AboutUs