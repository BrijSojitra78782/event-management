import { useRef, useEffect, type ReactNode } from 'react';
import { Animated, Pressable, TouchableOpacity, View } from "react-native";

import bottomSheetStyles from './BottomSheet.styles';
import { ThemedText } from '@/components/ThemedText';

type BottomSheet = {
    children: ReactNode,
    closeModal: () => void,
}

export default function BottomSheet({ children, closeModal} : BottomSheet) {
    const slide = useRef(new Animated.Value(300)).current;

    const slideUp = () => {
        // Will change slide up the bottom sheet
        Animated.timing(slide, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
    };
    
    const slideDown = () => {
        // Will slide down the bottom sheet
        Animated.timing(slide, {
            toValue: 300,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };


    useEffect(() => {
        slideUp()
    })

    const close = () => {
        slideDown();
        closeModal();   
    }

    return(
        <Pressable onPress={ close } style={bottomSheetStyles.backdrop}>
            <Pressable style={bottomSheetStyles.bottomSheetWrapper}>
                <Animated.View style={[bottomSheetStyles.bottomSheet, { transform: [{ translateY: slide }] }]}>
                    {children}

                    <TouchableOpacity 
                        onPress={close}
                    >
                        <View style={bottomSheetStyles.cancelButtonWrapper}>
                            <ThemedText style={bottomSheetStyles.cancelButtonText}>
                                Cancel
                            </ThemedText>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </Pressable>
        </Pressable>
    )
}

