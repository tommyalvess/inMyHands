    import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { estilo } from './styles';

import { getDocs,doc, documentId, query, collection, where, getFirestore, updateDoc, writeBatch } from "@firebase/firestore";
import { ItemConta } from '../../pages/Conta';
import { SimpleLineIcons } from '@expo/vector-icons'; 
import { camelcase } from '../../utils/CamelCase';
import Checkbox from 'expo-checkbox';
import { theme } from '../../global/style/theme';

type Props = TouchableOpacityProps & {
    data: ItemConta;
    checkBox?: boolean
}

export function ListItemConta({data,checkBox, ...rest}: Props){

    const [checked, setChecked] = useState(false);
    const database = getFirestore();
    const batch = writeBatch(database);
    const [isChecked, setIsChecked] = useState(false);

    function isEnable(): void {
        setChecked(!checked)
        //updatepago(!data.pago)
    }

    async function updatepago(value:boolean) {
        const q = query(collection(database, "users", "11979589357", "savemoney", "transaction", "item"), where("id", "==", data.childData.id));
        const querySnapshot = await getDocs(q);
        var idTrans;

        querySnapshot.forEach((doc) => {
            const docId = doc.id
            idTrans = docId
            console.log(docId);            
        });

        const washingtonRef = doc(database, "users", "11979589357", "savemoney", "transaction", "item", `${idTrans}`);
        batch.update(washingtonRef, {"pago": value});
        await batch.commit();

    }

    useEffect(() => {
    }, [])

    return (

        <TouchableOpacity 
            style={estilo.content}
            activeOpacity={0.7}
            {...rest}
        >              
            <View style={{flexDirection: 'row'}}>
                {checkBox && 
                    <Checkbox
                        style={{ borderColor: theme.colors.background}}
                        value={isChecked}
                        onValueChange={setIsChecked}
                        color={isChecked ? '#4630EB' : undefined}
                    />  
                }
               
                <Text style={estilo.title}>{data.desc.toString().replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</Text>
            </View>
            <SimpleLineIcons name="arrow-right" size={17} color="black" />   
                
        </TouchableOpacity>
    );
  }