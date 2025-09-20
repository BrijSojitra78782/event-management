import { StyleSheet } from 'react-native';
import { Colors } from "@/constants/Colors";

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 24
    },
    create: {
        backgroundColor: Colors.primaryButton.background,
        width: '100%'
    },
    download: {
        backgroundColor: Colors.primaryButton.background
    },
    share: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: Colors.primaryButton.background
    },
    footerBtn: {
        display: 'flex',
        justifyContent: 'center',
        gap: 10,
        flexDirection: 'row'
    },
    subtitle: {
        textAlign: 'center',
        padding: 8
    },
    subheading: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        marginVertical: 24
    },
    qr: {
        backgroundColor: Colors.lightBlue,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        gap: 8
    },
    dark: {
        color: Colors.white
    },
    light: {
        color: Colors.primaryButton.background
    },
    btn: {
        marginTop: 8,
        width: "48%",
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4
    },
});