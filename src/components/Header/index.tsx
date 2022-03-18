import React from "react";

import {
    Image,
    Text, 
    TouchableOpacity, 
    View 
} from 'react-native';

import {MaterialIcons,Ionicons,AntDesign,Feather } from '@expo/vector-icons'

import { estilo } from "./styles";
import { theme } from "../../global/style/theme";
import { useNavigation } from "@react-navigation/native";

type Props = {
    titulo: string,
    action: string, 
    haveIcon?: boolean,
    btnAction?: () => void;
}

export function Header({titulo, action, haveIcon, btnAction}: Props) {

    const navigation = useNavigation();

    function handleTopage() {
        navigation.navigate(action as never, {} as never)
    }

    return(
        <View style={{flexDirection: 'row', alignItems:'center', justifyContent: 'space-between', marginBottom: 15}}>
            <TouchableOpacity onPress={handleTopage}>
                <Ionicons    
                    name="chevron-back-outline"
                    color="#000"
                    size={30}
                    style={{marginLeft: -9}}
                />
            </TouchableOpacity>
            <Text style={{fontFamily: theme.fonts.title700, fontSize: 19}}>{titulo}</Text>
            {haveIcon == true ? 
                <TouchableOpacity onPress={btnAction}>
                     <Ionicons    
                        name="ios-add-circle-outline"
                        color="#000"
                        size={30}
                        style={{marginLeft: -9}}
                    />
                </TouchableOpacity>
                :
              <Text></Text>
            }
        </View>
    )
}
