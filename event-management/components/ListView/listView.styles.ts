import { StyleSheet } from 'react-native';
import { Colors } from "@/constants/Colors";

export default StyleSheet.create({
    container: {
        // height: 100,
        flexDirection: 'column', // Flexbox direction set to column
        alignItems: 'flex-start', // Align items at the start of the cross-axis
        paddingVertical: 8,// Padding inside the container   
        opacity: 0.8, // Set opacity
        borderBottomWidth: 1, // Border bottom thickness
        borderBottomColor: Colors.lightGray, // Border bottom color
        flexGrow: 0, // Prevent the container from growing
        paddingHorizontal: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 0,
        alignSelf: 'stretch',
        flexGrow: 0,
    },
    detail: {
        flexDirection: 'column', // Layout children vertically
        alignItems: 'flex-start', // Align items at the start of the cross-axis
        padding: 0, // No padding
        flexGrow: 0, // Prevent the container from growing
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
    ellipsis: {
        color: '#666666', // Background color
        flexGrow: 0,// Prevent the element from growing
    },

    date: {
        fontStyle: 'normal', // Normal font style
        fontWeight: '400', // Regular font weight
        fontSize: 13, // Font size
        lineHeight: 20, // Line height matching the box height
        textAlignVertical: 'center', // Align text vertically
        // color: '#000000', // Text color
        opacity: 0.5, // Set text opacity
        flexGrow: 0, // Prevent the element from growing
        alignSelf: 'stretch',
        textTransform:"capitalize"
    },
    statusContainer: {
        flexDirection: 'row', // Layout items in a row
        justifyContent: 'space-between', // Space between items
        alignItems: 'flex-end', // Align items to the bottom
        padding: 0, // No padding
        flexGrow: 0, // Prevent the element from growing
        alignSelf: 'stretch', // Stretch to fill the parent's width (if applicable)
    },
    pending: {
        marginHorizontal: 'auto', // Center horizontally (React Native does not support `margin: 0 auto`)
        fontStyle: 'normal', // Normal font style
        fontWeight: '600', // Semi-bold font weight
        fontSize: 12, // Font size
        lineHeight: 18, // Line height matching the box height
        textAlignVertical: 'center', // Align text vertically
        flexGrow: 1, // Allow the text to grow within the layout
    },
    numbersContainer: {
        flexDirection: 'column', // Layout items in a column
        justifyContent: 'center', // Center items vertically
        alignItems: 'flex-end', // Align items to the end horizontally
        padding: 0, // No padding
        marginHorizontal: 'auto', // Center horizontally
        flexGrow: 1, // Allow the element to grow within the layout
        marginRight: 10
    },
    total: {
        fontStyle: 'normal', // Normal font style
        fontWeight: '500', // Medium font weight
        fontSize: 12, // Font size
        lineHeight: 18, // Line height matching box height
        textAlign: 'center', // Center text horizontally
        textAlignVertical: 'center', // Center text vertically
        color: Colors.lightPurple, // Text color
        flexGrow: 0, // Prevent growth within layout4
    },
    remaining: {
        fontStyle: 'normal', // Normal font style
        fontWeight: '500', // Medium font weight
        fontSize: 12, // Font size
        lineHeight: 18, // Line height matching box height
        textAlign: 'center', // Center text horizontally
        textAlignVertical: 'center', // Center text vertically
        color: Colors.lightPurple, // Text color
        flexGrow: 0, // Prevent growth within layout
    },
    number: {
        fontWeight: 'bold',
        color: Colors.blue
    },
    remainingNumber: {
        fontWeight: 'bold',
        color: Colors.red,
    },
    button: {
        height: 100,
        width: 100,
        backgroundColor: Colors.red,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: { color: Colors.white },
});