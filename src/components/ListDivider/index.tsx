import React from 'react';
import { View } from 'react-native';

import { estilo } from './styles';

type Props = {
  isCentered?: boolean;
}

export function ListDivider({ isCentered }: Props){
  return (
    <View 
      style={[
        estilo.container,
        isCentered ? {
          marginVertical: 2,
        } : {
          marginTop: 2,
          marginBottom: 31,
        }
      ]}
    />
  );
}