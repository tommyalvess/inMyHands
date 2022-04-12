import { StyleSheet } from 'react-native';
import { theme } from '../../global/style/theme';
import {getStatusBarHeight} from 'react-native-iphone-x-helper'

export const estilo = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 15
    },
    txtErro: {
        //flex: 1,
        color: "red",
        fontFamily: theme.fonts.text500,
        fontSize: 12,
        marginTop: 5
    },
    btnSalvarItem: {
        width: 280,
        height: 65,
        borderRadius: 10,
        elevation: 1,
        backgroundColor: theme.colors.secondary30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '5%'
    },
    input: {
        height: 25,
        width: 280,
        borderWidth: 1,
        backgroundColor: theme.colors.transparent,
        marginTop: 5,
        borderBottomColor: '#90c5ff',
        borderColor: theme.colors.transparent
    },
    txtTitleModal: {
        fontFamily: theme.fonts.title700, 
        fontSize: 23, 
        marginBottom: 25,
    },
    modalBox: {
        backgroundColor: theme.colors.backroudnd2, 
        marginHorizontal: 5, 
        borderRadius: 15,
    },
})