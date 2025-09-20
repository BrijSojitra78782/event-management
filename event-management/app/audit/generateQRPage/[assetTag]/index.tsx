import {
    Alert,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import styles from "./generateQRPage.styles";
import { Colors } from "@/constants/Colors";
import {  Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { genearateQr, getAssetDetails } from "@/app/audit/services/assetService";
import { useToast } from "@/context/ToastContext";
import { ActivityIndicator } from "react-native-paper";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from 'expo-media-library';
import { useSession } from "@/context/UserSessionContext";
import { checkAuthError } from "@/utils/roundOff";
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import {SvgXml} from "react-native-svg";

export default function GenerateQR() {
  const backgroundColor = useThemeColor(
    { light: "white", dark: "black" },
    "background"
  );
  const [generateQR, setGenerateQR] = useState<string>("");
  // const [authPopup, setAuthPopup] = useState<boolean>(false);
  const [loading, setloading] = useState(true);
  const [assetDetail, setAssetDetails] = useState({});
  const { assetTag } = useLocalSearchParams();
  const { showToast } = useToast();
  const { token, signOut, isAdmin } = useSession();
  const router = useRouter();

  if(!isAdmin()){
    return <Redirect href="/Home" />;
  }

  async function DownloadImage() {

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Cannot save image without storage permission.');
        return;
    }

    const qrData = await genearateQr(assetTag,token,"S");

    const { uri }  = await Print.printToFileAsync({
      html :`
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        </head>
        <body>
          ${qrData.data}
        </body>
      </html>
      `
    });

    // console.log('File has been saved to:', uri);
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    return ;   
  }

  const handleCreateQr = async () => {
    // setAuthPopup(false);
    // router.replace();
    try {
      setloading(true);
      let data = await genearateQr(assetTag,token);
      setGenerateQR(data.data);
    } catch (e: any) {
      showToast({
        type: "error",
        text1: e.message,
      });
      if(checkAuthError(e)){
        signOut();
        
        router.dismissAll();
                      router.replace("/");
                  }
    } finally {
      setloading(false);
    }
  };

  const fetchAsset = async () => {
    try {
      setloading(true);
      let data = await getAssetDetails(assetTag,token);
      setAssetDetails(data.data);
    } catch (e: any) {
      showToast({
        type: "error",
        text1: e.message,
      });
      if(checkAuthError(e)){
        signOut();
        
        router.dismissAll();
                      router.replace("/");
                  }
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchAsset();
  }, []);

  return (
    <ScrollView style={{ ...styles.container, backgroundColor }}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary.background} />
      ) : (
        <ThemedView style={styles.subheading}>
          <ThemedText style={{ textTransform: "capitalize" }} type="title">
            {assetDetail.type}
          </ThemedText>
          <ThemedText type="label">{assetDetail.uniqueId}</ThemedText>
        </ThemedView>
      )}

      {generateQR && (
        <ThemedView style={styles.qr}>
          <SvgXml
          xml = {generateQR}
           width= {310}
            height= {310}
          >

          </SvgXml>
          {/* <ImageBackground
            source={{ uri: generateQR }}
            style={{ width: 310, height: 310 }}
            imageStyle ={ {resizeMode:"contain"}}
          /> */}
          {/* <ThemedView style={styles.print}>
            <Feather
              name="printer"
              size={24}
              color={Colors.primary.background}
            />
          </ThemedView> */}
          <ThemedText style={{ color: Colors.success }} type="label">
            QR Generated for Asset
          </ThemedText>
        </ThemedView>
      )}

      {!generateQR && !loading && assetDetail.uniqueId && (
        <TouchableOpacity
          onPress={handleCreateQr}
          style={{ ...styles.btn, ...styles.create }}
        >
          <ThemedText style={styles.dark}>Create QR</ThemedText>
        </TouchableOpacity>
      )}

      {generateQR && (
        <ThemedView style={styles.footerBtn}>
          <TouchableOpacity
            onPress={() => {
              DownloadImage();
            }}
            style={{ ...styles.btn, ...styles.download }}
          >
            <ThemedText style={styles.dark}>Download</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}

      {/* auth popup */}
      {/* <AuthPopup
        visible={authPopup}
        handleClose={() => {
          setAuthPopup(false);
        }}
        handleSubmit={handleCreateQr}
      /> */}
    </ScrollView>
  );
}
