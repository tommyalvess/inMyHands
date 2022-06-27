import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { theme } from '../../global/style/theme';

import { estilo } from './styles';
import {Feather } from '@expo/vector-icons'
import moment from 'moment';
import { color } from 'react-native-reanimated';
import { formatNumber } from '../../utils/moeda';
import { Transaction } from '../../pages/AddTransition';

import { getDocs,doc, documentId, query, collection, where, getFirestore, updateDoc, writeBatch } from "@firebase/firestore";
import Checkbox from 'expo-checkbox';

type Props = TouchableOpacityProps & {
    data: Transaction;
}

export function ListItem({data, ...rest}: Props){

    const [isChecked, setIsChecked] = useState(data.pago);
    
    const database = getFirestore();

    function isEnable(): void {  
             
        setIsChecked(!isChecked) 
        updatepago(!isChecked) 

        console.log(data.title + " " + isChecked);

    }

    async function updatepago(value:boolean) {
        console.log("updatepago " + value);
        
        const q = query(collection(database, "users", "11979589357", "savemoney", "transaction", "item"), where("id", "==", data.id));
        const querySnapshot = await getDocs(q);
        var idTrans;
        const batch = writeBatch(database);

        querySnapshot.forEach((doc) => {
            const docId = doc.id
            idTrans = docId
        });

        const washingtonRef = doc(database, "users", "11979589357", "savemoney", "transaction", "item", `${idTrans}`);
        batch.update(washingtonRef, {"pago": value});
        await batch.commit();

    }

    useEffect(() => {        
    },[])

    return (
            <View style={estilo.content}>
                <TouchableOpacity 
                    activeOpacity={0.7}
                    style={{width: '65%'}}
                    {...rest}
                >              
                    
                    <View style={estilo.boxOne}>
                        <View style={estilo.boxMes}>
                            <Text style={estilo.txtDia}>{moment(data.data).locale('pt').format('DD')}</Text>
                            <Text style={estilo.txtSemana}>{moment(data.data).format('ddd').toUpperCase()}</Text>
                        </View>
                        <View>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={estilo.titulo}>{data.title}</Text>
                                {data.parcela != 0 &&
                                    <Text style={estilo.parcela}>{data.nrparcela}/{data.parcela == 0 ? "" : data.parcela}</Text>
                                }
                            </View>
                            {data.tipo == "Receita" ?
                            <Text style={estilo.tag2}>{data.tag}</Text>
                            :
                            <Text style={estilo.tag}>{data.tag}</Text>
                            }
                        </View>                   
                    </View>

                </TouchableOpacity>

                <View style={estilo.boxTwo}>
                    {data.tipo == "Despesa" ? 
                    <Text style={estilo.txtValor2}> -R$ {formatNumber(data.valor)}</Text>
                    :
                    <Text style={estilo.txtValor}>R$ {formatNumber(data.valor)}</Text>
                    }
                     {/* <Checkbox
                        style={{ borderColor: theme.colors.background}}
                        value={isChecked}
                        onValueChange={isEnable}
                        color={isChecked ? '#4630EB' : undefined}
                        />   */}
                    <TouchableOpacity 
                        style={estilo.icon} 
                        onPress={isEnable}
                    >
                        <Feather  
                            name={isChecked == true ? "check" : "x"}
                            color={isChecked == false ? "red" : "black"}
                            size={19}
                        /> 
                    
                   </TouchableOpacity>
                </View>
            </View>            
    );
  }