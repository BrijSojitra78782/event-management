import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.white,
    },
    upperContainer: {
      alignItems: 'center',
      marginTop: 20,
    },
    lowerContainer: {
      flex: 1,
      flexWrap: 'nowrap',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.white,
      flexDirection: 'column',
    },
    buttonContainer: { alignItems: 'center', height: 100 },
  });
  