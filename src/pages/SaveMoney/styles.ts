import { theme } from '../../global/style/theme';
import { StyleSheet } from 'react-native';

export const estilo = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignSelf: 'center',
      },
      header: {

      },
      headerContent: {
        justifyContent: "center", 
        flexDirection: 'row',
        marginVertical: 15
      },
      boxCategory: {
        marginRight: 15
      },
      boxItemcategory: {
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 18,
        marginBottom: 15,
        marginRight: 19,
        backgroundColor: theme.colors.heading
      },
      txtMesAno: {
        fontFamily: theme.fonts.title500,
        fontSize: 20,
        marginHorizontal: 15
      },
      btnActions: {
        alignSelf: 'center', 
        flexDirection: 'row',
        marginBottom: 10
      },
      modalBox: {
        backgroundColor: theme.colors.transparent,
        height: 450,
      },
      modalDelete: {
        backgroundColor: theme.colors.backroudnd2, 
        marginHorizontal: 5, 
        borderRadius: 15,
      },
      minus: {
        justifyContent: 'center',
        alignItems: 'center'
      },
      boxModalValores: {
        borderRadius: 10,
        elevation: 1,
        backgroundColor: theme.colors.heading,
        marginBottom: 5,
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 18,
        paddingVertical: 5,
        marginHorizontal: 5
      },
      txtIcon: {
        fontFamily: theme.fonts.title700,
        fontSize: 13,
        alignItems: 'center'
      },
      renderContentTxt:{
        fontFamily: theme.fonts.title700,
        fontSize: 17
      },
      renderContentValue: {
        fontFamily: theme.fonts.title500,
        fontSize: 17
      },
      renderContentBox: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center'
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
      marginTop: 35
  },
})