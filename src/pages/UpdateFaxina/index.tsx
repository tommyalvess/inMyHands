import React, { useEffect, useState } from "react";
import { 
    View, 
    Text,
    ActivityIndicator,
    SafeAreaView,
    TouchableOpacity,
    Platform,
     } from 'react-native';
     

import * as Notifications from 'expo-notifications';
import { useNavigation, useRoute } from "@react-navigation/native";
import { schedulePushNotification } from "../../utils/notifications";
import Animated from 'react-native-reanimated';
import { ScrollView, TextInput } from "react-native-gesture-handler";
import moment from "moment";
import { addDoc, collection,doc,getDocs,getFirestore,orderBy,query, where, writeBatch } from "firebase/firestore";
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from "../../global/style/theme";
import { MaterialIcons } from '@expo/vector-icons'; 
import RadioForm from 'react-native-simple-radio-button';
import { Header } from "../../components/Header";
import { estilo } from "./styles";

export type Faxina =  {
    id: string,
    dia: string,
    mes: string,
    ano: string,
    desc: string,
    data: string,
    hora: string,
    repetir?: number,
    personalizado?:number,
  }

var radio_props_personalizado = [
{label: 'Não  ', value: 0 },
{label: '1° Dom do Mês', value: 1 },
];

var radio_props_weekdays = [
{label: 'Não ', value: 0 },
{label: 'Semanal ', value: 1 },
{label: 'Mensal ', value: 2 },
{label: 'Anual', value: 3 },
];

