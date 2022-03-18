import { StyleSheet } from 'react-native';
import { theme } from '../../global/style/theme';

export const estilo = StyleSheet.create({
    content: {
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: 'center', 
        marginTop: 15,
    },
    boxMes: {
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
    titulo: {
        marginRight: 5, 
        fontFamily: theme.fonts.text500, 
        color: theme.colors.secondary60
    },
    parcela: {
        fontFamily: theme.fonts.text400, 
        color: theme.colors.secondary30
    },
    tag: {
        fontFamily: theme.fonts.text500,
    },
    tag2: {
        fontFamily: theme.fonts.text500,
        color: theme.colors.green_dark,
    },
    boxOne: {
        flexDirection: 'row'
    },
    boxTwo:{
        flexDirection: 'row', 
        alignItems: 'center'
    },
    txtValor: {
        marginRight: 5, 
        fontFamily: theme.fonts.title700, 
        fontSize: 16,
        color: theme.colors.green_dark
    },
    txtValor2: {
        marginRight: 5, 
        fontFamily: theme.fonts.text500, 
        color: 'red'
    },
    icon: {
        backgroundColor: theme.colors.heading, 
        borderRadius: 5
    }
});