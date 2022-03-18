import { StyleSheet } from 'react-native';
import { theme } from '../../global/style/theme';

export const estilo = StyleSheet.create({
   
  modalBox: {
    flex:1, 
    backgroundColor: theme.colors.backroudnd2
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
  box1: {
    height: 37,
    width: '95%',
    borderRadius: 10,
    backgroundColor: "#e8e9eb",
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSalvar: {
    height: 55,
    borderRadius: 10,
    elevation: 1,
    backgroundColor: theme.colors.secondary30,
    justifyContent: 'center',
    alignItems: 'center',
    width: '95%',
    marginBottom: 30
  },
  txtBtn: {
    fontFamily: theme.fonts.title700,
    color: "white",
    fontSize: 20,
  },
})