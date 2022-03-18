import React from 'react';
import {NavigationContainer} from '@react-navigation/native'

import StackRoutes from './stack.routes'
import { navigationRef } from './rootNavigation';

const Routes = () => (
    <NavigationContainer >
        <StackRoutes />
    </NavigationContainer>
)

export default Routes;