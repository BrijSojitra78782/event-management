import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    cardsContainer: {
        flexDirection: 'row',
        flexWrap: "wrap",
    },
    card: {
        width: "50%",
        padding: 8
    },
    visibleCard: {
        // backgroundColor:"whitesmoke",
        boxShadow: "0 0px 2px 0 rgba(0, 0, 0, 0.5), 0 4px 6px 0 rgba(0, 0, 0, 0.2) ",
        borderRadius: 10,
        padding: 12
    },
    count: {
        color: Colors.primary.background
    },
    link: { flexDirection: "row", alignItems: "center" },
    notFound: {
        flex:1,
        justifyContent: "center",
        alignItems: "center"
    }
});