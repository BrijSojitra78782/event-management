import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const reportChart = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginTop: 50,
    },
    heading: {
      color: Colors.black,
      fontSize: 15,
      marginBottom: 15,
      paddingLeft : 16,
      paddingRight : 16
    },
    chartContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: Colors.black,
      fontSize: 18,
      position: 'absolute',
    },
    circularSection: {
      
      backgroundColor: 'white',
      borderRadius: 75, // Half of width or height to make it circular
      shadowColor: Colors.primary.background, // Purple color for the glow
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8, // Adjust the opacity for a stronger glow
      shadowRadius: 10, // Radius for the shadow to make the glow effect wider
      elevation: 15, // Adds a stronger shadow on Android
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: Colors.primary.background,
    },
    score: {
      fontSize: 40,
      color: Colors.primary.background,
      // fontFamily:'Poppins',
      // borderWidth: 1,
    },
    label: {
      fontSize: 13,
      lineHeight: 24,
      color: Colors.black,
    },
    chartMatrix: {
     flexDirection:'row',
     alignItems:'center',
     marginTop:20
    },
    coloredBoxContainer: {
      flexDirection:'row',
      alignItems:'center',
      marginHorizontal:20
    },
    coloredBox: {
      width:20, aspectRatio:1, borderRadius:5, margin: 5, boxShadow: '0 0px 4px rgba(0, 0, 0, 0.2)'
    }
  });
