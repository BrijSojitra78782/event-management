import { StyleSheet } from 'react-native';

const homeStyles = (props?:any) => StyleSheet.create({
    homeHeaderWrapper: { 
        width:'100%', 
        height:40, 
        marginTop: 10, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 30
    },
    homeHeaderContainer: {
        flex:2, 
        flexDirection: 'row', 
        alignItems:'center'
    },
    profileName: {
        marginLeft: 10, 
        fontSize: 14,
        color: '#fff',
    },
    screenBackground: {
        flex: 1
    },
    screenWrapper: {
        paddingLeft:20,
        paddingRight: 20,
        marginTop: props.headerHeight,
    },
    logoutImage: {
        width: 36,
        height: 36,
    },
    profileImageContainer: {
        width:36,
        height: 36
    },
    profileImage: {
        borderRadius:50
    },
    screenText: {
        fontSize: 24, 
        fontWeight:'800', 
        marginBottom: 100,
        color: '#fff'
    },
    screenHighlightedText: {
        fontSize:40,
        color: '#fff'
    },
    cardWrapper: {
        flex: 1, 
        flexDirection: 'row', 
        flexWrap:'wrap'
    },
    cardContainer: {
        width: props.cardWidth,
        height: props.cardHeight,
        borderRadius: 10,
        marginRight:'8%',
        marginBottom:40,
        backgroundColor: '#ffffff',
        padding: 10,
        boxShadow: '0 2 13 0 rgba(34, 20, 52, 0.6)',
    },
    cardImage: {
        width: 90,
        height: 90,
        borderRadius: '50%',
        position:'absolute',
        right:10,
        top: -30
    },
    cardTextContainer: {
        flex:1,
        flexDirection:'column',
        justifyContent:'flex-end'
    },
    cardMainText: {
        color:'#000000',
        fontSize: 18
    },
    cardSubText: {
        color:'#7c7c7c',
        fontSize: 13,
        lineHeight: 20
    },
    cardLastText: {
        color:'#000000', 
        fontSize: 13, 
        lineHeight: 20
    }

})

export default homeStyles;