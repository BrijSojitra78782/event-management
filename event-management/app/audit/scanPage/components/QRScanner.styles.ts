import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

const borderWidth = 4;
const cornerSize = 80;
export const qrScannerStyle = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
        height: '100%',
    },
    camera: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.black,
        alignContent: 'center',
        aspectRatio: 1,
        width: '80%',
        borderRadius: 10,
        margin: 10
    },
    squareBorder: {
        borderColor: Colors.red,
        borderWidth: 2,
        aspectRatio: 1,
        width: '80%',
        height: '80%',
        position: 'absolute',
        top: '10%',
        left: '10%',
        backgroundColor: 'transparent',
        borderRadius: 0,
    },
    messageBox: {
        backgroundColor: Colors.lightPrimaryBg.background,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        width: '80%',
        borderRadius: 4,
        paddingVertical: 5,
        paddingHorizontal: 50,
        margin: 10
    },
    overlay: {
        position: 'absolute',
        width: '80%',
        aspectRatio: 1,
    },
    topLeft: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: cornerSize,
        height: cornerSize,
        borderTopWidth: borderWidth,
        borderLeftWidth: borderWidth,
        borderColor: Colors.red,
    },
    topRight: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: cornerSize,
        height: cornerSize,
        borderTopWidth: borderWidth,
        borderRightWidth: borderWidth,
        borderColor: Colors.red,
    },
    bottomLeft: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: cornerSize,
        height: cornerSize,
        borderBottomWidth: borderWidth,
        borderLeftWidth: borderWidth,
        borderColor: Colors.red,
    },
    bottomRight: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: cornerSize,
        height: cornerSize,
        borderBottomWidth: borderWidth,
        borderRightWidth: borderWidth,
        borderColor: Colors.red,
    },
})