import React, { useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Menu } from 'react-native-paper';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import styles from './listView.styles';
import { Routes } from '@/constants/Routes';
import { downloadReport, updateAudit } from '@/app/audit/services/auditService';
import { useToast } from '@/context/ToastContext';
import * as FileSystem from "expo-file-system";
import { StorageAccessFramework } from 'expo-file-system';
import { useAppContext } from '@/context/AppContext';
import { useSession } from '@/context/UserSessionContext';
import { checkAuthError } from '@/utils/roundOff';

//import Icon from 'react-native-vector-icons/FontAwesome'; // Make sure you've installed this

export function ListView({ isDisabled, title, auditId, subtitle, description, status, total, remaining, icon, tileClickEvent, auditSubmitted , generateQrEnable }: any) {
    const [menuVisibleIndex, setMenuVisibleIndex] = useState<boolean>(false); // Track the menu's visibility by index
    const {showToast} = useToast();
    const colorScheme = useColorScheme();
    // Function to show/hide the menu
    const openMenu = () => setMenuVisibleIndex(true);
    const closeMenu = () => setMenuVisibleIndex(false);

    const {setLoading} = useAppContext();
    const { token, signOut } = useSession();
    

    const handleDownload = async () =>{            
        try {
            setLoading(true);
            const {contentType,data,fileName} = await downloadReport(auditId,token);            

            const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
            if (!permissions.granted) {
                return;
            }
    
            const fileOnDeviceURI = await FileSystem.StorageAccessFramework.createFileAsync(
                permissions.directoryUri,
                fileName,
                contentType
            );

            await FileSystem.writeAsStringAsync(fileOnDeviceURI, data, {
                encoding: FileSystem.EncodingType.Base64,
            });
          
            showToast({
                type:"success",
                text1:'Audit report saved successfully!'
            })
        
        } catch (error) {
            console.error("Error downloading report:", error);
            Alert.alert('Error', 'Failed to download the report.');
            if(checkAuthError(error)){
                signOut()      
        router.dismissAll();
                            router.replace("/");
                        }
        }finally{
            closeMenu();
            setLoading(false)
        }
            
    }

    const submitAudit = async (auditId: string) => {
        try {
            const response = await updateAudit(auditId, "COMPLETED",token);
            showToast({
                type:"success",
                text1 :  `Successfully submitted audit : ${response.data.name}`
            })
        } catch (error: any) {
            showToast({
                type: "error",
                text1: error.message,
            })
            if(checkAuthError(error)){
                signOut();

                
        router.dismissAll();
                            router.replace("/");
                        }
        }
        setMenuVisibleIndex(false);
        auditSubmitted();
    };

    return (
        <TouchableOpacity disabled={isDisabled} onPress={tileClickEvent}>
            <ThemedView style={styles.container}>
                <ThemedView style={styles.header}>
                    <ThemedView style={styles.detail}>
                        <ThemedText type='subtitle' style={styles.title}>{title}</ThemedText>
                        <ThemedText type='label' style={styles.date}>{subtitle}</ThemedText>
                        {description && <ThemedText type='label' style={{color:"#229038"}}>{description}</ThemedText>}
                    </ThemedView>
                    {icon === "ellipsis1" ? <Menu
                        visible={menuVisibleIndex} // Only show the menu for the clicked item
                        onDismiss={closeMenu}
                        anchor={
                            <TouchableOpacity style={{padding:3}}>
                                <AntDesign name={icon} style={{ transform: [{ rotate: '90deg' }] }} size={24} color={colorScheme === 'dark' ? 'white' : 'black'} onPress={() => openMenu()} />
                            </TouchableOpacity>
                        }
                    >
                       {status != "Completed" && <Menu.Item onPress={()=>submitAudit(auditId)} title="Submit the Audit" />}
                        <Menu.Item onPress={handleDownload} title="Download" />
                        {/* <Menu.Item onPress={() => {
                            closeMenu();
                        }} title="Print" /> */}
                    </Menu> : generateQrEnable && <TouchableOpacity style={{padding:10}} onPress={() => router.push(`${Routes.generateQR}/${title}`)}>
                        <AntDesign name={icon} size={24} color={colorScheme === 'dark' ? 'white' : 'black'}  />
                    </TouchableOpacity>}
                </ThemedView>
                {status && <ThemedView style={styles.statusContainer}>
                    <ThemedText type='label' style={{ ...styles.pending, color: status === "Completed" ? "#229038" : "#F2784F" }}>{status}</ThemedText>
                    <ThemedView style={styles.numbersContainer}>
                        <ThemedText type='label' style={styles.total}>Total: <ThemedText type='label' style={styles.number}>{total}</ThemedText></ThemedText>
                        <ThemedText type='label' style={styles.remaining}>Remaining: <ThemedText type='label' style={styles.remainingNumber}>{remaining}</ThemedText></ThemedText>
                    </ThemedView>
                </ThemedView>}
            </ThemedView>
        </TouchableOpacity>
    );
};
