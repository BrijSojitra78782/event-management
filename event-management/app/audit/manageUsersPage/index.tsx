import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, RefreshControl, TouchableOpacity, View, } from "react-native";
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from "@/components/ThemedText";
import Debounce from "lodash.debounce";
import { useSession } from "@/context/UserSessionContext";
import { useToast } from "@/context/ToastContext";
import { router, useFocusEffect, useNavigation } from "expo-router";
import { checkAuthError } from "@/utils/roundOff";
import { Colors } from "@/constants/Colors";
import { SearchBar } from "@/components/SearchBar";
import styles from './manageUsersPage.style';
import { layoutStyles } from "../../_layout";
import Ionicons from '@expo/vector-icons/AntDesign';
import AddUserPopup from "@/components/AddUserPopup/AddUserPopup";
import { createUser, deleteUser, getUsers, updateUser } from "@/app/audit/services/userService";
import { Divider, List, Menu } from "react-native-paper";
import AntDesign from "@expo/vector-icons/AntDesign";


export default function manageUsers() {
    const [addUserPopup, setAddUserPopup] = useState<boolean>(false);
    const { showToast } = useToast();
    const [popupError, setPopuperror] = useState<string>("");
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
    const { token, signOut, getUserEmail } = useSession();
    const navigation = useNavigation();
    const fetchUsers = async (pageNo: number, searchVal: string, isRefreshing = false) => {
        if (isRefreshing) setRefresh(true);
        else if (!hasMore) return;

        // detecting wether it is because of refocus
        if (pageNo > 1 || (pageNo == 1 && data.length == 0)) {
            setLoading(true); // if refocus
        }
        try {
            const result = await getUsers(pageNo, limit, searchVal, token);
            if (result.data && result.data.length < limit) {
                setHasMore(() => { return false; });
                // No more data to load
            }
            setData((prevData: any) => (pageNo === 1 ? result.data : [...prevData, ...result.data]));
        } catch (error: any) {
            setData([]);
            setHasMore(false);
            showToast({ type: "error", text1: error.message });
            if (checkAuthError(error)) {
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
        useCallback(() => {
            debounceFetchdata(search);
        }, [search])
    );
    const debounceFetchdata = useCallback(
        Debounce((search: string) => {
            setPage(1);
            // setData([]);
            setHasMore(true);
            fetchUsers(1, search);
        }, 500), []);

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPage(prevPage => {
                const nextPage = prevPage + 1;
                fetchUsers(nextPage, search);
                return nextPage;
            });
        }
    };

    const handleRefresh = () => {
        setPage(1);
        setData([]);
        setLoading(true);
        setHasMore(() => true);
        fetchUsers(1, search, true);
    };
    const handleSubmit = async (email: string, isAdmin: boolean) => {
        try {
            await createUser(email, isAdmin, token);
            handleRefresh();
        } catch (error: any) {
            showToast({ type: "error", text1: error.message });
        } finally {
            setAddUserPopup(false);
        }
    };
    const handleDeleteUser = async (email: string) => {
        try {
            await deleteUser(email, token);
            handleRefresh();
        } catch (error: any) {
            showToast({ type: "error", text1: error.message });
        }
    };
    const updateUserRole = async (email: string, isAdmin: boolean) => {
        try {
            await updateUser(email, isAdmin, token);
            handleRefresh();
        } catch (error: any) {
            showToast({ type: "error", text1: error.message });
        }
    };
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={layoutStyles.backButton}
                    onPressIn={() => {
                        setAddUserPopup(true);
                    }}>
                    <Ionicons name="pluscircleo" size={24} color={Colors.primary.background} />
                </TouchableOpacity>
            )
        });
    }, [navigation]);
    const [visibleMenuId, setVisibleMenuId] = useState<string | null>(null);
    const openMenu = (id: string) => setVisibleMenuId(id);
    const closeMenu = () => setVisibleMenuId(null);

    const ListComponent = ({ item }: { item: any }) => {
    
        return (
            <>
                <List.Item
                    style={styles.ListContainer}
                    title={item.email}
                    titleStyle={styles.title}
                    titleEllipsizeMode="tail"
                    description={item.isAdmin ? 'Admin' : 'Non Admin'}
                    descriptionStyle={item.isAdmin ? styles.adminText : styles.nonAdminText}
                    right={item.email !== getUserEmail() ?
                        () => (
                        <Menu
                            visible={visibleMenuId === item.id}
                            onDismiss={closeMenu}
                            anchor={
                                <TouchableOpacity style={{padding:3}}>
                                    <AntDesign name="ellipsis1" style={{ transform: [{ rotate: '90deg' }] }} size={24} color='black' onPress={() => openMenu(item.id)} />
                                </TouchableOpacity>
                            }
                        >
                            <Menu.Item
                                onPress={() => {
                                    closeMenu();
                                    updateUserRole(item.email,!item.isAdmin);
                                }}
                                title={item.isAdmin ? "Revoke Access" : "Grant Access"}
                            />
                            <Divider />
                            <Menu.Item
                                onPress={() => {
                                    closeMenu();
                                    handleDeleteUser(item.email);
                                }}
                                title="Delete"
                            />
                        </Menu>
                    ) : undefined }
                />
            </>
        )
    }
    return (
        <>
            <ThemedView style={styles.container}>
                <ThemedView><SearchBar setSearchValue={(val: any) => {
                    setSearch(val);
                    setData([]);
                    setLoading(true);
                }}
                    searchVal={search} /></ThemedView>
                {data.length == 0 && !loading && !hasMore ? <View style={styles.notFound}>
                    <ThemedText type="subtitle">No User Found</ThemedText>
                </View> : <FlatList
                    data={data}
                    keyExtractor={(item) => item.id}
                    renderItem={ListComponent}
                    onEndReached={handleLoadMore}
                    refreshControl={<RefreshControl
                        refreshing={refresh}
                        onRefresh={handleRefresh} />}
                    ListFooterComponent={loading ? <ActivityIndicator size="large" color={Colors.primary.background} /> : null}
                />}
            </ThemedView>
            <AddUserPopup
                visible={addUserPopup}
                handleClose={() => {
                    setAddUserPopup(false);
                }}
                handleSubmit={handleSubmit}
                labelText="Create User"
                descText="Enter user email and admin role to create a new user for audit purposes"
                error={popupError}
                setError={setPopuperror}
            />
        </>
    );
}


