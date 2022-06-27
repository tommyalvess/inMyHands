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
import moment from "moment";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { formatNumber } from "../../utils/moeda";
import { theme } from "../../global/style/theme";

export function Home(){

    const navigation = useNavigation();
    const [somaDividaAtual, setSomaDividaAtual] = useState(0);
    const [dataFinal, setDataFinal] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [faxina, setfaxina] = useState<string>('');
    const [dataPickerPrincipal, setDataPickerPrincipal] =  useState(new Date(moment().format('YYYY-MM-DDTHH:mm:ss.sssZ')));

    const database = getFirestore();

    function handleToPage(path: string){
        navigation.navigate(path as never, {} as never);
    }

    async function somarDividaAtual() {

        var mesNow = moment(dataFinal).format("MM")  
        var anoNow = moment(dataFinal).format("YYYY")
        var dividaAtual = 0;

        const result = query(collection(database, "users", "11979589357", "savemoney", "transaction", "item"),  
                    where("mes", "==", mesNow), 
                    where("ano", "==" ,anoNow), 
                    where("tipo", "==", "Despesa"),
                    where("pago", "==", false));

        const querySomaD = await getDocs(result);

        querySomaD.forEach((doc) => {
            dividaAtual += parseFloat(doc.data().valor);                      
        });

        setSomaDividaAtual(dividaAtual)
    }

    async function getTitleItem() {
        try {
            const datas = [] as any;

            var dayNow = moment(dataFinal).format("DD")  
            var mesNow = moment(dataFinal).format("MM")  
            var anoNow = moment(dataFinal).format("YYYY")

            const q = query(collection(database, "users", "11979589357", "savemoney", "transaction", "item"),  
                        where("tipo", "==", "Despesa"), 
                        where("day", "==", dayNow), 
                        where("mes", "==", mesNow), 
                        where("ano", "==" ,anoNow),
                        );

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const childData = doc.data().tag;            
                datas.push(childData);
            });

            setTitle(datas)

        } catch (error) {
            console.log("Home - getTitleItem - erro: " +error);
        }
    }

    async function temFaxina() {
        try {
            const datas = [] as any;
            var mesNow = parseInt(moment(dataPickerPrincipal).format("MM"))  
            var anoNow = parseInt(moment(dataPickerPrincipal).format("YYYY"))
            var diaNow = parseInt(moment(dataPickerPrincipal).format("DD"))          
  
            const q = query(collection(database, "users", "11979589357", "savemoney", "transaction", "faxina"),
                      where("mes","==",mesNow),
                      where("ano","==",anoNow),
                      where("dia","==",diaNow),
                      )
  
            const querySnapshot = await getDocs(q);
  
            querySnapshot.forEach((doc) => {
                const item = doc.data();            
                datas.push(item);
            });
            
            setfaxina(datas);
            //console.log("Faxina - dataOrderFilterd - data loaded");
            
        } catch (error) {
            console.log(error);
            //console.log("Faxina - dataOrderFilterd - data loaded erro");
        }
    }    

    useEffect(() => {
        app
        setDataFinal(moment().locale('pt').format('YYYY-MM-DD'))
        somarDividaAtual()
        getTitleItem()
        temFaxina()
    },[somaDividaAtual,title]);

    return(
        <ScrollView style={{flex: 1}}>

            <View style={estilo.header}>
                <View style={estilo.top}>
                    <Perfil />
                    <Text>{"\n"}</Text>
                </View>
            </View>

            <View style={estilo.boxOne}>

                <View style={estilo.boxAviso}>
                    <Text style={{fontFamily: theme.fonts.title700, color: theme.colors.primary, fontSize: 17, marginTop: 15}}>Últimas atualizações</Text>

                    {title.length != 0 && <Text style={{fontFamily: theme.fonts.title700, marginTop: 5}}>Hoje é dia de pagar  
                        <Text style={{fontFamily: theme.fonts.title700, color: theme.colors.primary}}>{title.length > 1 ? " " + title[0] + " e outos": " " + title}</Text>.
                        </Text>}

                    {faxina.length != 0 && <Text style={{fontFamily: theme.fonts.title700, marginTop: 5}}>Hoje é dia de {faxina}.</Text>}

                    {/* <Text style={{fontFamily: theme.fonts.title700, marginTop: 5}}>Hoje é dia de limpar a casa!</Text> */}

                    <View style={{flexDirection:"row", marginBottom: 15, marginTop: 5}}>
                        <Text style={{fontFamily: theme.fonts.title700}}>Seu total de dívidas pendente é </Text> 
                        <Text style={{fontFamily: theme.fonts.title700, color: theme.colors.green_dark}}>R${formatNumber(somaDividaAtual)}</Text>
                    </View>                   
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