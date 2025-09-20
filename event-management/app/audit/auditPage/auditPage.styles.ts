import { Colors } from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  chartContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  upperContainer: {
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  lowerContainer: {
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: Colors.white,
    flexDirection: 'column',
  },
    
    buttonContainer: { 
      alignItems: 'center',
      paddingBottom:20, 
    },
  qrButton: {
    backgroundColor: Colors.primary.background,
    borderRadius: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // For shadow on Android
    shadowColor: Colors.black, // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    aspectRatio:1,
    // position:'absolute',
    top: Platform.OS === 'ios' ? -30 : 0
  }
});


