import React, { useEffect } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity,
    SafeAreaView,
     } from 'react-native';
import { Header } from "../../components/Header";
import { estilo } from "./styles";

export function Orcamentos(){
    return (
        <SafeAreaView>
            <Header titulo="Orçamentos" action="Home"/>

        </SafeAreaView>
    )
}