import React, { useEffect, useState } from "react";
import { 
    View, 
    Text,
    Switch,
    ActivityIndicator,
     } from 'react-native';
     
import { ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../../components/Header";
import { estilo } from "./styles";
import { theme } from "../../global/style/theme";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { MaterialIcons  } from '@expo/vector-icons'; 
import moment from "moment";
import Modal from "react-native-modal";
import { ModalContent } from "../../components/ModalContent";
import { Feather } from '@expo/vector-icons'; 
import { useNavigation, useRoute } from "@react-navigation/native";

import { doc, query, getFirestore, addDoc, collection, getDocs, getDoc, orderBy, writeBatch, where } from "firebase/firestore";
import { formatNumber } from "../../utils/moeda";

import * as Notifications from 'expo-notifications';
import { schedulePushNotification } from "../../utils/notifications";

interface Transaction {
        id: number;
        title: string;
        tag: string;
        data: string;
        day: string;
        valor: string;
        parcela?: number;
        nrparcela?: number;
        tipo: string;
        conta: string;
        pago?: boolean;
    
}   

var radio_props = [
    {label: 'Despesa ', value: 0 },
    {label: 'Receita ', value: 1 },
    {label: 'Transf', value: 2 }
];

var radio_props_modal = [
    {label: 'Salário', value: 0 },
    {label: 'Condominio', value: 1 },
    {label: 'Compras', value: 2 },
    {label: 'Despesas de casa', value: 3 },
    {label: 'Luz', value: 4 },
    {label: 'Internet', value: 5 },
    {label: 'Dinheiro Extra', value: 6 },
    {label: 'Gastos', value: 7 },
];

export function UpdateTransaction(){
    
    const [valueTipo, setValueTipo] = useState<number>()
    const [valueDesc, setValueDesc] = useState(0)
    const [valueConta, setValueConta] = useState(0)
    const [valueTag, setValueTag] = useState(0)

    const [title, setTitle] = useState('')
    const [desInput, setDesInput] = useState('') 
    const [contaInput, setContaInput] = useState('') 
    const [tagInput, setTagInput] = useState('') 
    const [tag, setTag] = useState('')
    const [dataMaskedText, setDataMaskedText] = useState('')
    const [valorMaskedText, setValorMaskedText] = useState('')
    const [parcela, setParcela] = useState() 
    const [tipo, setTipo] = useState('')
    const [conta, setConta] = useState('')
    const [pago, setPago] = useState(false)
    const [radioPropsConta, setRadioPropsConta] = useState([])
    const [radioPropsCat, setRadioPropsCat] = useState([])

    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalInfVisible, setModalInfVisible] = useState(false);
    const [isModalAlarmVisible, setModalAlarmVisible] = useState(false);
    const [chosen, setChosen] = useState('');    

    const navigation = useNavigation();

    const db = getFirestore();

    const route = useRoute();

    var itemTransaction: Transaction = route.params.item;

    function handleToPage(){
        navigation.navigate('SaveMoney' as never);
    }

    function loadItem() {
                
        //Selecionando Tipo
        if (itemTransaction.tipo == "Despesa") {
            setValueTipo(0)
            setTipo('Despesa')
        }else if (itemTransaction.tipo == "Receita") {
            setValueTipo(1)
            setTipo('Receita')
        }else if (itemTransaction.tipo == "Transf") {
            setValueTipo(2)
            setTipo('Transf')
        }

        console.log("Tipo:"+valueTipo);

        //Selecionando Desc
        setTitle(itemTransaction.title)

        //Selecionando Data
        var dataformatada =  moment(itemTransaction.data, "YYYY-MM-DD").format('DD/MM/YYYY');
        setDataMaskedText(dataformatada)

        //Selecionando Valor
        setValorMaskedText(formatNumber(itemTransaction.valor))

        //Selecionando Categoria
        setTag(itemTransaction.tag)

        //Selecionando Conta 
        setConta(itemTransaction.conta)

        //Selecionando Pago
        setPago(itemTransaction.pago == true ? true : false)

        //Selecionando Parcela
        setParcela(itemTransaction.parcela)

        
    }

    const toggleSwitch = () => {
        setPago(oldValue => !oldValue)
    }

    const toggleModal = (btn: string) => {

      if(btn == 'des'){
        setChosen('des')
      }else if(btn == 'data'){
        setChosen('data')
      }else if(btn == 'valor'){
        setChosen('valor')
      }else if (btn == 'tag') {
        setChosen('tag')
      }else if (btn == 'conta') {
        setChosen('conta')
      }else if (btn == 'parcela') {
        setChosen('parcela')
      }
      setModalVisible(!isModalVisible);

    };

    function saveInfs(params:string) {
        
        if(valueTipo == 0){
            setTipo('Despesa')
        }else if(valueTipo == 1){
            setTipo('Receita')
        }else if(valueTipo == 2){
            setTipo('Transf')
        }        

        if(params == 'des'){

            if (desInput) {
                setTitle(desInput)
                return;
            }
            setValueDesc(0)
            if(valueDesc == 0){
                setTitle("Salário")
            }else if (valueDesc == 1) {
                setTitle("Condominio")
            }else if (valueDesc == 2) {
                setTitle("Compras")
            }else if (valueDesc == 3) {
                setTitle("Despesas de casa")
            }else if (valueDesc == 4) {
                setTitle("Luz")
            }else if (valueDesc == 5) {
                setTitle("Internet")
            }else if (valueDesc == 6) {
                setTitle("Dinheiro Extra")
            }else if (valueDesc == 7) {
                setTitle("Gastos não previstos")
            }  

        }else if (params == 'conta') {
            if (contaInput) {
                setConta(contaInput)
                return;
            }
            
            setValueConta(0)
            var valueCont = 0;
            var labelConta = "";

            for (let index = 0; index < radioPropsConta.length; index++) {
                valueCont = radioPropsConta[index].value;
                labelConta = radioPropsConta[index].label;
                
                if(valueCont == valueConta){
                    console.log("label: " + labelConta);
                    setConta(labelConta)
                }
            }         
                  
        }else if (params == 'tag') {
            if (tagInput) {
                setTag(tagInput);
                return;
            }

            setValueTag(0);
            var valueCat = 0;
            var labelCat = "";

            for (let index = 0; index < radioPropsCat.length; index++) {
                valueCat = radioPropsCat[index].value;
                labelCat = radioPropsCat[index].label;
                
                if(valueTag == valueCat){
                    console.log("id: " + valueCat);
                    console.log("label: " + labelCat);
                    setTag(labelCat)
                }
            }         

        }

    }

    async function handleToSave() {       
        try {
            var newparcela = parcela == null ? 0 : parcela;

            if (title == "" || tag == "" || conta == "" ) {
                setModalAlarmVisible(!isModalAlarmVisible);
                return;
            }

            if (newparcela > 365) {
                setModalInfVisible(!isModalInfVisible)
                return;
            }

            var idTrans;
            var idNotification;
            var idNotificationNew;
            var dataOld;
            var dataresult = [] as any;

            const q = query(collection(db, "users", "11979589357", "savemoney", "transaction", "item"), where("id", "==", itemTransaction.id));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                dataresult.push(doc.data());
                idTrans =  doc.id 
                dataOld = doc.data().data
                idNotification = doc.data().idNotification; 
            });        

            var day = dataMaskedText.substring(0,2)      
            var mes = dataMaskedText.substring(3,5)      
            var ano = dataMaskedText.substring(6,10) 

            var newvalor = valorMaskedText.replace(".", "").replace(",", ".").replace("R$", "").toString()
            var newdata = dataMaskedText.replaceAll("/", "-")
            var dataformatada =  moment(newdata, "DD-MM-YYYY").format('YYYY-MM-DD')
                        
            const itemTransation = doc(db, "users", "11979589357", "savemoney", "transaction", "item", `${idTrans}`);

            if(dataformatada > dataOld || dataformatada < dataOld){
                console.log("Nova data");   
                if (idNotification == undefined) {
                    console.log("Item sem idNotificatio");
                    if(tipo == "Despesa"){
                        const batch = writeBatch(db);              
                        idNotificationNew = await schedulePushNotification("Dia de pagar a dívida", "Pague: " + title, parseInt(day), parseInt(mes))
                        console.log("Adicionado uma lembrete de divida");

                        batch.update(itemTransation, {
                            "ano": ano,
                            "conta": conta,
                            "data": dataformatada,
                            "day": day,
                            "mes": mes,
                            "pago": pago,
                            "tag": tag,
                            "tipo": tipo,
                            "title": title,
                            "valor": newvalor,
                            "idNotification": idNotificationNew
                        });
                        await batch.commit();
                        
                    }else{
                        const batch = writeBatch(db);              
                        idNotificationNew = await schedulePushNotification("Dia de receber o money", "Dia do - " + title, parseInt(day), parseInt(mes))
                        console.log("Adicionado uma lembrete de money");

                        batch.update(itemTransation, {
                            "ano": ano,
                            "conta": conta,
                            "data": dataformatada,
                            "day": day,
                            "mes": mes,
                            "pago": pago,
                            "tag": tag,
                            "tipo": tipo,
                            "title": title,
                            "valor": newvalor,
                            "idNotification": idNotificationNew
                        });
                        await batch.commit();

                    }
                }else{
                    await Notifications.cancelScheduledNotificationAsync(idNotification);  
                    console.log("Desativou a notificação passada");
                         
                    if(tipo == "Despesa"){
                        const batch = writeBatch(db);              

                        idNotificationNew = await schedulePushNotification("Dia de pagar a dívida", "Pague: " + title, parseInt(day), parseInt(mes))
                        console.log("Atualizado uma lembrete de divida");

                        batch.update(itemTransation, {
                            "ano": ano,
                            "conta": conta,
                            "data": dataformatada,
                            "day": day,
                            "mes": mes,
                            "pago": pago,
                            "tag": tag,
                            "tipo": tipo,
                            "title": title,
                            "valor": newvalor,
                            "idNotification": idNotificationNew
                        });
                        await batch.commit();

                    }else{
                        const batch = writeBatch(db);              

                        idNotificationNew = await schedulePushNotification("Dia de receber o money", "Dia do - " + title, parseInt(day), parseInt(mes))
                        console.log("Atualizado uma lembrete de money");

                        batch.update(itemTransation, {
                            "ano": ano,
                            "conta": conta,
                            "data": dataformatada,
                            "day": day,
                            "mes": mes,
                            "pago": pago,
                            "tag": tag,
                            "tipo": tipo,
                            "title": title,
                            "valor": newvalor,
                            "idNotification": idNotificationNew
                        });
                        await batch.commit();

                    }
                }      
            }else {
                if (idNotification == undefined) {
                    console.log("Item sem idNotificatio");
                    if(tipo == "Despesa"){
                        const batch = writeBatch(db);

                        idNotificationNew = await schedulePushNotification("Dia de pagar a dívida", "Pague: " + title, parseInt(day), parseInt(mes))
                        console.log("Adicionado uma lembrete de divida");

                        batch.update(itemTransation, {
                            "ano": ano,
                            "conta": conta,
                            "data": dataformatada,
                            "day": day,
                            "mes": mes,
                            "pago": pago,
                            "tag": tag,
                            "tipo": tipo,
                            "title": title,
                            "valor": newvalor,
                            "idNotification": idNotificationNew
                        });
                        await batch.commit();
                        
                    }else{
                        const batch = writeBatch(db);

                        idNotificationNew = await schedulePushNotification("Dia de receber o money", "Dia do - " + title, parseInt(day), parseInt(mes))
                        console.log("Adicionado uma lembrete de money");

                        batch.update(itemTransation, {
                            "ano": ano,
                            "conta": conta,
                            "data": dataformatada,
                            "day": day,
                            "mes": mes,
                            "pago": pago,
                            "tag": tag,
                            "tipo": tipo,
                            "title": title,
                            "valor": newvalor,
                            "idNotification": idNotificationNew
                        });
                        await batch.commit();

                    }
                }else {
                    console.log("Sem atualização de notificação!");
                    
                    const batch = writeBatch(db);
                    batch.update(itemTransation, {
                        "ano": ano,
                        "conta": conta,
                        "data": dataformatada,
                        "day": day,
                        "mes": mes,
                        "pago": pago,
                        "tag": tag,
                        "tipo": tipo,
                        "title": title,
                        "valor": newvalor,
                    });
                    await batch.commit(); 

                }         
                               
            }  
                      
            handleToPage();
        } catch (error) {
            console.log("UpdateTransaction - handleToSave - erro: " + error);            
        }
    }

    async function gerarListaConta() {
        const datas = [] as any;
        var count = 0;
        const q = query(collection(db, "users", "11979589357", "savemoney", "transaction", "conta"), orderBy("desc", "asc"))

        const querySnapshot = await getDocs(q)

        querySnapshot.forEach((doc) => {
            var title = doc.data().desc as string
            const childData = {"label" : title.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()), "value" : count};          
            count++
            datas.push(childData)
        });      
        setRadioPropsConta(datas)                        
    }

    async function gerarListaCategoria() {
        const datas = [] as any;
        var count = 0;
        const q = query(collection(db, "users", "11979589357", "savemoney", "transaction", "categoria"), orderBy("desc", "asc"))

        const querySnapshot = await getDocs(q)

        querySnapshot.forEach((doc) => {
            var title = doc.data().desc as string
            const childData = {"label" : title.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()), "value" : count};          
            count++
            datas.push(childData)
        });      
        setRadioPropsCat(datas)                
    }

    useEffect(() => {
        loadItem()
        gerarListaConta()
        gerarListaCategoria()  
    },[itemTransaction.tipo])

    if (valueTipo == undefined) {
        return (
            <SafeAreaView style={{flex: 1,marginHorizontal: 15}}>
                <Header titulo="Atualizar Transação" action="SaveMoney" />
                <View style={{flex: 1,justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator />
                </View>
            </SafeAreaView>
          )
    }

    return(
      
        <SafeAreaView style={{marginHorizontal: 15}}>

            <Header titulo="Atualizar Transação" action="SaveMoney" />

            <ScrollView showsVerticalScrollIndicator={false} style={{marginBottom: 45}}>
                
                    <View style={estilo.box1estilo}>

                    <Text style={[estilo.titleContent, {paddingHorizontal: 15}]}>Tipo</Text>

                    <RadioForm
                        initial={valueTipo}
                        radio_props={radio_props}
                        formHorizontal={true}
                        labelHorizontal={true}
                        buttonColor={theme.colors.toggle}
                        animation={true}
                        buttonSize={12}      
                        labelStyle={{fontFamily: theme.fonts.title700, fontSize: 15}}              
                        onPress={setValueTipo}
                    />                   

                    </View>

                    <TouchableWithoutFeedback onPress={() => toggleModal('des')} style={estilo.box1}>
                        <Text style={estilo.titleContent}>Descrição</Text>
                        <View style={{flexDirection:'row', alignItems: 'center'}}>
                            <Text>{!title ? "" : title}</Text>
                            <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={() => toggleModal('data')} style={estilo.box1}>
                        <Text style={estilo.titleContent}>Data</Text>
                        <View style={{flexDirection:'row', alignItems: 'center'}}>
                            <Text>{!dataMaskedText ? "" : dataMaskedText}</Text>
                            <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={() => toggleModal('valor')} style={estilo.box1}>
                        <Text style={estilo.titleContent}>Valor</Text>
                        <View style={{flexDirection:'row', alignItems: 'center'}}>
                            <Text>{!valorMaskedText ? "" : valorMaskedText}</Text>
                            <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={() => toggleModal('tag')} style={estilo.box1}>
                        <Text style={estilo.titleContent}>Categoria</Text>
                        <View style={{flexDirection:'row', alignItems: 'center'}}>
                            <Text>{!tag ? "" : tag}</Text>
                            <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={() => toggleModal('conta')} style={estilo.box1}>
                        <Text style={estilo.titleContent}>Conta</Text>
                        <View style={{flexDirection:'row', alignItems: 'center'}}>
                            <Text>{!conta ? "" : conta}</Text>
                            <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback style={estilo.box1}>
                        <Text style={estilo.titleContent}>Pago</Text>
                        <Switch                         
                            thumbColor={pago ? theme.colors.heading : theme.colors.heading}
                            trackColor={{ false: theme.colors.heading, true: theme.colors.secondary30 }}
                            ios_backgroundColor={ theme.colors.heading}
                            onValueChange={toggleSwitch} 
                            value={pago}
                        />

                    </TouchableWithoutFeedback>

                    <View style={estilo.box1}>
                        <Text style={estilo.titleContent}>Recorrência</Text>
                        <View style={{flexDirection:'row', alignItems: 'center'}}>
                            <Text>{!parcela ? "" : parcela} x</Text>
                            <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
                        </View>
                    </View>

                    <TouchableOpacity onPress={handleToSave} style={estilo.btnSalvar}>
                        <Text style={estilo.txtBtn}>SALVAR</Text>
                    </TouchableOpacity>

            </ScrollView>
          
            <Modal isVisible={isModalVisible}>
                <View style={estilo.modalBox}>
                    {chosen == 'des' &&                     
                        <ModalContent icon="sticky-note" keyboardType="default" toggleModal={() => toggleModal("des")} saveInfs={() => saveInfs("des")} chosen={"des"} titulo="Descrição" textInputValue={desInput} onChangeText={setDesInput} formHorizontal={false} labelHorizontal={true} radioButonData={radio_props_modal} rBtnSetValueT={setValueDesc}/>
                    }
                    {chosen == 'data' && 
                        <ModalContent icon="calendar-alt" keyboardType="numeric" toggleModal={() => toggleModal("data")} saveInfs={() => saveInfs("data")} chosen={"data"} titulo="Data da Transação" textInputValue={dataMaskedText} onChangeText={setDataMaskedText} />
                    }
                    {chosen == 'valor' && 
                        <ModalContent icon="money-bill-wave"  keyboardType="numeric" toggleModal={() => toggleModal("valor")} saveInfs={() => saveInfs("valor")} chosen={"valor"} titulo="Valor da Transação" textInputValue={valorMaskedText} onChangeText={setValorMaskedText} />
                    }
                    {chosen == 'tag' && 
                        <ModalContent icon="tag"  keyboardType="default" toggleModal={() => toggleModal("tag")} saveInfs={() => saveInfs("tag")} chosen={"tag"} radioButonData={radioPropsCat} rBtnSetValueT={setValueTag}  titulo="Categoria" textInputValue={tagInput} onChangeText={setTagInput} />
                    }
                    {chosen == 'conta' && 
                        <ModalContent icon="user-tag"  keyboardType="default" toggleModal={() => toggleModal("conta")} saveInfs={() => saveInfs("conta")}  radioButonData={radioPropsConta} rBtnSetValueT={setValueConta} chosen={"conta"} titulo="Conta" textInputValue={contaInput} onChangeText={setContaInput} formHorizontal={false} labelHorizontal={true}/>
                    }
                    {chosen == 'parcela' &&  
                        <ModalContent icon="calendar-plus"  keyboardType="numeric" toggleModal={() => toggleModal("parcela")} saveInfs={() => saveInfs("parcela")} chosen={"parcela"} titulo="Recorrência" textInputValue={parcela} onChangeText={setParcela} />
                    }
                    
                </View>
            </Modal>
            
            {
                <Modal isVisible={isModalInfVisible}>
                    <View style={[estilo.modalBox, {height: 250}]}>
                        <View style={{alignItems: 'center'}}>
                            <Feather name="alert-triangle" size={55} color="red" />
                            <Text style={{marginTop: 25, fontFamily: theme.fonts.title700, fontSize: 17}}>Número de recorrência está invalido.</Text>
                            <Text style={{fontFamily: theme.fonts.title700, fontSize: 17}}>Maximo é 365.</Text>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 15}}>
                            <TouchableOpacity style={estilo.btnSalvarItem}  onPress={() => setModalInfVisible(!isModalInfVisible)} >
                                <Text style={{fontSize: 25, color: 'white', fontFamily: theme.fonts.title500}}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            }

            {
                <Modal isVisible={isModalAlarmVisible}>
                    <View style={[estilo.modalBox, {height: 250}]}>
                        <View style={{alignItems: 'center'}}>
                            <Feather name="alert-triangle" size={55} color="red" />
                            <Text style={{marginTop: 25, fontFamily: theme.fonts.title700, fontSize: 17}}>Campos não podem ficar vazios.</Text>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 15}}>
                            <TouchableOpacity style={estilo.btnSalvarItem}  onPress={() => setModalAlarmVisible(!isModalAlarmVisible)} >
                                <Text style={{fontSize: 25, color: 'white', fontFamily: theme.fonts.title500}}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            }
           
        </SafeAreaView>
      
    )
}