import { Colors } from "@/constants/Colors"
import { StyleSheet } from "react-native"

export const cardStyle = StyleSheet.create({
    gridContainer: {
      flexDirection: 'column',
      flexWrap: 'nowrap',
      // justifyContent: 'space-between',
      width: '100%',
      padding: 20,
      paddingBottom: 4,
      // height:'30%',
      // overflow:"scroll"
    },
    cell: {
      width: '33%',
    },
    contentLeft: {
      padding: 5,
      paddingHorizontal: 10,
      alignItems: 'flex-start',
      textAlign:'right'
    },
    contentRight: {
      padding: 5,
      paddingHorizontal: 10,
      alignItems: 'flex-end',
      textAlign:'left'
    },
    title: {
      fontSize: 12,
      fontWeight: 'light',
      color: Colors.gray,
      width:'100%',
    },
    count: {
      fontSize: 23,
      fontWeight: 'bold',
      marginTop: 2,
      color: Colors.black
    },

  })