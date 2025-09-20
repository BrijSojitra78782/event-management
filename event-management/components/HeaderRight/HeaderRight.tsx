import { TouchableOpacity } from 'react-native';

import Entypo from '@expo/vector-icons/Entypo';

type HeaderRight = {
    onClick: () => void,
}

export default function HeaderRight({ onClick}: HeaderRight) {
    return(
        <TouchableOpacity onPressIn={onClick}>
            <Entypo name="dots-three-vertical" size={24} color="#666666" />
        </TouchableOpacity>
    )
}