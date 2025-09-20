import React, { ReactEventHandler, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, NativeSyntheticEvent, TextInputKeyPressEventData, Alert } from 'react-native';
import PrimaryPopup from '../popup/PrimaryPopup';
import { ThemedText } from '../ThemedText';
import { Colors } from '@/constants/Colors';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';


type AuthPopupProps = {
    visible: boolean;
    handleClose: () => void;
    handleSubmit: () => void;
};

const AuthPopup: React.FC<AuthPopupProps> = ({ visible, handleClose, handleSubmit }) => {
    return (
        <PrimaryPopup visible={visible} onClose={handleClose}>
            <PopupContent onSubmit={handleSubmit} />
        </PrimaryPopup>
    );
};

export default AuthPopup;


/**
 * PopupContent is a React component that renders a content of the primary popup component.
 * It is a part of the AuthPopup component.
 * 
 * @author Dev Muliya
 * @param onSubmit A function that is called when the user submits the passcode.
 * 
 * @returns A React component.
 */
const PopupContent: React.FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputs = useRef<Array<any>>([]);

    const handleChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Automatically focus the next input
        if (text && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleBackspace = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && index > 0 && !otp[index]) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleSuccess = () => {
        if(validateOtp()){
            onSubmit();
        }
        else {
            Alert.alert('Invalid Passcode');
        }
    }

    const validateOtp = () => {
        return otp.reduce((acc, digit) => acc && digit !== '', true);
    }

    return (
        <GestureHandlerRootView style={styles.overlay}>
            <View style={styles.contentContainer}>
                <ThemedText style={{ textAlign: 'center', color:Colors.black }}>Enter Passcode to confirm identity. If you are not an authorised person, avoid using this facility.</ThemedText>
            </View>
            <View style={styles.contentContainer}>
                <ThemedText style={styles.marker}>Enter Passcode</ThemedText>

                <View style={styles.inputContainer}>
                    {
                        otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                style={styles.input}
                                keyboardType="number-pad"
                                maxLength={1}
                                onChangeText={text => handleChange(text, index)}
                                onKeyPress={e => handleBackspace(e, index)}
                                ref={input => inputs.current[index] = input}
                                value={digit}
                            />
                        ))
                    }
                </View>
            </View>
            <View style={styles.contentContainer}>
                <TouchableOpacity style={styles.nextButton} onPress={handleSuccess}>
                    <ThemedText style={{ color: Colors.white, fontSize: 20 }}>Submit</ThemedText>
                </TouchableOpacity>
            </View>

        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        paddingTop: 20
    },
    contentContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        color: Colors.black
    },
    nextButton: {
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 18,
        backgroundColor: Colors.primaryButton.background,
        borderRadius: 5,
        alignItems: 'center'
    },
    inputContainer: {
        flexDirection: 'row',
    },
    marker: {
        alignSelf: 'flex-start',
        margin: 10,
        color: 'gray'
    },
    input: {
        width: 45,
        height: 70,
        padding: 10,
        borderColor: Colors.primaryDropdown.inputBg,
        borderRadius: 5,
        borderWidth: 1,
        textAlign: 'center',
        fontSize: 18,
        marginHorizontal: 5,
    }
});
