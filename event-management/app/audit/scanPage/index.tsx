import React, { useEffect, useState } from 'react';
import { View, Dimensions, Alert } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import  PrimaryPopup from '@/components/popup/PrimaryPopup';
import  ReportCards from '@/components/reportcards/ReportCards';
import  PopupContent  from './components/PopupContent';
import  QRScanner from './components/QRScanner';

import { reportsData } from './scanPage.data';
import { styles } from './scanPage.styles';


/**
 * @ScanPage is the main view for scanning QR codes.
 * It includes a QR code scanner on the top section and a ReportCards component on the bottom section.
 * When the QR code is successfully scanned, it displays a pop up with the asset details.
 * If the QR code is not successfully scanned, it displays an Alert pop up.
 * The QR code scanner requires camera permission, and if the permission is not granted, it requests the permission.
 */
export default function ScanPage() {

  const { height } = Dimensions.get('window');
  const [permission, requestPermission] = useCameraPermissions()

  const isPermissionGranted = Boolean(permission?.granted);
  const [popupVisible, setPopupVisible] = useState(true);

  useEffect(() => {
    if (!isPermissionGranted) {
      requestPermission();
    }
    else {
      Alert.alert('Permission granted');
    }
  }, [])


  return (
    <GestureHandlerRootView style={styles.container}>
      {/* top section */}
      <View style={[styles.upperContainer, { height: height / 1.7 }]}>
        <QRScanner onSuccess={() => setPopupVisible(true)} onFailure={() => setPopupVisible(false)} />
      </View>

      {/* bottom section */}
      <View style={styles.lowerContainer}>
        <ReportCards data={reportsData} />
        <View style={styles.buttonContainer}></View>
      </View>

      {/* Pop up - QR scanner Asset varified */}
      <PrimaryPopup visible={popupVisible} onClose={() => setPopupVisible(false)}>
        <PopupContent assetId={"CH-AD-CHAIR 780"} assetName={"Grey Chair"} assetType={"Office"} popupHandler={(flag) => setPopupVisible(flag)} />
      </PrimaryPopup>


    </GestureHandlerRootView>
  );
}