export function UpdateFaxina(){
    const route = useRoute();

    var itemTransaction: Faxina = route.params.item;
    const idItem = route.params.item.id;

    const [valueWeek, setValueWeek] = useState(itemTransaction.repetir)
    const [valueCustom, setValueCustom] = useState(itemTransaction.personalizado)
    const [dataPicker, setDataPicker] =  useState(new Date(moment(itemTransaction.data).format('YYYY-MM-DDTHH:mm:ss.sssZ')));
    const [time, setTime] = useState(new Date(moment(itemTransaction.hora).format('YYYY-MM-DDTHH:mm:ss.sssZ')));
    const [desc, setDesc] = useState(itemTransaction.desc);

    const isIos = Platform.OS === 'ios'

    const db = getFirestore();

    const navigation = useNavigation();


    const onChange = (event: any, selectedDate: any) => {
    
        try {
          const currentDate = selectedDate || new Date(moment().format('YYYY-MM-DDTHH:mm:ss.sssZ'))  
          
          if (event.type === 'neutralButtonPressed') {
            setDataPicker(new Date(moment().format('YYYY-MM-DDTHH:mm:ss.sssZ')));
          } else {
            setDataPicker(currentDate);    
          }
        } catch (error) {
          console.log("Erro");
        }
        
    };
    
    const onChangeTime = (event: any, selectedDate: any) => {
    
    try {
        const currentDate = selectedDate || new Date(moment().format('YYYY-MM-DDTHH:mm:ss.sssZ'))  
        
        if (event.type === 'neutralButtonPressed') {
        setTime(new Date(moment().format('YYYY-MM-DDTHH:mm:ss.sssZ')));
        } else {
        setTime(currentDate);    
        }
    } catch (error) {
        console.log("Erro");
    }
    
    };

    const handleToSave = async () => {
        var idTrans;
        var dataStore;
        var horaStore;
        var idNotification: string;
        var idNotificationNew;
        var valueRep;
        var valuePer;
        var result;

        const q = query(collection(db, "users", "11979589357", "savemoney", "transaction", "faxina"), 
                        where("id", "==", idItem));

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            result = doc.data()
            idTrans =  doc.id 
            dataStore = doc.data().data
            horaStore = doc.data().hora
            idNotification = doc.data().idNotification;
            valueRep = doc.data().repetir
            valuePer = doc.data().personalizado
        });       
        
        var dataFormatNow = moment(dataPicker).format("YYYY-MM-DD")
        var dataFormatOld = moment(dataStore).format("YYYY-MM-DD")
        var horaNow = moment(time).format("LT")
        var horaOld = moment(horaStore).format("LT")

        var dia = parseInt(moment(dataPicker, "DD-MM-YYYY").format('DD'))
        var mes = parseInt(moment(dataPicker, "DD-MM-YYYY").format('MM'))
        var ano = parseInt(moment(dataPicker, "DD-MM-YYYY").format('YYYY'))
        var data = moment(dataPicker, "DD-MM-YYYY").format('YYYY-MM-DDTHH:mm:ss.sssZ')
        var hora = parseInt(moment(time).locale('pt').format('LT').substring(0,2))
        var minutos = parseInt(moment(time).locale('pt').format('LT').substring(3,5))
        var horas = moment(time).locale('pt').format('YYYY-MM-DDTHH:mm:ss.sssZ')

        const itemTransation = doc(db, "users", "11979589357", "savemoney", "transaction", "faxina", `${idTrans}`);

        if(dataFormatNow > dataFormatOld || dataFormatNow < dataFormatOld || horaNow > horaOld || horaNow < horaOld){

            console.log("UpdateFaxina - Nova data");  
            
            await Notifications.cancelScheduledNotificationAsync(idNotification); 
            console.log("Desativou a notificação passada");

            idNotificationNew = await schedulePushNotification("Olha, o dia da faxina chegou!", "Hoje é o dia de " + desc, dia, mes, ano, hora, minutos)
            
            const batch = writeBatch(db);              

            batch.update(itemTransation, {
                desc: desc.trim(),
                dia: dia,
                mes: mes,
                ano: ano,
                data: data,
                hora: horas,
                repetir: valueWeek, 
                personalizado: valueCustom,
                idNotification: idNotificationNew
            });

            await batch.commit();
            console.log("Atualziado o lembrete: " + desc);
            navigation.navigate("Faxina" as never);
        }else{
            console.log("UpdateFaxina - Sem alteração de data ou hora");   

            const batch = writeBatch(db);              

            batch.update(itemTransation, {
                desc: desc.trim(),
                dia: dia,
                mes: mes,
                ano: ano,
                data: data,
                hora: horas,
                repetir: valueWeek, 
                personalizado: valueCustom,
            });

            await batch.commit();
            console.log("Atualziado o lembrete: " + desc);
            navigation.navigate("Faxina" as never);
        }

    }

    const test = () => {
        // if (valueRep != valueWeek || valuePer != valueCustom) {
        //     console.log("Mudou agendamento no calendario."); 

        //     //verifica se tem outro ocorrencia no calendario

        //     var count = [] as any;
        //     const q = query(collection(db, "users", "11979589357", "savemoney", "transaction", "faxina"), 
        //             where("codigo", "==", result.codigo));

        //     const querySnapshot = await getDocs(q);

        //     querySnapshot.forEach((doc) => {
        //         count.push(doc.data()) 
        //     });    
                            
        //     //Se tiver ocorrencia tem que ver se o numero e maior que o nr de ocorrencia atual
        //     //Por exemplo se encontrar 5 occorecians e mudou para 12 ou para menos, 
        //     //deleta essas 5 e add as 12

        //     if (count.lenght > 1) {
                
        //     }else{
        //     //Se não tiver ocorrencias tem que criar as novas com o codigo 

        //     }
            
        // }
    }

    useEffect(() => {},[idItem])

    return(
      
        <SafeAreaView style={estilo.modalBox}>

            <View style={{marginHorizontal: 15}}>
                <Header titulo="Atualizar do lembrete" action="Faxina" />

                <View style={{alignItems: 'center'}}>
                    <Text style={estilo.titulo}>Qual dia da faxina?</Text>
                    <View>
                        <DateTimePicker
                            testID="dateTimePicker" 
                            style={{height: 55, width: isIos ? 350 : undefined }}
                            value={dataPicker}       
                            locale="pt-br" 
                            onChange={onChange} 
                            mode="date" 
                            is24Hour
                            minimumDate={moment().format('YYYY-MM-DDTHH:mm:ss.sssZ')}
                            themeVariant="light"
                            textColor={theme.colors.secondary90}
                            display={'spinner'}                        
                        />
                    </View>

                    <Text style={estilo.titulo}>Qual horario da faxina?</Text>
                    <View>
                        <DateTimePicker
                        testID="dateTimePickerTime" 
                        style={{height: 55, width: isIos ? 350 : undefined }}
                        value={time}       
                        locale="pt-br" 
                        onChange={onChangeTime} 
                        mode="time" 
                        is24Hour
                        themeVariant="light"
                        textColor={theme.colors.secondary90}
                        display={'spinner'}
                        />
                    </View>

                    <Text style={estilo.titulo}>O que vai fazer?</Text>
                    <View style={estilo.box1}>
                        <TextInput 
                        style={{width: 300, textAlign: 'center'}}
                        autoCapitalize="words"
                        placeholderTextColor='#737380'
                        keyboardType='default'
                        returnKeyType="done"
                        onChangeText={setDesc}
                        value={desc} 
                        />
                    </View>

                    {/* <Text style={estilo.titulo}>Repetir?</Text>
                    <View style={estilo.box1}>

                        <View style={{alignSelf: 'center', justifyContent: 'center', marginTop: 5}}>
                        <RadioForm
                            initial={valueWeek}
                            radio_props={radio_props_weekdays}
                            formHorizontal={true}
                            labelHorizontal={true}
                            buttonColor={theme.colors.toggle}
                            buttonSize={10}                  
                            labelStyle={{fontFamily: theme.fonts.title700, fontSize: 15}}              
                            onPress={setValueWeek}
                        />  
                        </View>        

                    </View>

                    <Text style={estilo.titulo}>Repetição Personalizada?</Text>
                    <View style={estilo.box1}>

                        <View style={{alignSelf: 'center', justifyContent: 'center', marginTop: 5}}>
                        <RadioForm
                            initial={valueCustom}
                            radio_props={radio_props_personalizado}
                            formHorizontal={true}
                            labelHorizontal={true}
                            buttonColor={theme.colors.toggle}
                            buttonSize={10}                  
                            labelStyle={{fontFamily: theme.fonts.title700, fontSize: 15}}              
                            onPress={setValueCustom}        
                        />  
                        </View>        

                    </View> */}


                    <TouchableOpacity onPress={handleToSave} style={estilo.btnSalvar}>
                        <Text style={estilo.txtBtn}>SALVAR</Text>
                    </TouchableOpacity>            
                </View>

            </View>
           
        </SafeAreaView>
      
    )
}