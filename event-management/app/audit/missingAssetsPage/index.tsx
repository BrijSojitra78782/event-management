import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from "@/components/ThemedText";
import { ListView } from "@/components/ListView/ListView";
import styles from './missingAssetsPage.styles';

export default function MissingAssets() {
    return (
        <>
            <ThemedView style={styles.headerContainer}>
                <ThemedText type="label">Assets</ThemedText>
                <ThemedText type="label">Create QR</ThemedText>
            </ThemedView>
            <FlatList
                data={[{ name: "CH-AD-CHAIR 780", type: "Chair Grey" },
                { name: "CH-AD-Table 2380", type: "Grey Table" },
                { name: "CH-AD-Charger 7980", type: "Lenovo Charger" },
                { name: "CH-AD-Ca-Chair 1100", type: "Canteen Chair" },
                { name: "CH-AD-CHAIR 333", type: "Chair Grey" },
                ]}
                renderItem={({ item }) => (
                    <ListView
                        title={item.name}
                        subtitle={item.type}
                        icon="qrcode"
                        tileClickEvent={() => {}}
                    />
                )}
            />
        </>
    );
}