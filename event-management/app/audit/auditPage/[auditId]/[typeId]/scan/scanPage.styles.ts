import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      backgroundColor: Colors.white,
    },
    upperContainer: {
      alignItems: 'center',
    },
    lowerContainer: {
      flexWrap: 'nowrap',
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: Colors.white,
      flexDirection: 'column',
    },
    buttonContainer: { alignItems: 'center', height: 100 },
  });
  