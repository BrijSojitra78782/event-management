import { Colors } from '@/constants/Colors';
import { StyleProp, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal:10
  },
  popupContainer: {
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 10,
    width: '100%',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});