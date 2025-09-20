import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1
    },
    notFound: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        fontStyle: 'normal', // Normal font style
        fontWeight: '500', // Medium font weight
        fontSize: 18, // Font size
        lineHeight: 27, // Line height matching the box height
        textAlignVertical: 'center', // Align text vertically (React Native's equivalent for vertical alignment)
        // color: '#000000', // Text color
        flexGrow: 0, // Prevent the element from growing
    },
    ListContainer: {
        paddingVertical: 8,// Padding inside the container   
        opacity: 0.8, // Set opacity
        borderBottomWidth: 1, // Border bottom thickness
        borderBottomColor: Colors.lightGray, // Border bottom color
        flexGrow: 0, // Prevent the container from growing
        paddingHorizontal: 12,
        height: 80
    },
    adminText : {
        color:"#229038", 
        paddingTop:10
    },
    nonAdminText : {
        color:Colors.red, 
        paddingTop:8
    }
});