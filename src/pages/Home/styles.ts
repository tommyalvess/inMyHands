import { StyleSheet } from 'react-native';
import { theme } from '../../global/style/theme';
import {getStatusBarHeight} from 'react-native-iphone-x-helper'

export const estilo = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignSelf: 'center',
      },
    header: {
      height: 175,
      backgroundColor: theme.colors.background
    },
    boxOne: {
      borderRadius: 30,
      marginTop: -30,
      backgroundColor: theme.colors.backroudnd2,
     },
    contentBox: {
      flexDirection: 'row',
      marginHorizontal: 15,
      marginVertical: 10,
      justifyContent: 'space-around'
    },
    top: {
      marginTop: getStatusBarHeight() + 30,
      marginHorizontal: 15,
    },
    boxAviso: {
      backgroundColor: '#fff',
      width: '85%',
      height: 55,
      justifyContent: 'center',
      borderRadius: 15,
      margin: 15,
      alignItems: 'center',
      alignSelf: 'center'
    }
    
})