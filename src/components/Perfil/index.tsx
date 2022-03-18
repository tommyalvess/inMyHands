import React from "react";
import {
    Image,
    Text, 
    View 
} from 'react-native';
import { Avatar } from "../Avatar";

import { estilo } from "./styles";



export function Perfil() {
    return(
        <View style={estilo.container}>
            
            <Avatar urlsImage="https://github.com/tommyalvess.png" />

            <View>
                <View style={estilo.user}>

                    <Text style={estilo.greeting}>
                        Olá,
                    </Text>

                    <Text style={estilo.username}>
                        Tom
                    </Text>

                </View>

            </View>

        </View>
    )
}