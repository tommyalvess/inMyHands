import { StyleSheet } from 'react-native';
import { theme } from '../../global/style/theme';
import {getStatusBarHeight} from 'react-native-iphone-x-helper'

export const estilo = StyleSheet.create({
      modalBox: {
        flex: 1,
        backgroundColor: theme.colors.backroudnd2,
        borderRadius: 30,
        alignItems: 'center',
        height:400
      },
      box1: {
        height: 40,
        width: '95%',
        borderRadius: 10,
        backgroundColor: "#e8e9eb",
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
      titleHeader: {
          marginVertical: 15,
          fontFamily: theme.fonts.title700,
          fontSize: 18,
          
      },
      titulo:{
        marginVertical: 3,
        fontFamily: theme.fonts.title500,
        fontSize: 18
      },
      txtBtn: {
        fontFamily: theme.fonts.title700,
        color: "white",
        fontSize: 20,
      },
      btnSalvar: {
        height: 55,
        borderRadius: 10,
        elevation: 1,
        backgroundColor: theme.colors.secondary30,
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        marginBottom: 30
      },
      boxContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
      },
      boxDate: {
        marginRight: 5, 
        alignItems: 'center'
      },
      txtDia: {
        fontFamily: theme.fonts.text500, 
        fontSize: 17, 
        color: theme.colors.background
      },
      txtSemana: {
        fontFamily: theme.fonts.text400, 
        fontSize: 10, 
        color: theme.colors.secondary100
      },
      tituloItem: {
        fontFamily: theme.fonts.text500, 
        marginLeft: 10,
        fontSize: 15,
        color: theme.colors.secondary30
    },
    subTitle: {
      fontFamily: theme.fonts.text500, 
      fontSize: 13,
    },
    modalDelete: {
      backgroundColor: theme.colors.backroudnd2, 
      marginHorizontal: 5, 
      borderRadius: 15,
    },
    txtTitleModal: {
      fontFamily: theme.fonts.title700, 
      fontSize: 23, 
      marginBottom: 25,
    },
    btnSalvarItem: {
      width: 280,
      height: 65,
      borderRadius: 10,
      elevation: 1,
      backgroundColor: theme.colors.secondary30,
      justifyContent: 'center',
      alignItems: 'center',
    },

})