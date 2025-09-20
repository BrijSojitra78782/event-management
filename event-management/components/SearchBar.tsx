import React, { useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';


export function SearchBar({ placeholder, setSearchValue , searchVal }: any) {
    return (
        <View style={styles.container}>
            <TextInput style={styles.input}
                placeholder={placeholder || "Search"}
                numberOfLines={1}
                maxLength={100}
                value={searchVal}
                onChangeText={setSearchValue}
            />
            <TouchableOpacity>
                <Ionicons name="search" size={24} color="gray" style={styles.icon} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 12,
        marginVertical: 8,
        backgroundColor: '#F3F1F7',
        borderRadius: 36,
        paddingVertical: 10,
        paddingHorizontal: 24,
    },
    icon: {
        width: 21,
        height: 21,
        color: '#1E1E1E'
    },
    input:{
       flex : 1
     }
});