import { View } from "react-native"
import { CameraView } from "expo-camera"
import { ThemedText } from "@/components/ThemedText"
import { qrScannerStyle } from "./QRScanner.styles"


/**
 * QRScanner is a component that displays a camera view and overlays a view with dashed corners, 
 * on top of the camera view. When the QR code is read, the onSuccess callback is called.
 * If the QR read fails, onFailure callback is called.
 * 
 * @param onSuccess called when QR is successfully read
 * @param onFailure called when QR read fails
 * @returns a View component with a CameraView and a View with dashed corners
 */
export default function QRScanner({ onSuccess, onFailure }: { onSuccess: (tag:string) => void, onFailure: () => void }) {

  return (
    <View style={qrScannerStyle.container}>
      <CameraView style={qrScannerStyle.camera} facing='back' onBarcodeScanned={(value) => { onSuccess(value) }} >
        <View style={qrScannerStyle.overlay}>
          <View style={qrScannerStyle.topLeft} />
          <View style={qrScannerStyle.topRight} />
          <View style={qrScannerStyle.bottomLeft} />
          <View style={qrScannerStyle.bottomRight} />
        </View>
      </CameraView>
      <View style={qrScannerStyle.messageBox}>
        <ThemedText style={{ fontSize: 14, textAlign: 'center', color: 'black' }}>Place camera in centre of QR and
          wait till QR is scanned.</ThemedText>
      </View>
    </View>
  )
}
