import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import { styles } from './PrimaryDropdown.style';
import { ThemedText } from '../ThemedText';
import { dropDownItems, DropdownProps } from '@/constants/Types';
import { Colors } from '@/constants/Colors';


/**
 * A dropdown component that displays a list of items in a modal.
 *
 * @prop {string[]} items - An array of strings to display in the dropdown.
 * @prop {string} placeholder - The text to display when no item is selected.
 * @prop {string | null} selectedValue - The currently selected item.
 * @prop {function(value: string): void} onValueChange - Called when the user selects an item from the dropdown.
 * @prop {string} [label] - An optional label to display above the dropdown.
 *
 * @example
 * <Dropdown
 *   items={['option 1', 'option 2', 'option 3']}
 *   placeholder="Select an option"
 *   selectedValue="option 1"
 *   onValueChange={(value) => console.log(value)}
 *   label="Select an option"
 * />
 */
const PrimaryDropdown: React.FC<DropdownProps> = ({
  items,
  placeholder,
  selectedValue,
  onValueChange,
  label
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Toggles the visibility of the dropdown modal
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  // Handle item selection from the dropdown
  const handleItemSelect = (item: dropDownItems) => {
    onValueChange(item);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        activeOpacity={1}
        style={styles.input}
        onPress={toggleModal}
      >
        <View style={styles.inputText}>
        <ThemedText style={{color: selectedValue?.color ?? Colors.black}}>{selectedValue?.label || placeholder}</ThemedText>
          <Octicons name="triangle-down" size={24} color={Colors.lightPrimaryBg.border} />
        </View>
      </TouchableOpacity>

      {/* Modal to display the dropdown list */}
      {modalVisible && (
        <View style={styles.dropdown}>
          <FlatList
            data={items}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.modalItem}
                onPress={() => handleItemSelect(item)}
              >
                <ThemedText style={{...styles.modalItemText, color: item.color ?? Colors.black}}>{item.label}</ThemedText>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};


export default PrimaryDropdown;
