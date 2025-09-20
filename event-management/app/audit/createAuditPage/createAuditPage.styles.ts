import { StyleSheet } from 'react-native';
import { Colors } from "@/constants/Colors";

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    subtitle: {
        textAlign: 'center',
        padding: 8
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    input: {
        marginBottom: 24
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
    btn: {
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        backgroundColor: Colors.primaryButton.background
    },
});