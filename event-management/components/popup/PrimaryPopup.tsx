import React from 'react';
import {styles} from './PrimaryPopup.style'
import { View, Modal, StyleSheet, TouchableWithoutFeedback, Text, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ThemedText } from '../ThemedText';
import { Colors } from '@/constants/Colors';


interface PopupContainerProps {
    visible: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    animationType?: string;
  }


/**
 * A generic popup component with white background and close.
 *
 * @param visible Whether the popup is visible or not.
 * @param onClose Function to call when the popup is closed.
 * @param children The content of the popup.
 * @param animationType The type of animation to use when opening/closing the popup. Defaults to 'fadeIn'.
 * @returns A React component.
 */
const PrimaryPopup: React.FC<PopupContainerProps> = ({ visible, onClose, children, animationType = 'fadeIn' }) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback>
        <View style={styles.overlay}>

          <CloseButton onClose={onClose}/>

          <View style={styles.popupContainer}>
            
            {children}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default PrimaryPopup;


/**
 * A button to close a popup.
 *
 * @param onClose Function to call when the button is pressed.
 * @returns A React component.
 */
const CloseButton = ({onClose}:{onClose:()=>void})=>{
  return ( <TouchableOpacity style={{alignSelf:'flex-end',}} onPress={onClose}>
    <View style={styles.closeButton}>
    <ThemedText style={{padding:5, color: Colors.white}}>
      Close
    </ThemedText>
    <AntDesign name="closecircleo" size={18} color={Colors.white} /> 
    </View>
   

</TouchableOpacity>)
}
