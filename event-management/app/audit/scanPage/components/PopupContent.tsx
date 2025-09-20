import { useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import PrimaryDropdown from "@/components/dropdown/PrimaryDropdown";

import { style } from './PopupContent.styles';
import { Colors } from "@/constants/Colors";
import { dropDownItems } from "@/constants/Types";

/**
 * A popup component that displays a form to mark an asset as in use, in stock, in maintenance, or scrap it.
 * 
 * @param assetName - The name of the asset.
 * @param assetId - The id of the asset.
 * @param assetType - The type of the asset.
 * @param popupHandler - A function that closes the popup when the user clicks the next button.
 * 
 * @returns A React component.
 */
export default function PopupContent({ assetName, assetId, assetType, popupHandler }: { assetName: string, assetId: string, assetType: string, popupHandler: (flag: boolean) => void }) {
  const [selectedItem, setSelectedItem] = useState<dropDownItems | null>(null);



  const handleValueChange = (value: dropDownItems) => {
    setSelectedItem(value);
  };

  const handleNextButton = () => {
    if (!selectedItem) {
      Alert.alert('Please select an item')
      return
    }
    popupHandler(false)
    // TODO: handle api call here
    //api code should be in different file / module
  }

  const dropdownItems = [
    { value: 'In use', color: Colors.black },
    { value: 'In stock', color: Colors.black },
    { value: 'In maintainance', color: Colors.black },
    { value: 'Scrap it', color: Colors.red },
  ];
  return (
    <View style={style.popup}>
      <View style={style.headerContainer}>
        <MaterialCommunityIcons name="check-decagram" size={60} color={Colors.success} />
        <ThemedText style={{ color: Colors.success }}>Asset Matched!</ThemedText>
      </View>
      <View style={style.detailsContainer}>
        <ThemedText style={style.detailsText}>
          {assetName}
          <ThemedText style={{ ...style.detailsText, color: Colors.popupContent.text }}>({assetType})</ThemedText>
        </ThemedText>
        <ThemedText style={{ ...style.detailsText, fontWeight: 'light', fontSize: 15 }}>{assetId}</ThemedText>
      </View>

      <View style={style.dropdownContainer}>

        <PrimaryDropdown
          items={dropdownItems}
          placeholder="Select a status"
          selectedValue={selectedItem}
          onValueChange={handleValueChange}
          label="Mark the asset"
        />

      </View>
      <TouchableOpacity style={style.nextButton} onPress={() => { handleNextButton() }}>
        <ThemedText style={{ color: Colors.white, fontSize: 20 }}>Next</ThemedText>
      </TouchableOpacity>
    </View>
  )
}

