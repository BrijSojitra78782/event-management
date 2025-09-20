import { StyleSheet } from 'react-native';

const categoryStyles = StyleSheet.create({
    screenWrapper: {
        flex: 1
    },
    text: {
        fontSize:14, 
        textAlign:'center', 
        marginTop: 25, 
        marginBottom: 20, 
        paddingHorizontal: 20
    },
    cardWrapper: {
        flex: 1, 
        flexDirection: 'row', 
        flexWrap:'wrap',
        paddingHorizontal: 20
    },
    cardContainer: {
        borderRadius: 10,
        marginBottom:40,
        backgroundColor: '#ffffff',
        paddingHorizontal: 11,
        paddingBottom: 7,
        borderWidth: 1,
        borderColor: '#BCC4CC'
    },
    cardImage: {
        width: 70,
        height: 70,
        position:'absolute',
        right:8,
        top: -25
    },
    cardTextContainer: {
        flex:1,
        flexDirection:'column',
        justifyContent:'flex-end'
    },
    cardMainText: {
        color:'#000000',
        fontSize: 15,
        textTransform:"capitalize"
    },
    cardSubText: {
        color:'#7c7c7c',
        fontSize: 13,
        lineHeight: 15
    },
    optionsContainer: {
        backgroundColor: 'rgba(245, 245, 245, 0.9)',
        borderRadius: 13
    },
    optionsWrapper: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(60, 60, 67, 0.36)'
    },
    optionText: {
        color:'#007AFF',
        paddingVertical: 18,
        textAlign:'center'
    }
})

export default categoryStyles;