/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';
const placeHolderTintDark = '#8A959F';
const placeHolderTintLight = '#8A959F';
const btnBackgroundEnable = '#8B4FF2';
const btnBackgroundDisable = '#BF9EF8';
const welcomeLabel = '#333333';
const inputLabel = '#1E1E1E';
const loginTextColor = 'rgba(135, 56, 237, 1)';
const inputText = '#BCC4CC';
const passwordVisibleIcon = '#9E96AC';
const loginPageLoader = '#0000ff';

export const Colors = {
  passwordVisibleIcon: passwordVisibleIcon,
  inputText: inputText,
  loginTextColor: loginTextColor,
  inputLabel: inputLabel,
  welcomeLabel: welcomeLabel,
  btnBackgroundEnable: btnBackgroundEnable,
  btnBackgroundDisable: btnBackgroundDisable,
  loginPageLoader:loginPageLoader,
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    borderColor: '#151718',
    placeHolderTint: placeHolderTintLight,
    iconGray: 'gray'
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    borderColor: '#fff',
    placeHolderTint: placeHolderTintDark,
    iconGray: 'gray'
  },
  primary:{
    background:'#8C5AE1',
    text:'#fff',
    gradient:'#E4D7FF'
  },
  label:{
    text: '#1E1E1E',
    background: '#000',
    tint: tintColorDark
  },
  lightPrimaryBg:{
    background:'#F9F5FF',
    border:'#BCC4CC'
  },
  primaryButton:{
    background:'#8B4FF2',
    text:'#fff',
  },
  popupContent:{
    background:'#',
    text:'#8B4FF2'
  },
  primaryDropdown:{
    inputBg:'#ccc',
  },
  red:'#FF0000',
  black:'#000',
  white:'#fff',
  success:'#228B22',
  lightBlue: '#F6F3FC',
  blue: '#4354EF',
  lightGray: '#D9D9D9',
  lightPurple: '#9E96AC',
  gray:'#808080',
};
