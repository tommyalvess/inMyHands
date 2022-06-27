import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Constants from 'expo-constants';

import { 
    View, 
    Text, 
    TouchableOpacity,
    SafeAreaView,
    Platform,
    Linking,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Keyboard,
    Alert,
    FlatList,
     } from 'react-native';
import { Header } from "../../components/Header";
import { estilo } from "./styles";

import * as Notifications from 'expo-notifications';
import { useNavigation } from "@react-navigation/native";
import { schedulePushNotification } from "../../utils/notifications";
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import { ScrollView, TextInput } from "react-native-gesture-handler";
import moment from "moment";
import { addDoc, collection,deleteDoc,doc,getDocs,getFirestore,orderBy,query, where } from "firebase/firestore";
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from "../../global/style/theme";
import { ListDivider } from "../../components/ListDivider";
import { MaterialIcons, Ionicons} from '@expo/vector-icons'; 
import RadioForm from 'react-native-simple-radio-button';
import Modal from "react-native-modal";

export type FaxinaObj = [
  item: {
    dia: string,
    mes: string,
    ano: string,
    desc: string,
    data: string,
    hora: string,
    repetir?: number,
    personalizado?:number,
  }
]

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

export function Faxina(){
  const keyGenerator = () => '_' + Math.random().toString(36).substr(2, 9);

  const navigation = useNavigation();
  const sheetRef = useRef(null);

  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [valueWeek, setValueWeek] = useState(0)
  const [valueCustom, setValueCustom] = useState(0)
  const [dataPicker, setDataPicker] =  useState(new Date(moment().format('YYYY-MM-DDTHH:mm:ss.sssZ')));
  const [dataPickerPrincipal, setDataPickerPrincipal] =  useState(new Date(moment().format('YYYY-MM-DDTHH:mm:ss.sssZ')));
  const [time, setTime] = useState(new Date(moment().format('YYYY-MM-DDTHH:mm:ss.sssZ')));
  const [desc, setDesc] = useState('');
  const [repetir, setRepetir] = useState('');
  const [isModalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [itemSelected, setItemSelected] = useState<FaxinaObj>();

  const database = getFirestore();
  var dateNow: any;

  const isIos = Platform.OS === 'ios'

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

  const onChangePrincial = (event: any, selectedDate: any) => {    
    try {
      const currentDate = selectedDate || new Date(moment().format('YYYY-MM-DDTHH:mm:ss.sssZ'))  
      
      if (event.type === 'neutralButtonPressed') {
        setDataPickerPrincipal(new Date(moment().format('YYYY-MM-DDTHH:mm:ss.sssZ')));
        dataOrderFilterd()
      } else {
        console.log("Data selecionada: "+currentDate);
        
        setDataPickerPrincipal(currentDate);    
        dataOrderFilterd()
      }
    } catch (error) {
      console.log("Erro");
    }
    
  };
  
  function gerarnumeros(): any {
           
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;

  } 

  async function storage(dia: number, mes: number, ano: number, desc: string, data: string, hora:string, repetir:number, personalizado:number, codigo:string, idNotification: string) {

    try {
      await addDoc(collection(database,  "users", "11979589357", "savemoney", "transaction", "faxina"), {
        id: gerarnumeros(),
        desc: desc.trim(),
        dia: dia,
        mes: mes,
        ano: ano,
        data: data,
        hora: hora,
        repetir,
        personalizado,
        codigo,
        idNotification: idNotification,
        check: false
      });

      dataOrderFilterd();

      console.log("Item da faxina salvo");
      
    } catch (error) {
      console.log("Faxina - storage - error: " + error);
      await Notifications.cancelScheduledNotificationAsync(idNotification);
    }

  }

  const handleToSave = async () => {

      if (desc == "") {
        return Alert.alert("Campo não pode ficar vazio!")
      }

      Keyboard.dismiss()

      var idNotification: string;

      var day = parseInt(moment(dataPicker, "DD-MM-YYYY").format('DD'))
      var mes = parseInt(moment(dataPicker, "DD-MM-YYYY").format('MM'))
      var ano = parseInt(moment(dataPicker, "DD-MM-YYYY").format('YYYY'))
      var data = moment(dataPicker, "DD-MM-YYYY").format('YYYY-MM-DDTHH:mm:ss.sssZ')
      var hora = parseInt(moment(time).locale('pt').format('LT').substring(0,2))
      var minutos = parseInt(moment(time).locale('pt').format('LT').substring(3,5))
      var horas = moment(time).locale('pt').format('YYYY-MM-DDTHH:mm:ss.sssZ')

      console.log("-----------------------------");

      if (valueWeek > 0 && valueCustom > 0) {
         return Alert.alert("Algo deu errado!","Somente uma opção de repetição pode ser selecionada.")
      }

      if ((valueWeek > 0 || valueCustom > 0) && repetir == "") {
        return Alert.alert("Algo deu errado!","Campo de recorrência está vazio.")
      }

      if (valueWeek > 0) {
        if (valueWeek == 1) {
          //Semanal
          var codigo = gerarnumeros();

          for (let index = 0; index < parseInt(repetir); index++) {
            var dataChanged = moment(data).format('YYYY-MM-DDTHH:mm:ss.sssZ');
            var diaChanged = parseInt(moment(data).format("DD"));
            var mesChanged = parseInt(moment(data).format("MM"));
            var anoChanged = parseInt(moment(data).format("YYYY"));
            
            idNotification = await schedulePushNotification(
                          "Olha, o dia da faxina chegou!", 
                          "Hoje é o dia de " + desc, diaChanged, mesChanged, anoChanged, hora, minutos)
  
            storage(diaChanged, mesChanged, anoChanged, desc, dataChanged, horas,valueWeek, valueCustom, codigo, idNotification)
            
            data = moment(data).add(7, 'days').toString()          
          }
        }else if (valueWeek == 2) {
          //Mensal
          var codigo = gerarnumeros();

          for (let index = 0; index < parseInt(repetir); index++) {
            var novoData = moment(dataPicker).add(index, 'month').format('YYYY-MM-DDTHH:mm:ss.sssZ') 
            var novoAno = parseInt(moment(dataPicker).add(index, 'month').format('YYYY'))
            var novoMes = parseInt(moment(dataPicker).add(index, 'month').format('MM'))
            var novoDia = parseInt(moment(dataPicker).add(index, 'month').format('DD'))
  
            idNotification = await schedulePushNotification(
              "Olha, o dia da faxina chegou!", 
              "Hoje é o dia de " + desc, novoDia, novoMes, novoAno, hora, minutos)
  
            storage(novoDia, novoMes, novoAno, desc, novoData, horas, valueWeek, valueCustom, codigo, idNotification)
  
          }        
        }else if (valueWeek == 3) {
          //Anual
          var codigo = gerarnumeros();

          for (let index = 0; index < parseInt(repetir); index++) {
            var novoData = moment(dataPicker).add(index, 'year').format('YYYY-MM-DDTHH:mm:ss.sssZ')  
            var novoAno = parseInt(moment(dataPicker).add(index, 'year').format('YYYY'))
            var novoMes = parseInt(moment(dataPicker).add(index, 'year').format('MM'))
            var novoDia = parseInt(moment(dataPicker).add(index, 'year').format('DD'))
            
            idNotification = await schedulePushNotification(
              "Olha, o dia da faxina chegou!", 
              "Hoje é o dia de " + desc, novoDia, novoMes, novoAno, hora, minutos)
  
            storage(novoDia, novoMes, novoAno, desc, novoData, horas, valueWeek, valueCustom, codigo, idNotification)
          }  
        }else if (valueWeek == 0) {
          var codigo = gerarnumeros();

          idNotification = await schedulePushNotification("Olha, o dia da faxina chegou!", "Hoje é o dia de " + desc, day, mes, ano, hora, minutos)
          storage(day, mes, ano, desc, data, horas, valueWeek, valueCustom, codigo, idNotification)
        }
      }else if (valueCustom > 0) {
        for (let index = 0; index < parseInt(repetir); index++) {
          var novoData = moment(dataPicker).add(index, 'month').format('YYYY-MM-DD')  
          var novoAno = parseInt(moment(dataPicker).add(index,  'month').format('YYYY'))
          var novoMes = parseInt(moment(dataPicker).add(index, 'month').format('MM'))

          var codigo = gerarnumeros();

          let date = moment().set('year', novoAno).set('month', novoMes).set('date', 1).isoWeekday(7)          
          if(date.date() > 7) {
              date = date.isoWeekday(-6)
          }

          var novoDia = parseInt(moment(date).format('DD'))
          var newDate = moment(date).format('YYYY-MM-DDTHH:mm:ss.sssZ')
          var newMonth = parseInt(moment(date).format('MM'))

          idNotification = await schedulePushNotification("Olha, o dia da faxina chegou!", "Hoje é o dia de " + desc, novoDia, novoMes, novoAno, hora, minutos)
          storage(novoDia, newMonth, novoAno, desc, newDate, horas, valueWeek, valueCustom, codigo, idNotification)
            
        }
      }else{
        var codigo = gerarnumeros();

        idNotification = await schedulePushNotification("Olha, o dia da faxina chegou!", "Hoje é o dia de " + desc, day, mes, ano, hora, minutos)
        storage(day, mes, ano, desc, data, horas, valueWeek, valueCustom, codigo, idNotification)
      }    
      
      setDesc('')
      setDataPicker(new Date(moment().format('YYYY-MM-DDTHH:mm:ss.sssZ')))
      setTime(new Date(moment().format('YYYY-MM-DDTHH:mm:ss.sssZ')))
      setRepetir('')
      setValueWeek(0)
      setValueCustom(0)

      sheetRef.current.snapTo(0)

  }

  const repetirAgendamento = (data: string,vezes:number) => {
    

    // if (repetir != null) {
    //   for (let index = 0; index < repetir; index++) {   
    //     var novoData = moment(dataPicker).add(index, value == 0 ? 'month' : 'year').format('YYYY-MM-DD')  
    //     var novoAno = moment(dataPicker).add(index,  value == 0 ? 'month' : 'year').format('YYYY')
    //     var novoMes = moment(dataPicker).add(index,  value == 0 ? 'month' : 'year').format('MM')

    //     if (valueWeek == 1 ) {
    //       let date = moment().set('year', parseInt(novoAno)).set('month', parseInt(novoMes)).set('date', 1).isoWeekday(7)          
    //       if(date.date() > 7) {
    //           date = date.isoWeekday(-6)
    //       }
    //       var novoDia = moment(date).format('DD')
    //       var newDate = moment(date).format('YYYY-MM-DD')
    //       var newMonth = moment(date).format('MM')

    //       console.log({novoDia, newMonth, novoAno, desc, newDate, horas});
                      
    //       //idNotification = await schedulePushNotification("Olha, o dia da faxina chegou!", "Hoje é o dia de " + desc, novoDia, parseInt(novoMes), parseInt(novoAno), hora, minutos)
    //       //storage(parseInt(novoDia), parseInt(newMonth), parseInt(novoAno), desc, newDate, horas, idNotification)
          
    //       console.log("Agendado para: " + newDate);
    //     }else{            

    //       //idNotification = await schedulePushNotification("Olha, o dia da faxina chegou!", "Hoje é o dia de " + desc, day, parseInt(novoMes), parseInt(novoAno), hora, minutos)
    //       //storage(day, parseInt(novoMes), parseInt(novoAno), desc, novoData, horas, idNotification)
          
    //       console.log({day, novoMes, novoAno, desc, novoData, horas});
    //       console.log("Agentado para: " + novoData);          
    //     }

       
    //   }
    // }else {
    //     idNotification = await schedulePushNotification("Olha, o dia da faxina chegou!", "Hoje é o dia de " + desc, day, mes, ano, hora, minutos)
    //     storage(day, mes, ano, desc, data, horas, idNotification)
    //     console.log({day, mes, ano, desc, data, horas});
        
    // }

  }

  async function dataOrderFilterd() {
      
      setIsLoading(true);

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
          
          setData(datas);
          setIsLoading(false)
          console.log("Faxina - dataOrderFilterd - data loaded");
          
      } catch (error) {
          console.log(error);
          setIsLoading(false)
          console.log("Faxina - dataOrderFilterd - data loaded erro");
      }

  }

  const renderContent = () => {
    return (
      <View
        style={estilo.modalBox}
      >
        <Text style={estilo.titleHeader}>Adicionar um lembrete.</Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{alignItems:'center'}}>

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

          <Text style={estilo.titulo}>Repetir?</Text>
          <View style={estilo.box1}>

            <View style={{alignSelf: 'center', justifyContent: 'center', marginTop: 5}}>
              <RadioForm
                initial={0}
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
                initial={0}
                radio_props={radio_props_personalizado}
                formHorizontal={true}
                labelHorizontal={true}
                buttonColor={theme.colors.toggle}
                buttonSize={10}                  
                labelStyle={{fontFamily: theme.fonts.title700, fontSize: 15}}              
                onPress={setValueCustom}        
              />  
            </View>        

          </View>

          <Text style={estilo.titulo}>Recorrência?</Text>
          <View style={estilo.box1}>     

            <TextInput 
              autoCapitalize="none"
              placeholder="Quantas vezes?"
              placeholderTextColor='#737380'
              keyboardType='number-pad'
              returnKeyType="done"
              onChangeText={setRepetir}
              value={repetir} 
            />
          </View>

          <TouchableOpacity onPress={handleToSave} style={estilo.btnSalvar}>
          <Text style={estilo.txtBtn}>SALVAR</Text>
          </TouchableOpacity>
       

        </ScrollView>

      </View>
    )
  }

  function updateItemList(item: FaxinaObj) {
    navigation.navigate('UpdateFaxina' as never, {item} as never)
  }

  const toggleModalUpdate = (item: any) => {
    setModalDeleteVisible(!isModalDeleteVisible)
    setItemSelected(item)
  };

  const deleteItem = async () => {

    var childData;
    var idFaxina;
    var idNotification;

    const q = query(collection(database, "users", "11979589357", "savemoney", "transaction", "faxina"));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {

        childData = doc.data().id;  
        idNotification = doc.data().idNotification

        if (childData === itemSelected.id) {
          idFaxina = doc.id
        }         

    });        

    await Notifications.cancelScheduledNotificationAsync(idNotification);  
    await deleteDoc(doc(database, "users", "11979589357", "savemoney", "transaction", "faxina", `${idFaxina}`));
    dataOrderFilterd()
    setModalDeleteVisible(!isModalDeleteVisible)
    console.log("Item deletado");
  }

  const deleteItemAll = async () => {

    var childData;
    var idNotification;
    var idFaxina = [] as any;

    const q = query(collection(database, "users", "11979589357", "savemoney", "transaction", "faxina"),
                    where("codigo", "==", itemSelected.codigo));

    const querySnapshot = await getDocs(q);

    console.log("--------------");
  
    querySnapshot.forEach((doc) => {
        childData = doc.id; 
        idNotification = doc.data().idNotification; 
        idFaxina.push(childData)
    });        

    for (let index = 0; index < idFaxina.length; index++) {
        const element = idFaxina[index];
        await Notifications.cancelScheduledNotificationAsync(idNotification as never);  
        await deleteDoc(doc(database, "users", "11979589357", "savemoney", "transaction", "faxina", `${element}`));
    }

   dataOrderFilterd()
   setModalDeleteVisible(!isModalDeleteVisible)
   console.log("Items deletados");

}

  const renderContentItem = ({item} : any) => {
    return (
      <TouchableOpacity onPress={() => updateItemList(item)} onLongPress={() => toggleModalUpdate(item)} style={estilo.boxContent}>

        <View style={estilo.boxDate}>
            <Text style={estilo.txtDia}>{moment(item.data).locale('pt').format('DD')}</Text>
            <Text style={estilo.txtSemana}>{moment(item.data).locale('pt').format('ddd').toUpperCase()}</Text>
        </View> 

        <View style={{width: '85%'}}>
          <Text style={estilo.tituloItem}>{item.desc}</Text>
          <View style={{flexDirection:'row'}}>
            <Text style={[estilo.subTitle, {marginLeft: 10}]}>Alarme ás </Text>
            <Text style={{fontWeight: 'bold'}}> {moment(item.hora).format("LT")} </Text> 
          </View>
        </View>
      
        <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />

      </TouchableOpacity>
    )
  }

  const handleToClose = () => {
    setModalVisible(!isModalVisible)
  }

  useEffect(() => {
    //dataOrderFilterd();   

    const unsubscribe = navigation.addListener('focus', () => {
      //dataOrderFilterd()
    });
    return unsubscribe;

  }, [dataPickerPrincipal]);  

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
      >
        
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <>
        <SafeAreaView style={{flex:1, marginHorizontal: 15}}>
            <View style={{marginTop: 15}}>
              <Header titulo="Faxina" action="Home" haveIcon={true} btnAction={() => sheetRef.current.snapTo(0)}/>
            </View>

            <DateTimePicker
                testID="dataprincipal" 
                style={{alignSelf: 'center' ,width: isIos ? 355 : undefined }}
                value={dataPickerPrincipal}       
                locale="pt-br" 
                onChange={onChangePrincial} 
                mode="date" 
                themeVariant="light"
                textColor={theme.colors.secondary90}
                display={'inline'}
            />

            {
              data.length > 0 ?
              <>               
                <FlatList 
                  data={data.sort((a:any, b:any) => a.hora.localeCompare(b.hora))} //filtrando por data
                  style={{marginTop: -35}}
                  keyExtractor={keyGenerator}
                  renderItem={renderContentItem}
                  showsVerticalScrollIndicator={false}
                  ItemSeparatorComponent={() => <ListDivider isCentered />} // divisor da lista
                /> 
              </>

              :
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text>Sem atividades hoje!</Text>
              </View>
            }

        </SafeAreaView>

        <BottomSheet
            ref={sheetRef}
            snapPoints={[60, 390, 0]}
            borderRadius={35}
            renderContent={renderContent}
            onCloseEnd={handleToClose}
            enabledInnerScrolling={false}
        />

        <Modal isVisible={isModalDeleteVisible}>
            <View style={[estilo.modalDelete]}>

                <View style={{flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between'}}>
                    <TouchableOpacity onPress={() => setModalDeleteVisible(!isModalDeleteVisible)}>
                        <Ionicons    
                            name="close-circle-outline"
                            color={theme.colors.primary}
                            size={30}
                            style={{margin: 10}}
                        />
                    </TouchableOpacity>
                </View>

                <View style={{justifyContent: 'center', alignItems: 'center', marginBottom: 15}}>
                    <Text style={estilo.txtTitleModal}>Deseja deletar esse item?</Text>
                    <TouchableOpacity style={estilo.btnSalvarItem} onPress={deleteItem} >
                        <Text style={{fontSize: 25, color: 'white', fontFamily: theme.fonts.title500}}>Somente essa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[estilo.btnSalvarItem,{marginTop: 15}]} onPress={deleteItemAll} >
                        <Text style={{fontSize: 25, color: 'white', fontFamily: theme.fonts.title500}}>Todas ocorrências </Text>
                    </TouchableOpacity>
                </View>                   

            </View>
        </Modal>

        </>
      </TouchableWithoutFeedback>

      </KeyboardAvoidingView>
    )
}