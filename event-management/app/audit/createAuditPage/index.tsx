import { TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedInputText } from '@/components/ThemedInputText';
import { useState } from 'react';
import { Redirect, router } from 'expo-router';
import styles from './createAuditPage.styles';
import { Routes } from '@/constants/Routes';
import { addAudit } from '@/app/audit/services/auditService';
import { useToast } from '@/context/ToastContext';
import { useSession } from '@/context/UserSessionContext';
import { checkAuthError } from '@/utils/roundOff';
import { ActivityIndicator } from 'react-native-paper';

export default function createAudit() {

    const [auditName, setAuditName] = useState("");
    const { showToast } = useToast();
    const { token, signOut, isAdmin } = useSession();
    const [ isLoading, setIsloading ] = useState(false);
    if (!isAdmin()) {
        return <Redirect href="/Home" />;
    }

    const handleSave = async function () {
        try {
            setIsloading(true);
            const result = await addAudit(auditName, token);
            showToast({
                type: "success",
                text1: "Audit Created"
            })
            router.back();
        } catch (e: any) {
            showToast({
                type: "error",
                text1: e.message
            })
            if (checkAuthError(e)) {
                signOut();
                router.dismissAll();
                router.replace("/");
            }
        } finally {
            setIsloading(false);
        }
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="subtitle" style={styles.subtitle}>
                Fill the form and add the respective details to create an Audit.
            </ThemedText>
            <ThemedText type="label">Audit Name</ThemedText>
            <ThemedInputText
                style={styles.input}
                onChangeText={setAuditName}
                value={auditName}
                placeholder="Enter audit name"
                placeholderTextColor="#8A959F"
            />
            <TouchableOpacity onPress={handleSave} style={{ ...styles.btn }} disabled={isLoading}>
                {isLoading ? (
                    <ActivityIndicator></ActivityIndicator>
                ) :
                    (<ThemedText style={styles.save}>
                        Save
                    </ThemedText> )}
            </TouchableOpacity>
        </ThemedView>
    );
}
