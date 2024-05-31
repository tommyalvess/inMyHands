import React from 'react';
import {createStackNavigator} from '@react-navigation/stack'
import { AddTransition } from '../pages/AddTransition';
import { SaveMoney } from '../pages/SaveMoney';
import { Conta } from '../pages/Conta';
import { Categoria } from '../pages/Categoria';
import { Analise } from '../pages/Analise';
import { UpdateTransaction } from '../pages/UpdateTransaction';
import { Faxina } from '../pages/Faxina';
import { Compras } from '../pages/Compras';
import { UpdateFaxina } from '../pages/UpdateFaxina';
import { Tarefa } from '../pages/Tarefa';
import { Mercado } from '../pages/Mercado';
import { Orcamentos } from '../pages/Orcamento';
import { Reparo } from '../pages/Reparo';
import { HomeV2 } from '../pages/HomeV2';

const stackRoutes = createStackNavigator();


const AppRoutes: React.FC = () => (
    <stackRoutes.Navigator
        screenOptions={{
            headerShown: false,
            cardStyle: {
                backgroundColor: "#fff",
            },
        }}
    >

        <stackRoutes.Screen
            name="Home"
            component={HomeV2}
        />

        <stackRoutes.Screen
            name="SaveMoney"
            component={SaveMoney}
        />

        <stackRoutes.Screen
            name="AddTransition"
            component={AddTransition}
        />

        <stackRoutes.Screen
            name="Conta"
            component={Conta}
        />

        <stackRoutes.Screen
            name="Categoria"
            component={Categoria}
        />  

        <stackRoutes.Screen
            name="Analise"
            component={Analise}
        />  

        <stackRoutes.Screen
            name="UpdateTransaction"
            component={UpdateTransaction}
        /> 

        <stackRoutes.Screen
            name="Faxina"
            component={Faxina}
        />  

        <stackRoutes.Screen
            name="Compras"
            component={Compras}
        />  

        <stackRoutes.Screen
            name="UpdateFaxina"
            component={UpdateFaxina}
        />               

        <stackRoutes.Screen
            name="Tarefa"
            component={Tarefa}
        />    

        <stackRoutes.Screen
            name="Mercado"
            component={Mercado}
        />   

        <stackRoutes.Screen
            name="Orcamentos"
            component={Orcamentos}
        />  

        <stackRoutes.Screen
            name="Reparo"
            component={Reparo}
        />  


    </stackRoutes.Navigator>

)

export default AppRoutes;