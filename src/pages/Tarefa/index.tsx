import React, { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    SafeAreaView,
    FlatList,
     } from 'react-native';

import { doc, query, addDoc, collection, getDocs, getDoc, orderBy, getFirestore, where } from "firebase/firestore";

import { Header } from "../../components/Header";
import { estilo } from "./styles";
import { theme } from "../../global/style/theme";
import moment from "moment";
import { ScrollView } from "react-native-gesture-handler";
import { CheckBox } from "../../components/CheckBox";

export function Tarefa(){

    const [radioPropsConta, setRadioPropsConta] = useState([])

    const diaAtual = moment().locale('pt').format('DD')

    const db = getFirestore();
    const keyGenerator = () => '_' + Math.random().toString(36).substr(2, 9);

    async function gerarListaConta() {
        const datas = [] as any;
        const q = query(collection(db, "users", "11979589357", "savemoney", "transaction", "faxina"), 
                        where("dia", "==", diaAtual)
                        )

        const querySnapshot = await getDocs(q)

        querySnapshot.forEach((doc) => {
            var title = doc.data()
            datas.push(title)
        });     

        setRadioPropsConta(datas)                        
    }

    useEffect(() => {
        gerarListaConta()    
    },[])

    return (
        <SafeAreaView style={{flex:1}}>
            <View style={estilo.conatainer}>

                <Header titulo="Tarefa Diaria" action="Home"/>

                {radioPropsConta.length > 0 ? 
                    <FlatList 
                        data={radioPropsConta} 
                        keyExtractor={keyGenerator}
                        renderItem={({item}) => (
                            <CheckBox 
                                data={item}
                            />
                        ) }
                        contentContainerStyle={{ paddingBottom: 90 }}
                        showsVerticalScrollIndicator={false}
                    />     
                :
                    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                        <Text style={{fontFamily: theme.fonts.title700, color: theme.colors.overlay, fontSize:18 }}>Nehuma tarefa diária</Text>
                    </View>
                }
                                     

            </View>
        </SafeAreaView>
    )
}