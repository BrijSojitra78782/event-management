import { TextInput, type TextInputProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedInputTextProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedInputText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedInputTextProps) {
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'borderColor');
  const text = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  return (
    <TextInput
      style={[
        { color: text, borderColor },
        type === 'default' ? styles.default : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    height: 57,
    borderWidth: 1,
    borderColor: '#BCC4CC',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 4
  }
});
