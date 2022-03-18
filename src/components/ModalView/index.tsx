import React, { ReactNode } from 'react';

import {
  View,
  ModalProps,
  TouchableWithoutFeedback,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Modal from "react-native-modal";
import { theme } from '../../global/style/theme';
import { SimpleLineIcons } from '@expo/vector-icons'; 
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

import { estilo } from './styles';

type Props = ModalProps & {
  isModalVisible: boolean;
  btnTipo: string;
  chosen: string;
  toggleModal: (e:string) => void;
  saveInfs: (e:string) => void;
}

export function ModalView({
  isModalVisible, 
  btnTipo,
  chosen,
  toggleModal,
  saveInfs,
  ...rest
}: Props){
  return (
    <Modal isVisible={isModalVisible}>
    <View style={estilo.modalBox}>
        {chosen == 'des' && (
        <View style={estilo.boxContentModal}>
            <SimpleLineIcons style={{marginTop: 5, marginBottom: 20}} name="note" size={30} color="black" />
            <Text style={estilo.txtModal}>Descrição</Text>
            <RadioForm
                radio_props={radio_props_modal}
                initial={0}
                formHorizontal={false}
                labelHorizontal={true}
                buttonColor={'#2196f3'}
                animation={true}
                buttonSize={12}      
                labelStyle={{fontFamily: theme.fonts.title700, fontSize: 15}}              
                onPress={setValueT}
            />     
            <Text style={estilo.txtModalDes}>Faltou opção? Escrever aqui:</Text> 
            <TextInput
                style={estilo.input}
                autoCapitalize="words"
                placeholderTextColor='#737380'
                keyboardType='default'
                returnKeyType="done"
                onChangeText={setTitle}
                value={title}
            />                            

        </View>)}
        {chosen == 'data' && <Text>Data</Text>}
        {chosen == 'valor' && <Text>Valor</Text>}
        {chosen == 'tag' && <Text>Categoria</Text>}
        {chosen == 'conta' && <Text>Conta</Text>}
        {chosen == 'parcela' && <Text>Recorrência</Text>}
    
        <TouchableOpacity style={estilo.btnSalvarItem}  onPress={() => [toggleModal(chosen), saveInfs(chosen)]} >
            <Text>SALVAR</Text>
        </TouchableOpacity>
    </View>
</Modal>
  );
}