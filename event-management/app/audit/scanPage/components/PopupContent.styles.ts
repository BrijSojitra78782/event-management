import { Colors } from "@/constants/Colors"
import { StyleSheet } from "react-native"

export const style = StyleSheet.create({
        popup: {
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap:10
        },
        headerContainer:{
          flexDirection:'column',
          alignItems:'center',
          gap:5
        },
        detailsContainer:{
          flexDirection:'column',
          alignItems:'center',
          backgroundColor: Colors.lightPrimaryBg.background,
          borderColor: Colors.lightPrimaryBg.border,
          padding:20,
          borderWidth:1,
          borderRadius:3,
          width:'100%'
        },
        detailsText:{
          fontSize:30,
          color: Colors.black,
          lineHeight:30
        },
        dropdownContainer: {
          flexDirection: 'column',
          alignItems: 'flex-start',
          width:'100%',
        },
        modalItem: {
          padding: 15,
        },
        modalItemText: {
          fontSize: 16,
        },
        nextButton:{
          width:'100%',
          paddingHorizontal:10,
          paddingVertical:18,
          backgroundColor: Colors.primaryButton.background,
          borderRadius:5,
          alignItems:'center'
        }
      })