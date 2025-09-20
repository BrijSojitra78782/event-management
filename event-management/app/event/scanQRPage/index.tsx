import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanningResult } from 'expo-camera/build/Camera.types';

export default function ScanQRPage() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState<string>('');
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = (result: BarCodeScanningResult) => {
    if (!scanned) {
      setScanned(true);
      setQrData(result.data);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={handleBarCodeScanned}
        barCodeScannerSettings={{ barCodeTypes: ['qr'] }}
      />
      {scanned && (
        <View style={{ position: 'absolute', top: 50, left: 0, right: 0, alignItems: 'center' }}>
          <Text>QR Data: {qrData}</Text>
          <TouchableOpacity onPress={() => { setScanned(false); setQrData(''); }} style={{ marginTop: 20, backgroundColor: 'green', padding: 10, borderRadius: 5 }}>
            <Text style={{ color: 'white' }}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
