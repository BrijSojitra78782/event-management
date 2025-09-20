import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ListView } from "@/components/ListView/ListView";
import styles from "./missingAssetsPage.styles";
import { useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { getRemainingAssets, getRemainingAssetsQr } from "@/app/audit/services/auditService";
import { useToast } from "@/context/ToastContext";
import { Colors } from "@/constants/Colors";
import { useSession } from "@/context/UserSessionContext";
import { checkAuthError, floorNumToString } from "@/utils/roundOff";
import { layoutStyles } from "@/app/_layout";
import Octicons from '@expo/vector-icons/Octicons';
import { Ionicons as VectorIcon } from '@expo/vector-icons';
import { useAppContext } from "@/context/AppContext";
import { shareAsync } from 'expo-sharing';
import * as FileSystem from "expo-file-system";


export default function MissingAssets() {
  const search = useLocalSearchParams();
  const { showToast } = useToast();
  const height = useMemo(() => {
    return Dimensions.get("window").height;
  }, []);
  const limit = Math.ceil(height / 100) + 2;
  const { auditId, typeId, typeName } = search;
  const [missingAssets, setMissingAssets] = useState([]);
  const [loading, setloading] = useState(true);
  const [page, setpage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setrefreshing] = useState(false);
  const { token, signOut, isAdmin } = useSession();
  const { setLoading } = useAppContext();

  const router = useRouter();
  const navigation = useNavigation();

  const downloadMissingAssetsQr = async () => {
    try {
      setLoading(true);
      let data = await getRemainingAssetsQr(auditId, typeId, token);
      const pdf = data.data;
      const tempUri = FileSystem.cacheDirectory + "temp.pdf";
      // Write Base64 to file
      await FileSystem.writeAsStringAsync(tempUri, pdf, { encoding: FileSystem.EncodingType.Base64 });
      await shareAsync(tempUri, { UTI: "com.adobe.pdf", mimeType: 'application/pdf' });

    } catch (e: any) {
      showToast({ type: "error", text1: e.message });
      setHasMore(false);
      if (checkAuthError(e)) {
        signOut();
        router.dismissAll();
        router.replace("/");
      }
    } finally {
      setLoading(false);
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Remaining Assets',
      headerTitleAlign: 'center',
      headerLeft: () => (
        <TouchableOpacity
          style={layoutStyles.backButton}
          onPressIn={() => router.back()}
        >
          <VectorIcon name="chevron-back" size={24} color={Colors.primary.background} />
        </TouchableOpacity>
      ),
      headerRight: () => (!(!isAdmin() || (missingAssets.length == 0 && !loading)) ?
        <TouchableOpacity
          style={layoutStyles.backButton}
          onPressIn={() => {
            Alert.alert(
              'Confirm Download',
              'You are about to download QR for all remaining assets in this category',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  style: 'default',
                  text: "Ok",
                  onPress: () => {
                    downloadMissingAssetsQr()
                  }
                }
              ],
            )
          }}>
          <Octicons name="download" size={24} color={Colors.primary.background} />
        </TouchableOpacity> : null
      )
    });
  }, [navigation,missingAssets,loading]);

  const fetchRemainngAsset = async (page: number) => {
    try {
      setloading(true);
      const result = await getRemainingAssets(auditId, typeId, page, limit, token);
      // console.log(result.data)
      if (result.data && result.data.length == 0) {
        setHasMore(false);
      }
      if (page == 1) {
        setMissingAssets(result.data);
      } else {
        setMissingAssets((pre) => [...pre, ...result.data]);
      }
    } catch (error: any) {
      showToast({ type: "error", text1: error.message });
      setHasMore(false);
      if (checkAuthError(error)) {
        signOut();

        router.dismissAll();
        router.replace("/");
      }
    } finally {
      setloading(false);
      setrefreshing(false);
    }
  };

  const endReach = () => {
    if (hasMore && !refreshing && !loading) {
      setpage(page + 1);
      // NOTE : do not use function version of setState here , as it skips some page when endReach is called multiple times in single render
      // and react batches the update 
      // Example 
      // page = 4
      // calling endReach -> page => page + 1 , that makes page = 5, but before the next render , endReach is again called so react batches this
      // calling endReach -> page => page + 1 , now page = 6, so now in the next render page will be 6 ( page 5 is skipped )
    }
  };

  const handleRefresh = () => {
    fetchRemainngAsset(1);
    setMissingAssets([]);
    setpage(1);
    setrefreshing(true);
    setHasMore(true);
  };

  useEffect(() => {
    fetchRemainngAsset(page);
  }, [page]);

  return (
    <ThemedView style={{flex:1}}>

        {!loading && !missingAssets.length ?  
          <View style={styles.emptyState}>
            <ThemedText type="label">No remaining {typeName}</ThemedText>
          </View> : 
          <>
          <ThemedView style={styles.headerContainer}>
            <ThemedText type="label">Assets</ThemedText>
            {isAdmin() && <ThemedText type="label">Create QR</ThemedText>}
          </ThemedView>
          <FlatList
          onEndReachedThreshold={1}
          data={missingAssets}
          onEndReached={endReach}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          renderItem={({ item }) => (
            <ListView
              isDisabled={true}
              title={item.uniqueId}
              subtitle={item.type}
              description={floorNumToString(item.floor)}
              icon="qrcode"
              tileClickEvent={() => { }}
              generateQrEnable={isAdmin()}
            />
          )}
          ListFooterComponent=
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary.background} />
      ) : null}
        />
      </>
        }
    </ThemedView>
  );
}
