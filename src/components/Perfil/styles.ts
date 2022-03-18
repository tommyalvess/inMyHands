import { theme } from './../../global/style/theme';
import { StyleSheet} from 'react-native';

export const estilo = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    user: {
        flexDirection: 'row'
    },
    greeting: {
        fontFamily: theme.fonts.title500,
        fontSize: 24,
        color: theme.colors.heading,
        marginRight: 6
    },
    username: {
        fontFamily: theme.fonts.title700,
        fontSize: 24,
        color: theme.colors.heading,
    },
    msg: {
        fontFamily: theme.fonts.text400,
        color: theme.colors.highlight,
    }
})