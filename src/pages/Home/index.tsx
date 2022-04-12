import React, { useEffect, useRef, useState } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity,
    Platform,
     } from 'react-native';
import { RectButton, ScrollView } from "react-native-gesture-handler";
import { BoxItem } from "../../components/BoxItem";
import { useNavigation } from '@react-navigation/native';
import { Perfil } from "../../components/Perfil";
import { estilo } from "./styles";
import app from "../../utils/firebase";

import * as Notifications from 'expo-notifications';

export function Home(){

    const navigation = useNavigation();

    function handleToPage(path: string){
        navigation.navigate(path as never, {} as never);
    }

    useEffect(() => {
        app
    },[]);

    return(
        <ScrollView style={{flex: 1}}>

            <View style={estilo.header}>
                <View style={estilo.top}>
                    <Perfil />
                </View>
            </View>

            <View style={estilo.boxOne}>

                <View style={estilo.boxAviso}>
                    <Text>Notificações importantes</Text>
                </View>

                <View style={estilo.contentBox}>
                    <RectButton style={{borderRadius: 18}} onPress={() => handleToPage("SaveMoney")}>
                        <BoxItem title="Save Money" icon="credit-card" />
                    </RectButton>
                    <RectButton style={{borderRadius: 18}} onPress={() => handleToPage("Faxina")}>
                        <BoxItem title="Dia de Faxina" icon="trash-alt" />
                    </RectButton>
                </View>

                <View style={estilo.contentBox}>
                    <RectButton style={{borderRadius: 18}} onPress={() => handleToPage("Tarefa")}>
                        <BoxItem title="Tarefa diaria" icon="check-square" />
                    </RectButton>
                    <RectButton style={{borderRadius: 18}} onPress={() => handleToPage("Mercado")}>
                        <BoxItem title="Lista de Mercado" icon="shopping-basket" />
                    </RectButton>
                </View>

                <View style={estilo.contentBox}>
                    <RectButton style={{borderRadius: 18}} onPress={() => handleToPage("Compras")}>
                        <BoxItem title="Lista de Compra" icon="shopping-cart" />
                    </RectButton>
                    <RectButton style={{borderRadius: 18}} onPress={() => handleToPage("Reparo")}>
                        <BoxItem title="Reparo na Casa" icon="hammer" />
                    </RectButton>
                </View>

                <View style={estilo.contentBox}>
                    <RectButton style={{borderRadius: 18}} onPress={() => handleToPage("Orcamento")}>
                        <BoxItem title="Orçamentos" icon="clipboard-list" />
                    </RectButton>
                </View>

            </View>

        </ScrollView>
    )
}