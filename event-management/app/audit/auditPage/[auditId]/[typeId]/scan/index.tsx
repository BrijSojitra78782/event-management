import React, { useEffect, useState } from 'react';
import { View, Dimensions, Alert, Vibration } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import PrimaryPopup from '@/components/popup/PrimaryPopup';
import ReportCards from '@/components/reportcards/ReportCards';
import PopupContent from './components/PopupContent';
import QRScanner from './components/QRScanner';

import { styles } from './scanPage.styles';
import { getAuditSummary, validateAssetInAudit } from '@/app/audit/services/auditService';
import { useToast } from '@/context/ToastContext';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { ReportsData } from '@/app/audit/auditPage/auditPage.data';
import { getAssetDetails } from '@/app/audit/services/assetService';
import { useSession } from '@/context/UserSessionContext';
import { checkAuthError } from '@/utils/roundOff';


/**
 * @ScanPage is the main view for scanning QR codes.
 * It includes a QR code scanner on the top section and a ReportCards component on the bottom section.
 * When the QR code is successfully scanned, it displays a pop up with the asset details.
 * If the QR code is not successfully scanned, it displays an Alert pop up.
 * The QR code scanner requires camera permission, and if the permission is not granted, it requests the permission.
 */
export default function ScanPage() {
  const [isQrCaptureEnabled, setIsQrCaptureEnabled] = useState(true);
  const { height } = Dimensions.get('window');
  const [permission, requestPermission] = useCameraPermissions()
  const { showToast } = useToast();
  const isPermissionGranted = Boolean(permission?.granted);
  const [popupVisible, setPopupVisible] = useState(false);
  const search = useLocalSearchParams();
  const [scannedTag, setScannedTag] = useState("");
  const [assetDetails, setAssetDetails] = useState({});
  const { token, signOut } = useSession();
  const router = useRouter();

  const { auditId, typeId, typeName: typeName } = search;

  var [summary, setSummary] = useState({
    total_asset: 0,
    completed: 0,
    in_use: 0,
    in_maintenance: 0,
    in_stock: 0,
    scrap: 0,
  });

  useEffect(() => {
    if (!isPermissionGranted) {
      requestPermission();
    }
    else {
      Alert.alert('Permission granted');
    }
  }, [])

  useEffect(() => {
    setIsQrCaptureEnabled(!popupVisible);
  }, [popupVisible])

  const fetchAuditSummary = async () => {
    try {
      let data = await getAuditSummary(auditId, typeId, token);
      setSummary(data.data);
    } catch (e: any) {
      showToast({
        type: "error",
        text1: e.message,
      });
      if (checkAuthError(e)) {
        signOut();

        router.dismissAll();
        router.replace("/");
      }
    }
  };

  const fetchAsset = async () => {
    try {
      let tag = encodeURI(scannedTag);
      let data = await getAssetDetails(tag, token);
      await validateAssetInAudit(auditId, data.data.id, token)
      setAssetDetails(data.data);
      setPopupVisible(true)
    } catch (e: any) {
      showToast({
        type: "error",
        text1: e.message,
      });
      if (checkAuthError(e)) {
        signOut();

        router.dismissAll();
        router.replace("/");
      }
    }
  }

  let reportsData = ReportsData.map((report) => {
    return {
      ...report,
      count:
        report.value == "remaining"
          ? summary["total_asset"] - summary["completed"]
          //@ts-ignore
          : summary[report.value],
    };
  });

  useEffect(() => {
    fetchAuditSummary();
  }, []);

  useEffect(() => {
    if (scannedTag) {
      fetchAsset();
    }
  }, [scannedTag])

  const handlePopupClose = () => {
    setPopupVisible(false);
    setScannedTag("");
  }

  return (
    <View style={styles.container}>
      {/* top section */}
      <View style={[styles.upperContainer, { height: height / 2 }]}>
        {isQrCaptureEnabled && <QRScanner onSuccess={(qr: any) => {
          try {
            let data = JSON.parse(qr.data);
            if (data.type == typeId) {
              setScannedTag(data.tag)
            } else {
              setIsQrCaptureEnabled(false);
              Vibration.vibrate(200);

              Alert.alert("Invalid type", `Please scan a valid QR code of type ${typeName}`, [
                { text: 'OK', onPress: () => setIsQrCaptureEnabled(true) },
              ]);
            }
          } catch (e) {
            setIsQrCaptureEnabled(false);
            Vibration.vibrate(200);
            Alert.alert("Error", "Invalid QR scanned",
              [
                { text: 'OK', onPress: () => setIsQrCaptureEnabled(true) },
              ]
            );
          }
        }} onFailure={() => setPopupVisible(false)} />
        }
      </View>

      {/* bottom section */}
      <View style={styles.lowerContainer}>
        <ReportCards data={reportsData} />
        <View style={styles.buttonContainer}></View>
      </View>

      {/* Pop up - QR scanner Asset varified */}
      <PrimaryPopup visible={popupVisible} onClose={handlePopupClose}>
        <PopupContent id={assetDetails.id} assetId={assetDetails.uniqueId} assetName={assetDetails.type} assetType={"Office"} popupHandler={(flag) => {
          setPopupVisible(flag);
          setScannedTag("");
        }} />
      </PrimaryPopup>

    </View>
  );
}



