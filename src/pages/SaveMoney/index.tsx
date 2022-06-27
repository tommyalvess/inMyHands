import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity,
    FlatList,
    Alert,
     } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../global/style/theme";
import { estilo } from "./styles";
import {MaterialIcons,Ionicons,AntDesign} from '@expo/vector-icons'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Header } from "../../components/Header";

import moment from 'moment';
import localization from 'moment/locale/pt-br';
import { ListItem } from "../../components/ListItem";
import { ListDivider } from "../../components/ListDivider";
import { formatNumber } from "../../utils/moeda";

import BottomSheet from 'reanimated-bottom-sheet';
import Feather from "@expo/vector-icons/build/Feather";
import { getDocs, query, collection, where, getFirestore, writeBatch } from "@firebase/firestore";
import { addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import Modal from "react-native-modal";
import * as Notifications from 'expo-notifications';
import { schedulePushNotification } from "../../utils/notifications";

export type Transaction = [
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
]

export function SaveMoney(){

    const navigation = useNavigation();

    const [dataFinal, setDataFinal] = useState<string>('');
    const [pastDate, setPastDate] = useState(1);
    const [forward, setForward] = useState(1);
    const [saldoPassado, setSaldoPassado] = useState(0);
    const [despesas, setDespesas] = useState(0);
    const [somaDividaAtual, setSomaDividaAtual] = useState(0);
    const [somaReceita, setSomaReceita] = useState(0);
    const [saldoAtual, setSaldoAtual] = useState('');
    const [saldoFimMes, setSaldoFimMes] = useState(0);
    const [data, setData] = useState([]);
    const [dataNew, setDataNew] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [isModalVisible, setModalVisible] = useState(false);
    const [itemSelected, setItemSelected] = useState([]);


    const keyGenerator = () => '_' + Math.random().toString(36).substr(2, 9);
    
    var beforeMonth: any;
    var afterMonth: any;
    var dateNow: any;


    const database = getFirestore();

     //Modal
    const sheetRef = useRef(null);

    function handleToPage(path: string) {
        navigation.navigate(path  as never, {} as never)
    }

    function goToPast() {
        setPastDate(pastDate + 1)
        beforeMonth = moment(dataFinal).subtract(1, 'month').format('YYYY-MM-DD');
        dateNow = beforeMonth;
        setDataFinal(dateNow)
                
    }

    function goForward(){
        setForward(forward + 1)
        afterMonth = moment(dataFinal).add(1, 'month').format('YYYY-MM-DD');
        dateNow = afterMonth;
        setDataFinal(dateNow)
    }

    async function dataOrderFilterd() {

        setIsLoading(true);

        try {
            const datas = [] as any;
            var mesNow = moment(dataFinal).format("MM")  
            var anoNow = moment(dataFinal).format("YYYY")

            const q = query(collection(database, "users", "11979589357", "savemoney", "transaction", "item"), where("mes", "==", mesNow), where("ano", "==" ,anoNow));

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const childData = doc.data();            
                datas.push(childData);
            });
            setTotal(data.length)
            setData(datas); 

            //Validar quando tudo for carregado

            somaReceitas()
            somarDividasMes()
            somarDividaAtual()
            meuSaldoAtual() 
            finalDoMes()
            setIsLoading(false)

            //checkNotification(datas)


        } catch (error) {
            console.log("SaveMoney - dataOrderFilterd - erro: " +error);
            setIsLoading(false)

        }
    }

    async function detectChanges() {
        try {
            const q = query(collection(database, "users", "11979589357", "savemoney", "transaction", "item"));
            onSnapshot(q, (snapshot) => {
                
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "modified") {
                        console.log("modified");   
                        
                        //Validar quando tudo for carregado
                        meuSaldoAtual()
                        somaReceitas()
                        somarDividasMes()
                        somarDividaAtual()
                        finalDoMes()                       
                        
                    }

                });
                
            });
            
        } catch (error) {
            console.log("SaveMoney - detectChanges - erro: "+error);
        }
    }

    async function somaReceitas() {       
         
        //if(data.length <= 0) return setSomaReceita(data);      

        var mesNow = moment(dataFinal).format("MM")  
        var anoNow = moment(dataFinal).format("YYYY")
        var receitaMes = 0;

        const qSomaR = query(collection(database, "users", "11979589357", "savemoney", "transaction", "item"),  
                    where("mes", "==", mesNow), 
                    where("ano", "==" ,anoNow), 
                    where("tipo", "==", "Receita"));

        const querySomaR = await getDocs(qSomaR);

        querySomaR.forEach((doc) => {
            receitaMes += parseFloat(doc.data().valor);                      
        });
        setSomaReceita(receitaMes)   

    }

    async function somarDividasMes() {

        //if(data.length <= 0) return setDespesas(data);

        var mesNow = moment(dataFinal).format("MM")  
        var anoNow = moment(dataFinal).format("YYYY")
        var dividasMes = 0;

        const qSomaD = query(collection(database, "users", "11979589357", "savemoney", "transaction", "item"),  
                    where("mes", "==", mesNow), 
                    where("ano", "==" ,anoNow), 
                    where("tipo", "==", "Despesa"));

        const querySomaD = await getDocs(qSomaD);

        querySomaD.forEach((doc) => {
            dividasMes += parseFloat(doc.data().valor);                      
        });

        setDespesas(dividasMes)
        
    }

    async function somarDividaAtual() {

        //if(data.length <= 0) return setSomaDividaAtual(data);

        var mesNow = moment(dataFinal).format("MM")  
        var anoNow = moment(dataFinal).format("YYYY")
        var dividaAtual = 0;

        const qSomaD = query(collection(database, "users", "11979589357", "savemoney", "transaction", "item"),  
                    where("mes", "==", mesNow), 
                    where("ano", "==" ,anoNow), 
                    where("tipo", "==", "Despesa"),
                    where("pago", "==", false));

        const querySomaD = await getDocs(qSomaD);

        querySomaD.forEach((doc) => {
            dividaAtual += parseFloat(doc.data().valor);                      
        });

        setSomaDividaAtual(dividaAtual)
    }

    async function meuSaldoAtual() {
        
        try {

            var mesNow = moment(dataFinal).format("MM")  
            var anoNow = moment(dataFinal).format("YYYY")
            var receitaMes = 0.0;
            var dividaMes = 0.0;

            const qRM = query(collection(database, "users", "11979589357", "savemoney", "transaction", "item"),  
                        where("mes", "==", mesNow), 
                        where("ano", "==" ,anoNow), 
                        where("tipo", "==", "Receita"), 
                        where("pago","==", true));

            const queryRM = await getDocs(qRM);

            queryRM.forEach((doc) => {
                receitaMes += parseFloat(doc.data().valor);                      
            });

            const qDM = query(collection(database, "users", "11979589357", "savemoney", "transaction", "item"),  
                        where("mes", "==", mesNow), 
                        where("ano", "==" ,anoNow), 
                        where("tipo", "==", "Despesa"), 
                        where("pago","==", true));

            const queryDM = await getDocs(qDM);

            queryDM.forEach((doc) => {
                dividaMes += parseFloat(doc.data().valor);                      
            });
            
            var totalAtualMes = parseFloat(receitaMes.toString()) - parseFloat(dividaMes.toString());      
            

            var mesNow = moment(dataFinal).subtract(1, 'month').format("MM")  
            var anoNow = moment(dataFinal).subtract(1, 'month').format("YYYY")

            const q = query(collection(database, "users", "11979589357", "savemoney", "transaction", "oldValue"),  
                        where("mes", "==", mesNow), 
                        where("ano", "==" ,anoNow));

            const querySnapshot = await getDocs(q);

            var totalDoPassadoMes = 0.0;

            querySnapshot.forEach((doc) => {
                totalDoPassadoMes = doc.data().saldo;            
            });
            
            var result = parseFloat(totalAtualMes.toString()) + parseFloat(totalDoPassadoMes.toString())


            setSaldoAtual(result.toString())
        } catch (error) {
            console.log("SabeMoney - meuSaldoAtual - erro: "+error);
            setSaldoAtual('0')
        }
    }

    async function finalDoMes(){
        //if(data.length <= 0) return setSaldoFimMes(data);

       try {

            var mesNow = moment(dataFinal).format("MM")  
            var anoNow = moment(dataFinal).format("YYYY")
            
            var mesB = moment(dataFinal).subtract(1, 'month').format("MM")  
            var anoB = moment(dataFinal).subtract(1, 'month').format("YYYY")

            var totalR = 0;
            var totalD = 0;

            //Valor atual de receita 
            const qSomaR = query(collection(database, "users", "11979589357", "savemoney", "transaction", "item"),  
                        where("mes", "==", mesNow), 
                        where("ano", "==" ,anoNow), 
                        where("tipo", "==", "Receita"));

            const querySomaR = await getDocs(qSomaR);

            querySomaR.forEach((doc) => {
                totalR += parseFloat(doc.data().valor);                      
            });            
            
            //Valor atual de despesa 
            const qSomaD = query(collection(database, "users", "11979589357", "savemoney", "transaction", "item"),  
                        where("mes", "==", mesNow), 
                        where("ano", "==" ,anoNow), 
                        where("tipo", "==", "Despesa"));

            const querySomaD = await getDocs(qSomaD);

            querySomaD.forEach((doc) => {
                totalD += parseFloat(doc.data().valor);                      
            });

            //valor do mes passado
            const q = query(collection(database, "users", "11979589357", "savemoney", "transaction", "oldValue"),  
                            where("mes", "==", mesB), 
                            where("ano", "==" ,anoB));

            const querySnapshot = await getDocs(q);

            var valorAnterior = 0;

            querySnapshot.forEach((doc) => {
                valorAnterior = parseFloat(doc.data().saldo);            
            });       
            
            var somaRP = parseFloat(totalR.toString())  + parseFloat(valorAnterior.toString())

            var result = parseFloat(somaRP.toString()) - parseFloat(totalD.toString());           
            
            setSaldoFimMes(result)
            salvarSaldoPassado(result.toFixed(2))

       } catch (error) {
           console.log("SaveMoney - finalDoMes - erro: "+error);
       }
    }

    //esse metodo vai salvar o mes anterior sempre
    async function salvarSaldoPassado(salado: string) {
       try {
            var childData;
            var mesNow = moment(dataFinal).format("MM")  
            var anoNow = moment(dataFinal).format("YYYY")

            const q = query(collection(database, "users", "11979589357", "savemoney", "transaction", "oldValue"),  
                where("mes", "==", mesNow), 
                where("ano", "==" ,anoNow));

            const querySnapshot = await getDocs(q);
           
            querySnapshot.forEach((doc) => {
                childData = doc.id;            
            });

            if(childData){
                const batch = writeBatch(database);
                const washingtonRef = doc(database, "users", "11979589357", "savemoney", "transaction", "oldValue", `${childData}`);
                batch.update(washingtonRef, {
                    "mes": mesNow,
                    "ano": anoNow,
                    "saldo": salado
                });
                await batch.commit();
                console.log("Atualizado o Saldo final do mês ");
            }else{
                await addDoc(collection(database,  "users", "11979589357", "savemoney", "transaction", "oldValue"), {
                    mes: mesNow,
                    ano: anoNow,
                    saldo: salado
                });
                console.log("Salvo o Saldo final do mês");
            }
       } catch (error) {
           console.log("SaveMoney - salvarSaldoPassado - erro: " + error);
       }     
        
    }

    async function sobrouAnterior() {
       try {
            const datas = [] as any;
            var mesNow = moment(dataFinal).subtract(1, 'month').format("MM")  
            var anoNow = moment(dataFinal).subtract(1, 'month').format("YYYY")

            const q = query(collection(database, "users", "11979589357", "savemoney", "transaction", "item"),  where("mes", "==", mesNow), where("ano", "==" ,anoNow));

            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                const childData = doc.data();            
                datas.push(childData);            
            });

            var valor = 0
            var total = 0;
            var divida = 0
            var totalDivida = 0
            var sobrou = 0

            for (let index = 0; index < datas.length; index++) {
                if(datas[index].tipo == "Receita"){
                    valor = parseFloat(datas[index].valor)                
                    total += valor                                                          
                }else if(datas[index].tipo == "Despesa"){
                    divida = parseFloat(datas[index].valor)
                    totalDivida += divida                         
                }
            }     

            var mesNowp = moment(dataFinal).subtract(2, 'month').format("MM")  
            var anoNowp = moment(dataFinal).subtract(2, 'month').format("YYYY")

            const queryPassado = query(collection(database, "users", "11979589357", "savemoney", "transaction", "oldValue"),  
                                    where("mes", "==", mesNowp), 
                                    where("ano", "==" ,anoNowp));

            const getpassado = await getDocs(queryPassado);

            var saldoData = 0;

            getpassado.forEach((doc) => {
                saldoData = doc.data().saldo;            
            });    

            sobrou = (parseFloat(total.toString()) + parseFloat(saldoData.toString())) - parseFloat(totalDivida.toString());

            console.log("Sobrou passado foi = " + sobrou);
            
            setSaldoPassado(sobrou);
       } catch (error) {
           console.log("SaveMoney - sobrouAnterior - erro: "+error);
       }

    }

    async function updateItemList(item: Transaction) {
       navigation.navigate('UpdateTransaction', {item} )
    }

    const toggleModalUpdate = (item: any) => {
        setModalVisible(!isModalVisible)
        setItemSelected(item)
    };

    async function deleteItem() {

        const datas = [] as any;
        var childData;
        var idTrans;
        var idNotification;

        const q = query(collection(database, "users", "11979589357", "savemoney", "transaction", "item"));

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {

            childData = doc.data().id;  

            if (childData === itemSelected.id) {
                idTrans = doc.id
                idNotification = doc.data().idNotification
            }         

        });        
        await Notifications.cancelScheduledNotificationAsync(idNotification as never);  
        await deleteDoc(doc(database, "users", "11979589357", "savemoney", "transaction", "item", `${idTrans}`));
        setModalVisible(!isModalVisible)
        dataOrderFilterd()

    }

    function opemModal() {
        sheetRef.current.snapTo(0);
    }

    const renderContent = () => (
        <View
          style={estilo.modalBox}
        >

            <View style={estilo.boxModalValores}>
                <View style={estilo.renderContentBox}>
                    <Feather style={{marginRight: 5}} name="dollar-sign" size={15} color="black" />                
                    <Text style={estilo.renderContentTxt}>Saldo do atual</Text>
                </View>
                {saldoAtual.toString().startsWith('-') ?
                <Text style={[estilo.renderContentValue,{color: 'red'}]}>R$ {formatNumber(parseFloat(saldoAtual))}</Text>
                :
                <Text style={estilo.renderContentValue}>R$ {formatNumber(saldoAtual)}</Text>
                }
            </View>

            <View style={estilo.boxModalValores}>
                <View style={estilo.renderContentBox}>
                    <Feather style={{marginRight: 5}} name="alert-triangle" size={15} color="black" />                
                    <Text style={estilo.renderContentTxt}>Despesas</Text>
                </View>
                <Text style={[estilo.renderContentValue,{color: 'red'}]}>R$ {formatNumber(despesas)}</Text>
            </View>

            <View style={estilo.boxModalValores}>
                <View style={estilo.renderContentBox}>
                    <Feather style={{marginRight: 5}} name="alert-triangle" size={15} color="black" />                
                    <Text style={estilo.renderContentTxt}>Despesas Pendentes</Text>
                </View>
                <Text style={[estilo.renderContentValue,{color: 'red'}]}>R$ {formatNumber(somaDividaAtual)}</Text>
            </View>

            <View style={estilo.boxModalValores}>
               <View style={estilo.renderContentBox}>
                    <Feather style={{marginRight: 5}} name="trending-up" size={15} color="black" />
                    <Text style={estilo.renderContentTxt}>Receita</Text>
               </View>
                <Text style={[estilo.renderContentValue,{color: theme.colors.green}]}>R$ {formatNumber(somaReceita)}</Text>
            </View>

            <View style={estilo.boxModalValores}>
            <View style={estilo.renderContentBox}>
                    <Feather style={{marginRight: 5}} name="bar-chart-2" size={15} color="black" />                
                    <Text style={estilo.renderContentTxt}>Saldo no final do mês</Text>
                </View>
                {saldoFimMes.toString().startsWith('-') ?
                <Text style={[estilo.renderContentValue,{color: 'red'}]}>R$ {formatNumber(saldoFimMes)}</Text>
                :
                <Text style={estilo.renderContentValue}>R$ {formatNumber(saldoFimMes)}</Text>
                }
            </View>

            <View style={estilo.boxModalValores}>
            <View style={estilo.renderContentBox}>
                    <Feather style={{marginRight: 5}} name="arrow-left" size={15} color="black" />                
                    <Text style={estilo.renderContentTxt}>Saldo do mês anterior</Text>
                </View>
                {saldoPassado.toString().startsWith("-") ? 
                <Text style={[estilo.renderContentValue, {color: 'red'}]}>R$ {formatNumber(saldoPassado)}</Text>
                    :
                <Text style={estilo.renderContentValue}>R$ {formatNumber(saldoPassado)}</Text>
                }
            </View>

        </View>
    );

    const checkNotification = async (data:Transaction)  => {
        const agendadoItem = new Set();
        const notificationObj = new Set();
        var dataAgora = moment().format("YYYY-MM-DD");

        //Verificando se os item salvos no banco tem notificação agendada no dispositivo 
        console.log("Item for notificate")                

        await Notifications.getAllScheduledNotificationsAsync().then(response => {
            console.log("Notificações registradas: " + response.length);
            
            if (response.length == 0) {                
                for (let index = 0; index < data.length; index++) {  
                    if (data[index].data >= dataAgora) {                       
                        notificationObj.add(data[index]);
                    }                                    
                }
            }else{
                for (let index = 0; index < response.length; index++) {
                    const element = response[index].identifier;    
                    
                    for (let index = 0; index < data.length; index++) {
                        
                        if (data[index].idNotification != undefined) {

                            const item = data[index].idNotification;      
                            if (data[index].data >= dataAgora) {
                                if (item == element) {
                                    agendadoItem.add(element)
                                }else {
                                    notificationObj.add(element)
                                }
                            }         

                        }     
                               
                    }               
                    
                }
            }

        })   
        
        //Elimando do array as notificações que já tem notificação agendada. 
        //Verificando se tem conteudo no agendadoItem se nçao segue em frente.
        if (agendadoItem.size > 0 ) {
            agendadoItem.forEach(function (value) {
                notificationObj.delete(value)
            })
        }        

        console.log("Total à ser notificado: " + notificationObj.size);   

        var newDate = [] as any;

        if (notificationObj.size > 0) {  
            
            notificationObj.forEach(function (value) {                
                newDate.push(value);                 
            })                             
            
            for (let index = 0; index < newDate.length; index++) {                
                if(newDate[index].tipo == "Despesa"){
                    //await schedulePushNotification("Dia de pagar a dívida", "Pague: " + data.title, data.day, data.data)
                    console.log("Entrou Despesa");   
                                        
                }else if (newDate[index].title == "Salário"){
                    //await schedulePushNotification("Dia de receber o money", "Dia do - " + data.title, data.day, data.data)
                    console.log("Entrou Receita"); 

                }    
            }

        }

        console.log("---------------------");
        

    }

    useEffect(() => {

        moment.updateLocale('pt-br', localization);
        
        if (dataFinal == "") {
            dateNow = moment().locale('pt').format('YYYY-MM-DD');
            setDataFinal(dateNow)
        }      

        dataOrderFilterd()
        detectChanges()
        sobrouAnterior()
    
        opemModal()
                
        const unsubscribe = navigation.addListener('focus', () => {
            dataOrderFilterd()
        });
        return unsubscribe;
              
    }, [dataFinal]);

    return(
        <>
        
        <SafeAreaView style={{marginHorizontal: 15, flex: 1}}>

            <Header titulo="Save Money" action="Home"/>

            <View style={estilo.headerContent}>
                <TouchableOpacity onPress={goToPast}>
                    <MaterialIcons   
                        name="arrow-back-ios"
                        color={theme.colors.heading}
                        size={25}
                    />
                </TouchableOpacity>
                <Text style={estilo.txtMesAno}>{moment(dataFinal).format("MMM / YY").toLocaleUpperCase()}</Text>
                <TouchableOpacity onPress={goForward}>
                    <MaterialIcons   
                        name="arrow-forward-ios"
                        color={theme.colors.heading}
                        size={25}
                    />
               </TouchableOpacity>
            </View>

            <View style={estilo.btnActions}>

                    <View style={{justifyContent: 'center', alignContent: 'center'}}>
                        <TouchableOpacity onPress={() => handleToPage('AddTransition')} style={estilo.boxItemcategory}>
                            <Ionicons
                                style={{justifyContent: 'center', marginLeft: 3}}   
                                name="ios-add"
                                color="#000"
                                size={30}
                            />
                        </TouchableOpacity>
                        <Text style={estilo.txtIcon}>Adicionar</Text>
                    </View>

                    <View style={{justifyContent: 'center', alignContent: 'center'}}>                          
                        <TouchableOpacity onPress={() => handleToPage('Categoria')} style={estilo.boxItemcategory}>
                            <AntDesign 
                                style={{justifyContent: 'center'}}   
                                name="tago"
                                color="#000"
                                size={25}
                            />
                        </TouchableOpacity>
                        <Text style={estilo.txtIcon}>Categoria</Text>
                    </View>

                    <View style={{ alignItems: 'center'}}>                          
                        <TouchableOpacity onPress={() => handleToPage('Conta')} style={estilo.boxItemcategory}>
                            <AntDesign 
                                style={{justifyContent: 'center'}}   
                                name="tagso"
                                color="#000"
                                size={25}
                            />
                        </TouchableOpacity>
                        <Text style={[estilo.txtIcon, {marginRight: 19}]}>Contas</Text>
                    </View>     

                    <View style={{justifyContent: 'center', alignItems: 'center'}}>                          
                        <TouchableOpacity onPress={() => handleToPage('Analise')} style={estilo.boxItemcategory}>
                            <AntDesign 
                                style={{justifyContent: 'center'}}   
                                name="barschart"
                                color="#000"
                                size={25}
                            />
                        </TouchableOpacity>
                        <Text style={[estilo.txtIcon, {marginRight: 19}]}>Análise</Text>
                    </View>              

            </View>

            <FlatList 
                data={data.sort((a, b) => a.day.localeCompare(b.day))} //filtrando por data
                keyExtractor={keyGenerator}
                renderItem={({item}) => (
                    <ListItem 
                        data={item} 
                        onPress={() => updateItemList(item)}
                        onLongPress={() => toggleModalUpdate(item)}
                    />
                ) }
                contentContainerStyle={{ paddingBottom: 90 }}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <ListDivider isCentered />} // divisor da lista
            /> 
        </SafeAreaView>
        
        <BottomSheet
            ref={sheetRef}
            snapPoints={[85, 235, 64]}
            borderRadius={15}
            renderContent={renderContent}
            enabledInnerScrolling={false}
        />

        <Modal isVisible={isModalVisible}>
            <View style={[estilo.modalDelete]}>

                <View style={{flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between'}}>
                    <TouchableOpacity onPress={() => setModalVisible(!isModalVisible)}>
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
                    <TouchableOpacity style={estilo.btnSalvarItem}  onPress={deleteItem} >
                        <Text style={{fontSize: 25, color: 'white', fontFamily: theme.fonts.title500}}>OK</Text>
                    </TouchableOpacity>
                </View>                   

            </View>
        </Modal>
      
        </>
    )
}

