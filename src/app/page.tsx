'use client';

import Image from "next/image";
import { usePair } from "./hooks/usePair";
import SummaryRealtime from "@/components/custom/summary-realtime";
import { useSummary } from "./hooks/useSummary";
import { useState } from "react";

export default function Home() {
  const { pair } = usePair();
  const { summary } = useSummary();
  const [currencyFormat, setCurrencyFormat] = useState(true);

  const changeCurrency = (val: boolean) => {
    setCurrencyFormat(val)
  }
  
  const processData = Object.entries(summary)
  .filter(([key, _]) => currencyFormat ? key.endsWith('_idr') : key.endsWith('_usdt')) 
  .map(([key, value]) => ({
    new_id: key,
    ...value
  })); 
  const initialData = pair
  .filter(item => currencyFormat ? item.ticker_id.endsWith('_idr') : item.ticker_id.endsWith('_usdt'))
  .map(item => {
    const matchedData = processData.find(processItem => processItem.new_id === item.ticker_id);
    if (!matchedData) return { ...item }; 
    const volumeCoinKey: keyof typeof matchedData = `vol_${item.ticker_id.split('_')[0]}` as keyof typeof matchedData;
    const volume_coin = matchedData[volumeCoinKey] ?? 0;
    return matchedData ? {
      ...item,
      ...matchedData,
      last_price: matchedData.last || 0,
      lowest: matchedData.low || 0,
      highest: matchedData.high || 0,
      volume_idr: matchedData.vol_idr || 0,
      volume_coin: volume_coin,
      last_updated: null,
      prediction: "",
      prediction_price: "",
    } : { ...item };
  });

  return (
    <main className="flex min-h-screen flex-col lg:p-24 p-3">
      
      <div className="flex justify-center">
            <div className="flex p-3 flex-wrap items-center flex-col justify-center mb-10 pb-10">
              <div className="grid grid-cols-12 gap-5 justify-center">
                <div className="order-2 lg:order-1 col-span-12 lg:col-span-8 flex flex-col justify-center">
                      <div className="mb-3">
                        <h1 className="text-5xl font-bold text-white">TO THE MOON</h1>
                        <h1 className="text-5xl font-bold text-white">CRYPTO INDICATORS</h1>
                      </div>
                      <p className="text-lg text-white text-justify">
                          To The Moon is a free, user-friendly platform for crypto analysis, 
                          offering real-time market insights, trends, and predictive analytics to empower both beginners and experts in making informed decisions. Available at no cost for everyone.
                      </p>
                </div>
                <div className="order-1 lg:order-2 lg:col-span-4 col-span-12 relative">
                  <Image src={'/assets/logo.png'} className="object-cover" alt="logo-cat-moon" width={500} height={500}/> 
                </div>
              </div>
            </div>
        </div>

        <div className="grid gap-3 grid-cols-12">
            <div className="col-span-12">
              <SummaryRealtime setCurrency={(e)=> changeCurrency(e)} currency={currencyFormat} listPairs={initialData}/>
            </div>
        </div>
    </main>
  );
}
