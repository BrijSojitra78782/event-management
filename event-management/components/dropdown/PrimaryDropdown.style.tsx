import { StyleSheet } from "react-native"
import { Colors } from "@/constants/Colors"

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
    position: 'relative',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: Colors.label.text
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: Colors.primaryDropdown.inputBg,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  inputText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 16,
    color: Colors.black,
    width: '100%',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 3,
    zIndex: 1,
  },
  modalItem: {
    padding: 15,
    textAlign: 'left',
    borderWidth: 0.5,
    borderColor: Colors.primaryDropdown.inputBg,
    borderRadius: 2,
    backgroundColor: Colors.white
  },
  modalItemText: {
    fontSize: 16,
    color: Colors.black
  },
})
