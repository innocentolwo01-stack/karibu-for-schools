import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
export default function Index(){const {ready,onboarded,session}=useApp(); if(!ready)return <View style={{flex:1,backgroundColor:colors.black}}/>; if(!onboarded)return <Redirect href="/welcome"/>; if(!session)return <Redirect href="/login"/>; return <Redirect href={`/${session.role}/home` as any}/>}
