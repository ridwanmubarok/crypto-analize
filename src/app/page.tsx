'use client';

import { usePair } from "./hooks/usePair";
import RealtimeMarketPrediction from "@/components/custom/realtime-prediction";

export default function Home() {
  const { pair,activePair,setActivePair } = usePair();
  const mappedPairs = pair.map(item => ({
    label: item.traded_currency_unit,
    value: item.id
  }));
  return (
    <main className="flex min-h-screen flex-col p-24">


        <div className="flex justify-center mb-10 pb-10">
          <div className="flex flex-col justify-center">
              <h1 className="text-7xl text-center font-bold text-white mb-5">TO THE MOON</h1>
              <p className="text-lg text-center text-white">
                    To The Moon is a free, user-friendly platform for crypto analysis, 
                    offering real-time market insights, trends, and predictive analytics to empower both beginners and experts in making informed decisions. Available at no cost for everyone.
              </p>
          </div>
        </div>
        
        <div className="grid gap-3 grid-cols-12">

            <div className="col-span-12 ">
              {
                pair?.length > 0 && (
                  <RealtimeMarketPrediction listPairs={pair}/>
                )
              }
            </div>

            {/* <div className="col-span-12">
                <Card>
                  <CardHeader>
                      <CardTitle>Summary</CardTitle>
                      <CardDescription>Real Time Summary</CardDescription>
                  </CardHeader>
                  <CardContent className="min-h-[500px]">
                      {
                        activePair ? (
                          <>
                            <RealTimeMarket currency_id={activePair}/>
                          </>
                        ) : (
                          <>
                            <div className="h-full flex flex-col justify-center items-center text-gray-500">
                                Please Select Pair For analytics
                            </div>
                          </>
                        )
                      }
                  </CardContent>
                </Card>
            </div> */}

        </div>
    </main>
  );
}
