import React from "react";

import {
    Image,
    Text, 
    View 
} from 'react-native';

import { estilo } from "./styles";
import { theme } from "../../global/style/theme";

type Props = {
    urlsImage: string,
}

export function Avatar({urlsImage}: Props) {

    const {secondary50,secondary70} = theme.colors;

    return(
        <View
            style={[estilo.container, {backgroundColor: secondary50}]}
        >

            <Image
                source={{uri: urlsImage}}
                style={estilo.avatar}
            />

        </View>
    )
}