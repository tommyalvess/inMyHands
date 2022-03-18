import React, { useEffect } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity,
    SafeAreaView,
     } from 'react-native';
import { Header } from "../../components/Header";
import { estilo } from "./styles";

export function Reparo(){
    return (
        <SafeAreaView>
            <Header titulo="Reparo na casa" action="Home"/>

        </SafeAreaView>
    )
}