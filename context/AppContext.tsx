import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Role = 'parent' | 'student' | 'teacher';
export type Session = { role: Role; name: string; identifier: string };
type AppState = {
  ready: boolean; onboarded: boolean; session: Session | null; feeBalance: number;
  paidTrips: Record<string, boolean>; tripConsent: Record<string, boolean>; bookedSlot: string | null;
  finishOnboarding: () => Promise<void>; login: (role: Role, identifier: string) => Promise<void>; logout: () => Promise<void>;
  payFee: (amount: number) => Promise<void>; payTrip: (id: string) => Promise<void>; setConsent: (id: string, value: boolean) => Promise<void>; bookAppointment: (slot: string) => Promise<void>;
};
const AppContext = createContext<AppState | null>(null);
const KEYS = { onboarded:'kfs_onboarded', session:'kfs_session', finance:'kfs_finance' };

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready,setReady]=useState(false); const [onboarded,setOnboarded]=useState(false); const [session,setSession]=useState<Session|null>(null);
  const [feeBalance,setFeeBalance]=useState(1250000); const [paidTrips,setPaidTrips]=useState<Record<string,boolean>>({}); const [tripConsent,setTripConsent]=useState<Record<string,boolean>>({}); const [bookedSlot,setBookedSlot]=useState<string|null>(null);
  useEffect(()=>{(async()=>{try{
    setOnboarded((await AsyncStorage.getItem(KEYS.onboarded))==='1');
    const s=await AsyncStorage.getItem(KEYS.session); if(s) setSession(JSON.parse(s));
    const f=await AsyncStorage.getItem(KEYS.finance); if(f){const parsed=JSON.parse(f); setFeeBalance(parsed.feeBalance ?? 1250000); setPaidTrips(parsed.paidTrips ?? {}); setTripConsent(parsed.tripConsent ?? {}); setBookedSlot(parsed.bookedSlot ?? null);}
  }finally{setReady(true)}})()},[]);
  const persistFinance=async(next:any)=>AsyncStorage.setItem(KEYS.finance,JSON.stringify({feeBalance:next.feeBalance??feeBalance,paidTrips:next.paidTrips??paidTrips,tripConsent:next.tripConsent??tripConsent,bookedSlot:next.bookedSlot??bookedSlot}));
  const finishOnboarding=async()=>{setOnboarded(true); await AsyncStorage.setItem(KEYS.onboarded,'1')};
  const login=async(role:Role,identifier:string)=>{const names={parent:'Innocent',student:'Amani',teacher:'Mrs Nakato'}; const next={role,name:names[role],identifier}; setSession(next); await AsyncStorage.setItem(KEYS.session,JSON.stringify(next));};
  const logout=async()=>{setSession(null); await AsyncStorage.removeItem(KEYS.session)};
  const payFee=async(amount:number)=>{const next=Math.max(0,feeBalance-amount); setFeeBalance(next); await persistFinance({feeBalance:next})};
  const payTrip=async(id:string)=>{const next={...paidTrips,[id]:true}; setPaidTrips(next); await persistFinance({paidTrips:next})};
  const setConsent=async(id:string,value:boolean)=>{const next={...tripConsent,[id]:value}; setTripConsent(next); await persistFinance({tripConsent:next})};
  const bookAppointment=async(slot:string)=>{setBookedSlot(slot); await persistFinance({bookedSlot:slot})};
  const value=useMemo(()=>({ready,onboarded,session,feeBalance,paidTrips,tripConsent,bookedSlot,finishOnboarding,login,logout,payFee,payTrip,setConsent,bookAppointment}),[ready,onboarded,session,feeBalance,paidTrips,tripConsent,bookedSlot]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp(){const ctx=useContext(AppContext); if(!ctx) throw new Error('useApp must be inside AppProvider'); return ctx;}
