import { type ReactNode } from 'react';
import { type ViewProps } from "react-native";
import { View } from 'react-native';

type BaseCard = ViewProps & {
    children: ReactNode
}

export default  function BaseCard({ style, children }: BaseCard) {
    return(
        <View style={style}>
            {children }
        </View>
    )
}