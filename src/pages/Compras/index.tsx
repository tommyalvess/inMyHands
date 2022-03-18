import moment from "moment";
import React, { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    FlatList,
     } from 'react-native';

import Modal from "react-native-modal";
import { Ionicons } from '@expo/vector-icons'; 

import { Header } from "../../components/Header";
import { estilo } from "./styles";
import { theme } from "../../global/style/theme";

import { query, getFirestore, addDoc, collection, getDocs, where, writeBatch, doc, deleteDoc } from "firebase/firestore";
import { ScrollView } from "react-native-gesture-handler";
import { ListItemConta } from "../../components/ListItemConta";
import { ListDivider } from "../../components/ListDivider";

const keyGenerator = () => '_' + Math.random().toString(36).substr(2, 9);

export function Compras(){

    const [isModalVisible, setModalVisible] = useState(false);
    const [isErro, setErro] = useState(false);
    const [exist, setExist] = useState(false);
    const [isErroGenerico, setErroGenerico] = useState(false);
    const [textInput, setTextInput] = useState('');
    const [data, setData] = useState([]);

    const db = getFirestore();

    const handleToSave = async () => {

        if (textInput == "") {
            setErro(true)
            setErroGenerico(false)
            setExist(false)
            return 
        }

        try {
              
            await addDoc(collection(db, "users", "11979589357", "savemoney", "transaction", "compras"), {
                id: keyGenerator(),
                desc: textInput.trim()
            });

        } catch (error) {
            console.log("Compras - error: " + error);
        }

        setModalVisible(!isModalVisible);
        renderData();
    }

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
        setTextInput("")
    };

    const renderData = async () => {

        try {
         const datas = [] as any;
 
         const q = query(collection(db, "users", "11979589357", "savemoney", "transaction", "compras"))
 
         const querySnapshot = await getDocs(q)
         querySnapshot.forEach((doc) => {
             const childData = doc.data()            
             datas.push(childData)
         });      
         console.log("R" +datas);
         
         setData(datas)  
        } catch (error) {
            console.log("Erro: " +error);           
        }
 
    }

    useEffect(() => {
        renderData()
    },[])
    return (
        <SafeAreaView style={{flex:1}}>
            <View style={estilo.container}>
                <Header titulo="Lista de Compras" action="Home" haveIcon={true} btnAction={toggleModal}/>

                <FlatList 
                    data={data}
                    style={{marginHorizontal: 15}}
                    keyExtractor={keyGenerator}
                    renderItem={({item}) => (
                    <ListItemConta 
                        data={item}
                        checkBox
                        //onPress={() => toggleModalUpdate(item)}
                        //onLongPress={() => toggleModalDelete(item)}
                    />
                    ) }
                    contentContainerStyle={{ paddingBottom: 70 }}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <ListDivider isCentered />} // divisor da lista
                /> 

            </View>

            <Modal isVisible={isModalVisible}>
                <View style={[estilo.modalBox, {height: 250}]}>

                    <View style={{flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginRight: 10}}>
                        <TouchableOpacity onPress={() => setModalVisible(!isModalVisible)}>
                            <Ionicons    
                                name="close-circle-outline"
                                color={theme.colors.primary}
                                size={30}
                                style={{margin: 10}}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={estilo.txtTitleModal}>Adicionar item a lista!</Text>
                        <TextInput
                            style={estilo.input}
                            autoCapitalize="words"
                            placeholderTextColor='#737380'
                            keyboardType="default"
                            returnKeyType="done"
                            onChangeText={setTextInput}
                            value={textInput}
                        />  

                        {isErro && <Text style={estilo.txtErro}>Campo não pode ficar vazio!</Text>}
                        {exist && <Text style={estilo.txtErro}>Item já existe!</Text>}
                        {isErroGenerico && <Text style={estilo.txtErro}>Opss! Algo deu errado.</Text>}

                        <TouchableOpacity style={estilo.btnSalvarItem}  onPress={handleToSave} >
                            <Text style={{fontSize: 25, color: 'white', fontFamily: theme.fonts.title500}}>OK</Text>
                        </TouchableOpacity>
                    </View>                   

                </View>
            </Modal>

        </SafeAreaView>
    )
}