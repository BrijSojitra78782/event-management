import { StyleSheet } from 'react-native';
import { Colors } from "@/constants/Colors";

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 24
    },
    cardWrapper: {
        display: "flex",
        flexDirection: 'column',
    },
    subtitle: {
        textAlign: 'center',
        padding: 8
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white
    },
    save: {
        color: Colors.white
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    placeholderStyle: {
        fontSize: 16,
        color: "#8A959F"
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    dropdown: {
        marginTop: 8,
        height: 57,
        borderWidth: 1,
        borderColor: '#BCC4CC',
        paddingHorizontal: 16,
        paddingVertical: 18,
        borderRadius: 4
    },
    btn: {
        marginTop: 16,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        backgroundColor: Colors.primaryButton.background
    },
    loader :{
        flex : 1,
        height:"100%",
        alignItems:'center',
        justifyContent:"center"
    }
});