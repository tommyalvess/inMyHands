import React, { ReactNode, useEffect, useState } from 'react';

import {
  View,
  ModalProps,
  TouchableWithoutFeedback,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  KeyboardTypeOptions, 
  DatePickerIOS
} from 'react-native';
import moment from "moment";
import { theme } from '../../global/style/theme';
import { FontAwesome5 } from '@expo/vector-icons'; 
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { TextInputMask } from 'react-native-masked-text'

import { estilo } from './styles';
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';

type Props = ModalProps & {
  titulo: string;
  icon: string;
  chosen: string;
  textInputValue: string;
  keyboardType: KeyboardTypeOptions;
  formHorizontal?: boolean;
  labelHorizontal?: boolean;
  onChangeText: (e:string) => void;
  radioButonData?: {};
  rBtnSetValueT?: (e:string) => void;
  toggleModal: (e:string) => void;
  saveInfs: (e:string) => void;
}

export function ModalContent({
  titulo, 
  icon,
  chosen,
  textInputValue,
  radioButonData,
  formHorizontal,
  labelHorizontal,
  keyboardType,
  onChangeText,
  rBtnSetValueT,
  toggleModal,
  saveInfs,
  ...rest
}: Props){

  const [date, setDate] = useState(new Date(moment(textInputValue, 'DD/MM/YYYY').format('YYYY-MM-DDTHH:mm:ss.sssZ')));

  const isIos = Platform.OS === 'ios'

  const onChange = (event: any, selectedDate: any) => {
    
    try {
      const currentDate = selectedDate || new Date(moment().format('YYYY-MM-DDTHH:mm:ss.sssZ'))  
      
      if (event.type === 'neutralButtonPressed') {
        setDate(new Date(moment().format('YYYY-MM-DDTHH:mm:ss.sssZ')));
      } else {
        setDate(currentDate);    
        onChangeText(moment(currentDate).format('DD/MM/YYYY'))  
      }
    } catch (error) {
      console.log("Erro");
    }
    
  };

  return (

    <KeyboardAvoidingView
    behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
    >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView scrollEnabled={false}>
        
        <View style={estilo.boxContentModal}>
          <FontAwesome5 style={{marginTop: 20, marginBottom: 15}} name={icon} size={30} color="black" />
          <Text style={estilo.txtModal}>{titulo}</Text>
          {radioButonData != null &&  
          <>
            <ScrollView style={{height: 200}} showsVerticalScrollIndicator={false}>
              <RadioForm
                radio_props={radioButonData}
                formHorizontal={formHorizontal}
                labelHorizontal={labelHorizontal}
                buttonColor={'#2196f3'}
                animation={true}
                buttonSize={12}      
                labelStyle={{fontFamily: theme.fonts.title700, fontSize: 15}}              
                onPress={(label) => rBtnSetValueT(label)}
              />
            </ScrollView>
            <Text style={estilo.txtModalDes}>Faltou opção? Escrever aqui:</Text> 
          </>
          }   
          
          {
            chosen == "data" &&
              <DateTimePicker
                testID="dateTimePicker" 
                style={{height: 215, width: isIos ? 300 : undefined }}
                value={date}              
                locale="pt-br"   
                onChange={onChange} 
                mode="date" 
                is24Hour
                textColor={theme.colors.secondary90}
                display={'spinner'}
              />
          } 

          
          {
            chosen == "valor" &&
            <TextInputMask
              type={'money'}
              options={{
                precision: 2,
                separator: ',',
                delimiter: '.',
                unit: 'R$',
                suffixUnit: ''
              }}
              style={estilo.input}
              autoCapitalize="words"
              placeholderTextColor='#737380'
              keyboardType={keyboardType}
              returnKeyType="done"
              onChangeText={(maskedText, rawText) => onChangeText(maskedText)}
              value={textInputValue}
            />      
          }         

          {
           chosen == "des" &&
            <TextInput
              style={estilo.input}
              autoCapitalize="words"
              placeholderTextColor='#737380'
              keyboardType={keyboardType}
              returnKeyType="done"
              onChangeText={onChangeText}
              value={textInputValue}
            />  
          }     

           {
           chosen == "tag" &&
            <TextInput
              style={estilo.input}
              autoCapitalize="words"
              placeholderTextColor='#737380'
              keyboardType={keyboardType}
              returnKeyType="done"
              onChangeText={onChangeText}
              value={textInputValue}
            />  
          }           

           {
           chosen == "conta" &&
            <TextInput
              style={estilo.input}
              autoCapitalize="words"
              placeholderTextColor='#737380'
              keyboardType={keyboardType}
              returnKeyType="done"
              onChangeText={onChangeText}
              value={textInputValue}
            />  
          }         

           {
           chosen == "parcela" &&
            <TextInput
              style={estilo.input}
              autoCapitalize="words"
              placeholderTextColor='#737380'
              keyboardType={keyboardType}
              returnKeyType="done"
              maxLength={3}
              onChangeText={onChangeText}
              value={textInputValue}
            />  
          }               

        </View>

        <View style={{justifyContent: 'center', alignItems: 'center', marginBottom: 30}}>
            <TouchableOpacity style={estilo.btnSalvarItem}  onPress={() => [toggleModal(chosen), saveInfs(chosen)]} >
                <Text>SALVAR</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}