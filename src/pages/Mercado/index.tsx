import React, { useEffect } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity,
    SafeAreaView,
     } from 'react-native';
import { Header } from "../../components/Header";
import { estilo } from "./styles";

export function Mercado(){
    return (
        <SafeAreaView>
            <Header titulo="Lista para Mercado" action="Home"/>

        </SafeAreaView>
    )
}