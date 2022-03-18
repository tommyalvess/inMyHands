import React, { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity,
    TextInput,
    Alert,
    FlatList,
    SafeAreaView,
     } from 'react-native';
import { Header } from "../../components/Header";
import { estilo } from "./styles";
import Modal from "react-native-modal";
import { Ionicons } from '@expo/vector-icons'; 
import { theme } from "../../global/style/theme";
import { query, getFirestore, addDoc, collection, getDocs, where, writeBatch, doc, deleteDoc } from "firebase/firestore";
import { ListDivider } from "../../components/ListDivider";
import { ListItemConta } from "../../components/ListItemConta";

export type ItemConta = [
    {
        id: number;
        desc: string;
    }   
]


export function Conta(){

    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalUpdateVisible, setModalUpdateVisible] = useState(false);
    const [isErro, setErro] = useState(false);
    const [isErroGenerico, setErroGenerico] = useState(false);
    const [exist, setExist] = useState(false);
    const [textInput, setTextInput] = useState('');
    const [data, setData] = useState<ItemConta>();
    const [itemSelected, setItemSelected] = useState([]);
    const [isModalVisibleDelete, setModalUpdateVisibleDelete] = useState(false);

    const db = getFirestore();

    const keyGenerator = () => '_' + Math.random().toString(36).substr(2, 9);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
        setErro(false)
        setTextInput('')
        setExist(false)
        setErroGenerico(false)
        setIsLoading(false)    
    };
    
    const toggleModalUpdate = (item: any) => {
        setModalUpdateVisible(!isModalUpdateVisible)
        setItemSelected(item)
        setTextInput(item.desc)        
    };

    const handleToSave = async () => {

        if (textInput == "") {
            setErro(true)
            setErroGenerico(false)
            setExist(false)
            return 
        }

        try {
            setIsLoading(true)
            const datas = [] as any;
            var childData;
            const q = query(collection(db, "users", "11979589357", "savemoney", "transaction", "conta"));
    
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                childData = doc.data().desc;
                if (childData === textInput.toLocaleLowerCase()) {
                    datas.push(childData);
                }
            });
            
            if (datas.length > 0) {
                console.log('Item já existente.');
                setTextInput('')
                setExist(true)
                setErro(false)
                setErroGenerico(false)
                setIsLoading(false)
            }else{
                await addDoc(collection(db,  "users", "11979589357", "savemoney", "transaction", "conta"), {
                    id: keyGenerator(),
                    desc: textInput.toLowerCase().trim()
                });
                console.log('Conta salva.');
                setModalVisible(!isModalVisible);
                setErro(false)
                setTextInput('')
                setExist(false)
                setErroGenerico(false)
                setIsLoading(false)
            }           

          } catch (e) {
            console.error("Error adding document: ", e);
            setModalVisible(!isModalVisible);
            setErroGenerico(true)
            setErro(false)
            setExist(false)
            setIsLoading(false)
          }

          renderData();
    }

    const renderData = async () => {

       try {
        const datas = [] as any;

        const q = query(collection(db, "users", "11979589357", "savemoney", "transaction", "conta"))

        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
            const childData = doc.data()            
            datas.push(childData)
        });      
        setData(datas)  
       } catch (error) {
           console.log("Erro: " +error);           
       }

    }

    const updateItem = async () => {
        setIsLoading(true)

       try {
            var idTrans;
            var dataresult = [] as any;
            const datas = [] as any;

            const qR = query(collection(db, "users", "11979589357", "savemoney", "transaction", "conta"));
    
            const querySnapshot = await getDocs(qR);

            querySnapshot.forEach((doc) => {
                dataresult = doc.data().desc;
                if (dataresult === textInput.toLocaleLowerCase().trim()) {
                    datas.push(dataresult);
                }
            });            

            if (datas.length > 0) {
                console.log('Item já existente.');
                setExist(true)
                setErro(false)
                setErroGenerico(false)
                setIsLoading(false)
            }else {

                //Buscando o item que seja igual ao id passado como param
                const q = query(collection(db, "users", "11979589357", "savemoney", "transaction", "conta"), where("id", "==", itemSelected.id));
           
                const querySnapshot = await getDocs(q);

                const batch = writeBatch(db);
    
                querySnapshot.forEach((doc) => {
                    idTrans =  doc.id
                });  
                
                const washingtonRef = doc(db, "users", "11979589357", "savemoney", "transaction", "conta", `${idTrans}`);
                batch.update(washingtonRef, {
                    desc : textInput.toLowerCase().trim()
                });
                await batch.commit();

                setModalUpdateVisible(!isModalUpdateVisible)
                setErro(false)
                setExist(false)
                setErroGenerico(false)
                setIsLoading(false)

                renderData();
            }
            
       } catch (error) {
           console.log(error);
           setIsLoading(false)
           Alert.alert("Opsss. Algo deu errado.")
       }
    }

    const toggleModalDelete = (item: any) => {
        setModalUpdateVisibleDelete(!isModalVisibleDelete);
        setItemSelected(item);
    };

    async function deleteItem() {

        const datas = [] as any;
        var childData;
        var idTrans;

        const q = query(collection(db, "users", "11979589357", "savemoney", "transaction", "conta"));

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {

            childData = doc.data().id;  

            if (childData === itemSelected.id) {
                idTrans = doc.id
                console.log(doc.data());
                
            }         

        });        

        await deleteDoc(doc(db, "users", "11979589357", "savemoney", "transaction", "conta", `${idTrans}`));
        setModalUpdateVisibleDelete(!isModalVisibleDelete)
        renderData()

    }

    useEffect(() => {
        renderData()
    },[])

    return (
        <SafeAreaView style={{flex: 1}}>
        
            <View style={{marginHorizontal: 15}}>
                <Header titulo="Contas" action="SaveMoney" haveIcon={true} btnAction={toggleModal}/>
            </View>

            <FlatList 
                data={data?.sort((a, b) => a.desc.localeCompare(b.desc))}
                style={{marginHorizontal: 15}}
                keyExtractor={keyGenerator}
                renderItem={({item}) => (
                  <ListItemConta 
                    data={item}
                    onPress={() => toggleModalUpdate(item)}
                    onLongPress={() => toggleModalDelete(item)}
                  />
                ) }
                contentContainerStyle={{ paddingBottom: 70 }}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <ListDivider isCentered />} // divisor da lista
            /> 

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
                        <Text style={estilo.txtTitleModal}>Adicionar um conta!</Text>
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

            <Modal isVisible={isModalUpdateVisible}>
                <View style={[estilo.modalBox, {height: 250}]}>

                    <View style={{flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginRight: 10}}>
                        <TouchableOpacity onPress={() => setModalUpdateVisible(!isModalUpdateVisible)}>
                            <Ionicons    
                                name="close-circle-outline"
                                color={theme.colors.primary}
                                size={30}
                                style={{margin: 10}}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={estilo.txtTitleModal}>Atualizar</Text>
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

                        <TouchableOpacity style={estilo.btnSalvarItem}  onPress={updateItem} >
                            <Text style={{fontSize: 25, color: 'white', fontFamily: theme.fonts.title500}}>OK</Text>
                        </TouchableOpacity>
                    </View>                   

                </View>
            </Modal>

            <Modal isVisible={isModalVisibleDelete}>
                <View style={[estilo.modalDelete]}>

                    <View style={{flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between'}}>
                        <TouchableOpacity onPress={() => setModalUpdateVisibleDelete(!isModalVisibleDelete)}>
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

        </SafeAreaView>
    )
}