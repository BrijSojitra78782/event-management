import { type ReactNode } from 'react';
import { type ViewProps } from "react-native";
import { View } from 'react-native';

type ScreenWrapper = ViewProps & {
    children: ReactNode
}

export default  function ScreenWrapper({ style, children }: ScreenWrapper) {
    return(
        <View style={style}>
            {children }
        </View>
    )
}