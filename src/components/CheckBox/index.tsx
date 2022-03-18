import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { estilo } from './styles';
import { color } from 'react-native-reanimated';
import Checkbox from 'expo-checkbox';
import { theme } from '../../global/style/theme';


type Props = TouchableOpacityProps & {
    data: any;
}

export function CheckBox({data, ...rest}: Props){

    const [isChecked, setChecked] = useState(false);
    function isEnable(): void {
        setChecked(isChecked == true ? false:true)        
    }

    return (
            <View style={estilo.checkbox}>
                <Checkbox
                    style={{ borderColor: theme.colors.background}}
                    value={isChecked}
                    onValueChange={setChecked}
                    color={isChecked ? '#4630EB' : undefined}
                />  
                <Text style={{fontSize:20, marginLeft: 12, color: theme.colors.secondary30, fontFamily: theme.fonts.title700}}>{data.desc}</Text>  
            </View>            
    );
  }