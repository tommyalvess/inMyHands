import { StyleSheet} from 'react-native';
import { theme } from '../../global/style/theme';

export const estilo = StyleSheet.create({

    container: {
        width: 150,
        height: 150,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    avatar: {
        width: 46,
        height: 46,
        borderRadius: 45,
        marginTop: 25
    },

    title:{
        fontFamily: theme.fonts.title700,
        fontSize: 16,
        color: "#000",
        marginBottom: 25
    }

})