import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import PrimaryPopup from '../popup/PrimaryPopup';
import { ThemedText } from '../ThemedText';
import { Colors } from '@/constants/Colors';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import styles from '@/assets/styles/styles';
import { Checkbox } from 'react-native-paper';
type AddUserPopupProps = {
    visible: boolean;
    handleClose: () => void;
    handleSubmit: (email: string, isAdmin: boolean) => Promise<void>;
    labelText: string;
    descText: string;
    error: string;
    setError: (error: string) => void;
};

const AddUserPopup: React.FC<AddUserPopupProps> = ({ visible, handleClose, handleSubmit, descText, labelText, error, setError }) => {
    return (
        <PrimaryPopup visible={visible} onClose={() => {
            setError("");
            handleClose();
        }}>
            <PopupContent onSubmit={handleSubmit} descText={descText} labelText={labelText} error={error} setError={setError} />
        </PrimaryPopup>
    );
};

const PopupContent: React.FC<{ onSubmit: (email: string, isAdmin: boolean) => Promise<void>, descText: string, labelText: string, error: string, setError: (error: string) => void }> = ({ onSubmit, descText, labelText, error, setError }) => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [admin, setAdmin] = useState<boolean>(false);
    const validateEmail = () => {
        const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+[0-9]*@(?:google\.com)$/;
        if (!emailRegex.test(email)) {
            setError("Enter a valid Email Address");
            return false;
        }
        return true;
    };
    const handleSuccess = async () => {
        if (validateEmail()) {
            setLoading(true);
            await onSubmit(email, admin);
            setLoading(false);
        }
    }
    return (
        <GestureHandlerRootView style={pageStyle.overlay}>
            <View style={pageStyle.contentContainer}>
                <ThemedText style={{ textAlign: 'center', color: Colors.black }}>{descText}</ThemedText>
            </View>
            <View style={pageStyle.inputContainer}>
                <ThemedText type="title" style={styles.inputLable}>
                    Email
                </ThemedText>
                <TextInput
                    style={{...styles.input, marginBottom: 0}}
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    placeholder="Enter your email here"
                    placeholderTextColor={Colors.light.placeHolderTint}
                />
            {error && <ThemedText style={pageStyle.errorText}>{error}</ThemedText>}
            </View>
            <View style={pageStyle.checkbox}>
                <Checkbox
                 onPress={()=>{setAdmin(!admin)}}
                 status={admin ? 'checked' : 'unchecked'}
                />
                <ThemedText style={{...styles.inputLable, marginBottom:0}}>
                    Admin access
                </ThemedText>
            </View>
            <TouchableOpacity style={pageStyle.nextButton} onPress={handleSuccess} disabled={isLoading}>
                {isLoading ?
                    <ActivityIndicator color={Colors.loginPageLoader} /> :
                    <ThemedText style={{ color: Colors.white, fontSize: 20 }}>Submit</ThemedText>
                }
            </TouchableOpacity>
        </GestureHandlerRootView>
    );
};

export default AddUserPopup;

const pageStyle = StyleSheet.create({
    errorText: {
        color: 'red',
        fontSize: 14,
        fontWeight: 500
    },
    checkbox: {
        flexDirection: 'row',
        width:'100%',
        alignItems: 'center',
    },
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
        flexDirection: 'column',
        width: '100%',
        paddingHorizontal: 10,
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
    },
    resendLink: {
        alignSelf: 'flex-end'
    }
});