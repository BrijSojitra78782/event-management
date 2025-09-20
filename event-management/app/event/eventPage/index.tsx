import React, { useState, useMemo, useCallback } from "react";
import { FlatList, ActivityIndicator, RefreshControl, Dimensions, View, Text, Modal, TextInput, Button } from "react-native";
import { SearchBar } from "@/components/SearchBar";
import { ThemedView } from '@/components/ThemedView';
import styles from './eventPage.style';
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Colors } from '@/constants/Colors';
import Debounce from "lodash.debounce";
import { useToast } from "@/context/ToastContext";
import { checkAuthError, formateDate } from "@/utils/roundOff";
import { ThemedText } from "@/components/ThemedText";
import { useSession } from "@/context/UserSessionContext";
import { getEvents, createEvents } from "../services/eventServices";
import { Menu } from 'react-native-paper';
import { Platform } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Alert, TouchableOpacity } from 'react-native';
import { sendQR, resendQR } from "../services/eventServices";

export const statusValueToText = {
    "COMPLETED":"Completed",
    "ON_GOING":"On going",
    "NOT_STARTED":"Not started"
};

export default function Events() {
    const {showToast} = useToast();
    const height = useMemo(() => {
        return Dimensions.get('window').height;
    }, [])
    const [formData, setFormData] = useState({ name: '' });
    const [refresh, setRefresh] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>([]);
    const [search, setSearch] = useState<string>('');
    const limit = Math.ceil(height / 100) + 2;
    const { token,signOut } = useSession();
    const params = useLocalSearchParams();
    const [modalVisible, setModalVisible] = useState(false);
    const [nameError, setNameError] = useState<string>('');
    const [menuVisible, setMenuVisible] = useState<string | null>(null);
    const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number } | null>(null);

    const fetchEvents = async (searchVal: string, isRefreshing = false) => {
        if (isRefreshing) setRefresh(true);
        // detecting wether it is because of refocus
        try {
            const result = await getEvents(searchVal, token);
            setData((prevData: any) => (result.data ));
        } catch (error: any) {
            setData([]);
            showToast({type:"error",text1: error.message});
            if(checkAuthError(error)){
                signOut();
                router.dismissAll();
                router.replace("/");
            }
        } finally {
            setLoading(false);
            setRefresh(false);
        }
    };

     useFocusEffect(
        useCallback(()=>{
            debounceFetchdata(search);
        },[search])
      );
    
    const debounceFetchdata = useCallback(
        Debounce((search: string) => {
            fetchEvents(search);
        }, 500), []);


    const handleRefresh = () => {
        setData([]);
        setLoading(true);
        fetchEvents(search, true);
    };

    const renderItem = ({ item }: { item: any }) => (
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
        <Text style={{ color: '#22c55e', flex: 1 }}>{item.name}</Text>
        <Menu
          visible={menuVisible === item.id}
          onDismiss={() => setMenuVisible(null)}
          anchor={
            <TouchableOpacity onPress={() => setMenuVisible(item.id)} style={{ marginLeft: 'auto' }}>
              <AntDesign style={{ transform: [{ rotate: '90deg' }] }} name="ellipsis1" size={24} color="#888" />
            </TouchableOpacity>
          }
        >
          <Menu.Item onPress={() => { router.push('/event/scanQRPage'); setMenuVisible(null); }} title="Scan QR" />
          <Menu.Item onPress={() => { router.push('/event/uploadFile'); setMenuVisible(null); }} title="Upload File" />
          <Menu.Item onPress={() => { sendQR(token); setMenuVisible(null); }} title="Send QR" />
          <Menu.Item onPress={() => { resendQR(token); setMenuVisible(null); }} title="Re-send QR" />
        </Menu>
      </View>
    );

    React.useEffect(() => {
        if (params.openNewItemModal === "true") {
          setModalVisible(true);
          router.setParams({ openNewItemModal: undefined }); // Reset param
        }
      }, [params.openNewItemModal]);

    const handleSubmit = async () => {
      if (!formData.name.trim()) {
        setNameError('Name is required');
        return;
      }
      setNameError('');
      try {
        const response = await createEvents(formData, token);
        console.log(response);
        setData(prev => [...prev, response.data]); // Update list
        setModalVisible(false);
        setFormData({ name: '' });
      } catch (error) {
        setModalVisible(false);
      }
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedView><SearchBar setSearchValue={(val: any) => {
                setSearch(val);
                setData([]);
                setLoading(true);
                // debounceFetchdata();
            }}
                searchVal={search} /></ThemedView>
                {data && data.length ==0 && !loading  ?  <View style={styles.notFound}>
                  <ThemedText type="subtitle">No Events Found</ThemedText>
                </View>:  <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                refreshControl={<RefreshControl
                    refreshing={refresh}
                    onRefresh={handleRefresh} />}
                ListFooterComponent={loading ? <ActivityIndicator size="large" color={Colors.primary.background} /> : null}
            />}
            <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000099' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
            <TextInput
              placeholder="Name"
              value={formData.name}
              onChangeText={text => {
                setFormData({ ...formData, name: text });
                if (text.trim()) setNameError('');
              }}
              style={{ marginBottom: 10, borderBottomWidth: 1 }}
            />
            {nameError ? (
              <Text style={{ color: 'red', marginBottom: 8 }}>{nameError}</Text>
            ) : null}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button title="Submit" onPress={handleSubmit} />
              <Button title="Cancel" color="red" onPress={() => {
                setModalVisible(false);
                setFormData({ name: ''});
              }} />
            </View>
          </View>
        </View>
      </Modal>
        </ThemedView>
    );
}