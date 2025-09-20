import { StyleSheet } from 'react-native';

const bottomSheetStyles = StyleSheet.create({
    backdrop: {
        position: 'absolute',
        flex: 1,
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,0.25)',
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end'
    },
    bottomSheetWrapper: {
        width: '100%', 
        height: '40%', 
        paddingHorizontal: 10
    },
    bottomSheet: {
        flex:1,
        flexDirection:"column",
        justifyContent:"flex-end",
        paddingBottom:40,
        width: '100%',
        height: '100%',
        borderTopRightRadius: 13,
        borderTopLeftRadius: 13,
    },
    cancelButtonWrapper: {
        borderRadius: 13, 
        backgroundColor:'white', 
        marginTop: 10
    },
    cancelButtonText: {
        color:'#007AFF', 
        paddingVertical: 18, 
        fontWeight:'800', 
        textAlign:'center'
    }

})

export default bottomSheetStyles;