import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FlatList, ActivityIndicator, RefreshControl, Dimensions, Text, View } from "react-native";
import { ListView } from "@/components/ListView/ListView";
import { SearchBar } from "@/components/SearchBar";
import { ThemedView } from '@/components/ThemedView';
import styles from './assetAuditsPage.styles';
import { router, useFocusEffect } from "expo-router";
import { Colors } from '@/constants/Colors';
import Debounce from "lodash.debounce";
import { getAudits } from "@/app/audit/services/auditService";
import { useToast } from "@/context/ToastContext";
import { checkAuthError, formateDate } from "@/utils/roundOff";
import { ThemedText } from "@/components/ThemedText";
import { useSession } from "@/context/UserSessionContext";

export const statusValueToText = {
    "COMPLETED":"Completed",
    "IN_PROGRESS":"In progress",
    "PENDING":"Pending"
}

export default function AssetAudits() {
    const {showToast} = useToast();
    const height = useMemo(() => {
        return Dimensions.get('window').height;
    }, [])
    const [refresh, setRefresh] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<any>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const limit = Math.ceil(height / 100) + 2;
    const { token,signOut } = useSession();
    
    const fetchAudits = async (pageNo: number, searchVal: string, isRefreshing = false) => {
        if (isRefreshing) setRefresh(true);
        else if (!hasMore) return;

        // detecting wether it is because of refocus
        if(pageNo > 1 || (pageNo == 1 && data.length == 0)) {
            setLoading(true); // if refocus
        }
        try {
            const result = await getAudits(pageNo,limit,searchVal,token);
            if (result.data && result.data.length < limit) {
                setHasMore(() => { return false; });
                // No more data to load
            }
            setData((prevData: any) => (pageNo === 1 ? result.data : [...prevData, ...result.data]));
        } catch (error: any) {
            setData([]);
            setHasMore(false);
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
    // useEffect(() => {
    //     debounceFetchdata(search);
    // }, [search]);
    
    const debounceFetchdata = useCallback(
        Debounce((search: string) => {
            setPage(1);
            // setData([]);
            setHasMore(true);
            fetchAudits(1, search);
        }, 500), []);

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPage(prevPage => {
                const nextPage = prevPage + 1;
                fetchAudits(nextPage, search);
                return nextPage;
            });
        }
    };

    const handleRefresh = () => {
        setPage(1);
        setData([]);
        setLoading(true);
        setHasMore(() => true);
        fetchAudits(1, search, true);
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
                {data.length ==0 && !loading && !hasMore ?  <View style={styles.notFound}>
                  <ThemedText type="subtitle">No Audits Found</ThemedText>
                </View>:  <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ListView
                        auditId={item.id}
                        title={item.name}
                        subtitle={formateDate(item.start)}
                        status={statusValueToText[item.status]}
                        total={item.total}
                        remaining={item.remaining}
                        icon="ellipsis1"
                        tileClickEvent={() => { router.push({pathname:`audit/Category`,params:{auditId:item.id,name:item.name,status:item.status}}) }}
                        auditSubmitted={()=>fetchAudits(1, search, true)}
                    />
                )}
                onEndReached={handleLoadMore}
                refreshControl={<RefreshControl
                    refreshing={refresh}
                    onRefresh={handleRefresh} />}
                ListFooterComponent={loading ? <ActivityIndicator size="large" color={Colors.primary.background} /> : null}
            />}
        </ThemedView>
    );
}