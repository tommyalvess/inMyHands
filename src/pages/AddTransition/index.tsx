import React, { useEffect, useState } from "react";
import { 
    View, 
    Text,
    Switch,
    Alert,  
     } from 'react-native';
import { ScrollView, TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../../components/Header";
import { estilo } from "./styles";
import { theme } from "../../global/style/theme";
import RadioForm from 'react-native-simple-radio-button';
import { MaterialIcons  } from '@expo/vector-icons'; 
import moment from "moment";
import Modal from "react-native-modal";
import { ModalContent } from "../../components/ModalContent";
import { Feather } from '@expo/vector-icons'; 
import { useNavigation } from "@react-navigation/native";

import { doc, query, getFirestore, addDoc, collection, getDocs, getDoc, orderBy } from "firebase/firestore";
import { schedulePushNotification } from "../../utils/notifications";

import * as Notifications from 'expo-notifications';

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

export type Transaction = 
    {
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
        ano: string;
        idNotification: string;
        mes: string;
    
    }   


export function AddTransition(){

    const [value, setValue] = useState(0)
    const [valueD, setValueD] = useState(0)
    const [valueC, setValueC] = useState(0)
    const [valueT, setValueT] = useState(0)
    const [title, setTitle] = useState() as any
    const [desInput, setDesInput] = useState() as any
    const [contaInput, setContaInput] = useState() as any
    const [tagInput, setTagInput] = useState('')
    const [tag, setTag] = useState('')
    const [dataMaskedText, setDataMaskedText] = useState(moment().format('DD/MM/YYYY'))
    const [valorMaskedText, setValorMaskedText] = useState('')
    const [parcela, setParcela] = useState(0)
    const [tipo, setTipo] = useState('')
    const [conta, setConta] = useState('')
    const [pago, setPago] = useState(false)
    const [radioPropsConta, setRadioPropsConta] = useState([])
    const [radioPropsCat, setRadioPropsCat] = useState([])

    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalInfVisible, setModalInfVisible] = useState(false);
    const [isModalAlarmVisible, setModalAlarmVisible] = useState(false);
    const [chosen, setChosen] = useState('');
    const [enabled, setEnabled] = useState(false);

    const navigation = useNavigation();

    const db = getFirestore();

    function handleToPage(){
        navigation.navigate('SaveMoney');
    }

    const toggleSwitch = () => {
        setEnabled(oldValue => !oldValue)
    }

    const toggleModal = (btn: string) => {
      setModalVisible(!isModalVisible);
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
    };

    function saveInfs(params:string) {
        
        if(value == 0){
            setTipo('Despesa')
        }else if(value == 1){
            setTipo('Receita')
        }else if(value == 2){
            setTipo('Transf')
        }        

        if(params == 'des'){

            if (desInput) {
                setTitle(desInput)
                return;
            }
            setValueD(0)
            if(valueD == 0){
                setTitle("Salário")
            }else if (valueD == 1) {
                setTitle("Condominio")
            }else if (valueD == 2) {
                setTitle("Compras")
            }else if (valueD == 3) {
                setTitle("Despesas de casa")
            }else if (valueD == 4) {
                setTitle("Luz")
            }else if (valueD == 5) {
                setTitle("Internet")
            }else if (valueD == 6) {
                setTitle("Dinheiro Extra")
            }else if (valueD == 7) {
                setTitle("Gastos não previstos")
            }  

        }else if (params == 'conta') {
            if (contaInput) {
                setConta(contaInput)
                return;
            }
            
            setValueC(0)
            var valueConta = 0;
            var labelConta = "";

            for (let index = 0; index < radioPropsConta.length; index++) {
                valueConta = radioPropsConta[index].value;
                labelConta = radioPropsConta[index].label;
                
                if(valueC == valueConta){
                    console.log("id: " + valueConta);
                    console.log("label: " + labelConta);
                    setConta(labelConta)
                }
            }         
                  
        }else if (params == 'tag') {
            if (tagInput) {
                setTag(tagInput);
                return;
            }

            setValueT(0);
            var valueCat = 0;
            var labelCat = "";

            for (let index = 0; index < radioPropsCat.length; index++) {
                valueCat = radioPropsCat[index].value;
                labelCat = radioPropsCat[index].label;
                
                if(valueT == valueCat){
                    console.log("id: " + valueCat);
                    console.log("label: " + labelCat);
                    setTag(labelCat)
                }
            }         

        }

    }

    async function storeTransactions(title: string, tag: string, data: string, day: string, mes: string, ano: String, valor: string, parcela: number, nrparcela: number, tipo: string, conta: string, pago: boolean, idNotification?: string) {
        try {

            await addDoc(collection(db,  "users", "11979589357", "savemoney", "transaction", "item"), {
                id: gerarnumeros(),
                title: title.trim(),
                tag: tag.trim(),
                data: data.trim(),
                day: day.trim(),
                mes: mes.trim(),
                ano: ano.trim(),
                valor: valor.trim(),
                parcela: parcela,
                nrparcela: nrparcela,
                tipo: tipo.trim(),
                conta: conta.trim(),
                pago: pago,
                idNotification: idNotification
              });
            console.log('Saving Updated');
            handleToPage()
          } catch (e) {
            await Notifications.cancelScheduledNotificationAsync(idNotification);
            console.error("Error adding document: ", e);
          }
        
    }

    async function handleToSave() {
       try {
        var idNotification: string;

        if (title == "" || tag == "" || valorMaskedText == "" || tag == "" || conta == "" ) {
            setModalAlarmVisible(!isModalAlarmVisible);
            return;
        }
        var day = dataMaskedText.substr(0,2)      
        var mes = dataMaskedText.substr(3,2)      
        var ano = dataMaskedText.substr(6,9)      

        var newvalor = valorMaskedText.replace(".", "").replace(",", ".").replace("R$", "").toString()
        var newdata = dataMaskedText.replaceAll("/", "-")
        var dataformatada =  moment(newdata, "DD-MM-YYYY").format('YYYY-MM-DD')
        var newparcela = parcela.toString().length == 0 ? 0 : parcela;

        if (newparcela > 365) {
           setModalInfVisible(!isModalInfVisible)
            return;
        }

        if(newparcela != 0){
            let nrparcela = 1;
            for (let index = 0; index < newparcela; index++) {
                var novoData = moment(dataformatada).add(index, 'month').format('YYYY-MM-DD')  
                var novoAno = moment(dataformatada).add(index, 'month').format('YYYY')  
                var novoMes = moment(dataformatada).add(index, 'month').format('MM')  

                console.log("Qual tipo: "+tipo);
                

                if(tipo == "Despesa"){
                    idNotification = await schedulePushNotification("Dia de pagar a dívida", "Pague: " + title, parseInt(day), parseInt(novoMes))

                    storeTransactions(
                        title, 
                        tag, 
                        novoData, 
                        day,
                        novoMes,
                        novoAno,
                        newvalor, 
                        newparcela, 
                        nrparcela,
                        tipo, 
                        conta, 
                        pago,
                        idNotification
                    );
                    console.log("Salvo - Despesa com parcelas");

                }else if (tipo == "Receita"){
                    idNotification = await schedulePushNotification("Dia de receber o money", "Dia do - " + title, parseInt(day), parseInt(novoMes))

                    storeTransactions(
                        title, 
                        tag, 
                        novoData, 
                        day,
                        novoMes,
                        novoAno,
                        newvalor, 
                        newparcela, 
                        nrparcela,
                        tipo, 
                        conta, 
                        pago,
                        idNotification
                    );
                    console.log("Salvo - Salário com parcelas");
                }else {
                    storeTransactions(
                        title, 
                        tag, 
                        novoData, 
                        day,
                        novoMes,
                        novoAno,
                        newvalor, 
                        newparcela, 
                        nrparcela,
                        tipo, 
                        conta, 
                        pago,
                        '0'
                    );
                    console.log("Salvo - Transferência");
                }

                nrparcela++  
            }
        }else{
            if(tipo == "Despesa"){
                idNotification = await schedulePushNotification("Dia de pagar a dívida", "Pague: " + title, parseInt(day), parseInt(mes))

                storeTransactions(
                    title, 
                    tag, 
                    dataformatada, 
                    day,
                    mes,
                    ano,
                    newvalor, 
                    parcela, 
                    0,
                    tipo, 
                    conta, 
                    pago,
                    idNotification
                );
                console.log("Salvo - Despesa");
            }else if (tipo == "Receita"){
                idNotification = await schedulePushNotification("Dia de receber o money", "Dia do - " + title, parseInt(day), parseInt(mes))

                storeTransactions(
                    title, 
                    tag, 
                    dataformatada, 
                    day,
                    mes,
                    ano,
                    newvalor, 
                    parcela, 
                    0,
                    tipo, 
                    conta, 
                    pago,
                    idNotification
                );
                console.log("Salvo - Salário");
        
            }else {
                storeTransactions(
                    title, 
                    tag, 
                    dataformatada, 
                    day,
                    mes,
                    ano,
                    newvalor, 
                    parcela, 
                    0,
                    tipo, 
                    conta, 
                    pago,
                    '0'
                );
                console.log("Salvo - Transferência");
            }
        }

       } catch (error) {
           console.log("AddTransition - handleToSave - error: " + error);
       }
        
    }

    function gerarnumeros(): any {
           
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (var i = 0; i < 5; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      
        return text;

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
        gerarListaConta()
        gerarListaCategoria()          
    },[])

    return(
      
        <SafeAreaView style={{marginHorizontal: 15}}>

            <Header titulo="Nova Transação" action="SaveMoney" />

            <ScrollView showsVerticalScrollIndicator={false} style={{marginBottom: 45}}>
                
                    <View style={estilo.box1estilo}>

                    <Text style={[estilo.titleContent, {paddingHorizontal: 15}]}>Tipo</Text>

                    <RadioForm
                        radio_props={radio_props}
                        formHorizontal={true}
                        labelHorizontal={true}
                        buttonColor={theme.colors.toggle}
                        animation={true}
                        buttonSize={12}      
                        labelStyle={{fontFamily: theme.fonts.title700, fontSize: 15}}              
                        onPress={setValue}
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
                            
                            thumbColor={enabled ? theme.colors.heading : theme.colors.heading}
                            trackColor={{ false: theme.colors.heading, true: theme.colors.secondary30 }}
                            ios_backgroundColor={ theme.colors.heading}

                            onValueChange={toggleSwitch} 
                            value={enabled}
                        />

                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={() => toggleModal('parcela')} style={estilo.box1}>
                        <Text style={estilo.titleContent}>Recorrência</Text>
                        <View style={{flexDirection:'row', alignItems: 'center'}}>
                            <Text>{!parcela ? "" : parcela}</Text>
                            <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableOpacity onPress={handleToSave} style={estilo.btnSalvar}>
                        <Text style={estilo.txtBtn}>SALVAR</Text>
                    </TouchableOpacity>

            </ScrollView>
          
            <Modal isVisible={isModalVisible}>
                <View style={estilo.modalBox}>
                    {chosen == 'des' &&                     
                        <ModalContent icon="sticky-note" keyboardType="default" toggleModal={() => toggleModal("des")} saveInfs={() => saveInfs("des")} chosen={"des"} titulo="Descrição" textInputValue={desInput} onChangeText={setDesInput} formHorizontal={false} labelHorizontal={true} radioButonData={radio_props_modal} rBtnSetValueT={setValueD}/>
                    }
                    {chosen == 'data' && 
                        <ModalContent icon="calendar-alt" keyboardType="numeric" toggleModal={() => toggleModal("data")} saveInfs={() => saveInfs("data")} chosen={"data"} titulo="Data da Transação" textInputValue={dataMaskedText} onChangeText={setDataMaskedText} />
                    }
                    {chosen == 'valor' && 
                        <ModalContent icon="money-bill-wave"  keyboardType="numeric" toggleModal={() => toggleModal("valor")} saveInfs={() => saveInfs("valor")} chosen={"valor"} titulo="Valor da Transação" textInputValue={valorMaskedText} onChangeText={setValorMaskedText} />
                    }
                    {chosen == 'tag' && 
                        <ModalContent icon="tag"  keyboardType="default" toggleModal={() => toggleModal("tag")} saveInfs={() => saveInfs("tag")} chosen={"tag"} radioButonData={radioPropsCat} rBtnSetValueT={setValueT}  titulo="Categoria" textInputValue={tagInput} onChangeText={setTagInput} />
                    }
                    {chosen == 'conta' && 
                        <ModalContent icon="user-tag"  keyboardType="default" toggleModal={() => toggleModal("conta")} saveInfs={() => saveInfs("conta")}  radioButonData={radioPropsConta} rBtnSetValueT={setValueC} chosen={"conta"} titulo="Conta" textInputValue={contaInput} onChangeText={setContaInput} formHorizontal={false} labelHorizontal={true}/>
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