import { StyleSheet } from 'react-native';
import { theme } from '../../global/style/theme';

export const estilo = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignSelf: 'center',
      },

      box1: {
        height: 55,
        borderRadius: 10,
        elevation: 1,
        backgroundColor: theme.colors.backroudnd2,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15
      },

      btnSalvar: {
        height: 55,
        borderRadius: 10,
        elevation: 1,
        backgroundColor: theme.colors.secondary30,
        marginBottom: 15,
        justifyContent: 'center',
        alignItems: 'center'
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

      txtBtn: {
        fontFamily: theme.fonts.title700,
        color: "white",
        fontSize: 20,
      },

      box1estilo: {
        flexDirection: 'row',
        width: '100%',
        height: 55,
        borderRadius: 10,
        elevation: 1,
        backgroundColor: theme.colors.backroudnd2,
        marginBottom: 15,
        alignItems: 'center'
      },
      titleContent: {
        fontFamily: theme.fonts.title700,
        fontSize: 16
      },
      modalBox: {
        backgroundColor: theme.colors.backroudnd2, 
        marginHorizontal: 5, 
        borderRadius: 15,
        justifyContent: 'center'
      },


})