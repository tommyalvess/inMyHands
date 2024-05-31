import React, { useEffect, useRef, useState } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity,
    Platform,
     } from 'react-native';
import { RectButton, ScrollView } from "react-native-gesture-handler";
import { BoxItem } from "../../components/BoxItem";
import { useNavigation } from '@react-navigation/native';
import { Perfil } from "../../components/Perfil";
import app from "../../utils/firebase";

import * as Notifications from 'expo-notifications';
import moment from "moment";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { formatNumber } from "../../utils/moeda";
import { theme } from "../../global/style/theme";

export function Home(){

    return (
        <View>

        </View>
    )
}