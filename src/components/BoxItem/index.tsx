import React from "react";

import {
    Image,
    Text, 
    View 
} from 'react-native';

import { estilo } from "./styles";
import { theme } from "../../global/style/theme";
import {FontAwesome5} from '@expo/vector-icons'


type Props = {
    icon: any,
    title: string
}

export function BoxItem({icon, title}: Props) {


    return(
        <View
            style={[estilo.container, {backgroundColor: '#fff'}]}
        >

               <View style={estilo.avatar}>

                    <FontAwesome5  
                        name={icon}
                        color={theme.colors.heading}
                        size={40}
                    />

               </View>
                <Text
                    style={estilo.title}
                >
                    {title}
                </Text>
           
        </View>
    )
}