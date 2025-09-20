import { ImageBackground, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import styles from './generateQRPage.styles';

export default function GenerateQR() {
    const backgroundColor = useThemeColor({ light: 'white', dark: 'black' }, 'background');

    const [generateQR, setGenerateQR] = useState<boolean>(false);

    return (
        <ScrollView style={{ ...styles.container, backgroundColor }}>

            <ThemedText type="subtitle" style={styles.subtitle}>Fill the form and add the respective details to create a QR for an asset.</ThemedText>
            <ThemedView style={styles.subheading}>
                <ThemedText type="title">Chair Grey (Ahmedabad)</ThemedText>
                <ThemedText type="label">CH-AD-CHAIR 780</ThemedText>
            </ThemedView>

            {generateQR && <ThemedView style={styles.qr}>
                <ImageBackground
                    source={require('@/assets/images/QR.png')}
                    style={{ width: 310, height: 310 }}
                />
                <ThemedText type="label">QR Generated for Asset</ThemedText>
            </ThemedView>}

            {!generateQR && <TouchableOpacity onPress={() => { setGenerateQR(true) }} style={{ ...styles.btn, ...styles.create }}>
                <ThemedText style={styles.dark}>
                    Create QR
                </ThemedText>
            </TouchableOpacity>}

            {generateQR && <ThemedView style={styles.footerBtn}>
                <TouchableOpacity onPress={() => { setGenerateQR(false) }} style={{ ...styles.btn, ...styles.download }}>
                    <ThemedText style={styles.dark}>
                        Download
                    </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setGenerateQR(false) }} style={{ ...styles.btn, ...styles.share }}>
                    <ThemedText style={styles.light}>
                        Share
                    </ThemedText>
                </TouchableOpacity>
            </ThemedView>}

        </ScrollView>
    );
}
