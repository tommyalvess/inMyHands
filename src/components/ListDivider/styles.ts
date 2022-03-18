import { StyleSheet } from 'react-native';
import { theme } from '../../global/style/theme';

export const estilo = StyleSheet.create({
  container: {
    height: 1,
    width: '100%',
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.highlight,    
    marginTop: 4,
    marginVertical: 31,
  }
});