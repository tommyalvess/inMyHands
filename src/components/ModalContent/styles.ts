import { StyleSheet } from 'react-native';
import { theme } from '../../global/style/theme';

export const estilo = StyleSheet.create({
  boxContentModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtModalDes: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 16
  },
  input: {
    height: 25,
    width: 280,
    borderWidth: 1,
    backgroundColor: theme.colors.transparent,
    marginBottom: 40,
    marginTop: 5,
    borderBottomColor: '#90c5ff',
    borderColor: theme.colors.transparent
  },
  txtModal: {
    fontFamily: theme.fonts.title700,
    color: theme.colors.primary,
    fontSize: 20,
    marginBottom: 10
  },
  btnSalvarItem: {
    width: 280,
    height: 65,
    borderRadius: 10,
    elevation: 1,
    backgroundColor: theme.colors.secondary30,
    justifyContent: 'center',
    alignItems: 'center'
  },
});