import { StyleSheet } from 'react-native';
import { theme } from '../../global/style/theme';

export const estilo = StyleSheet.create({
    content: {
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignContent: 'center',
        marginTop: 15,
    },
    title: {
        fontFamily: theme.fonts.title500,
        fontSize: 18,
        color: theme.colors.secondary30,
        marginBottom: 10
    }
});