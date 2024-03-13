'use client';

import Image from "next/image";
import { usePair } from "./hooks/usePair";
import RealtimeMarketPrediction from "@/components/custom/realtime-prediction";

export default function Home() {
  const { pair } = usePair();
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
              {
                pair?.length > 0 && (
                  <RealtimeMarketPrediction currency={'usdt'} listPairs={pair}/>
                )
              }
            </div>
        </div>
    </main>
  );
}
