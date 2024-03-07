'use client';

import { Card,CardContent,CardDescription,CardHeader,CardTitle } from "@/components/ui/card";
import {  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,} from "@/components/ui/table"
import { useSummary } from "./hooks/useSummary";
import { CurrencyResponse } from "@/apis/summary/summary.dto";
import {  formatCryptoVolume, formatRupiah, technicalAnalysis, toTimeFormat } from "@/utils/helper";
import { usePair } from "./hooks/usePair";
import { SearchSelect } from "@/components/custom/search-select";
import RealTimeMarket from "@/components/custom/realtime-market-chart";



function isCurrencyResponse(value: any): value is CurrencyResponse {
  return typeof value === 'object' && 'last' in value && 'high' in value; // Adjust based on required properties
}

export default function Home() {
  const { summary, summaryPrice24, summaryPrice7 } = useSummary();
  const { pair,activePair,setActivePair } = usePair();

  const summaryArray = summary
  ? Object.entries(summary)
      .map(([key, value]): [string, any] => [key, value])
      .filter(([key, value]) => key.endsWith('_idr') && isCurrencyResponse(value))
      .map(([key, value]) => {
        const volumeKey = Object.keys(value).find(k => k.startsWith('vol_') && k !== 'vol_idr');
        if (!volumeKey) {
          return { ...value, volume_coin: undefined };
        }
        const volumeCoin = value[volumeKey];
        const { [volumeKey]: _, ...rest } = value;
        return { ...rest, volume_coin: volumeCoin as string | number };
      })
  : [];

  const summaryArray24 = Object.entries(summaryPrice24).map(([key, value]) => {
    const nameWithoutIdr = key.replace(/idr$/, ''); 
    return { name: nameWithoutIdr, value: String(value) };
  });

  const summaryArray7 = Object.entries(summaryPrice7).map(([key, value]) => {
    const nameWithoutIdr = key.replace(/idr$/, ''); 
    return { name: nameWithoutIdr, value: String(value) };
  });

  const mappedPairs = pair.map(item => ({
    label: item.traded_currency_unit,
    value: item.id
  }));
  
  
  return (
    <main className="flex min-h-screen flex-col p-24">


        <div className="flex justify-center mb-10 pb-10">
          <div className="flex flex-col justify-center">
              <h1 className="text-7xl text-center font-bold text-white mb-5">TO THE MOON</h1>
              <p className="text-lg text-center text-white mx-[700px]">
                    To The Moon is a free, user-friendly platform for crypto analysis, 
                    offering real-time market insights, trends, and predictive analytics to empower both beginners and experts in making informed decisions. Available at no cost for everyone.
              </p>
          </div>
        </div>

        <div className="flex justify-between mb-10">
                <h2 className="text-3xl text-white font-bold">Market Analisis</h2>
                <SearchSelect onChange={(value)=> setActivePair(value) } options={mappedPairs}/>
        </div>

        <div className="grid gap-3 grid-cols-12">

            <div className="col-span-12">
                <Card>
                  <CardHeader>
                      <CardTitle>Summary</CardTitle>
                      <CardDescription>Real Time Summary</CardDescription>
                  </CardHeader>
                  <CardContent className="overflow-y-auto h-[700px]">
                      <RealTimeMarket/>
                      {/* {
                        activePair ? (
                          <>

                          </>
                        ) : (
                          <>
                            <div className="h-full flex flex-col justify-center items-center text-gray-500">
                                Please Select Pair For analytics
                            </div>
                          </>
                        )
                      } */}
                  </CardContent>
                </Card>
            </div>

            <div className="col-span-8 flex flex-col">
                <Card>
                  <CardHeader>
                      <CardTitle>Summary</CardTitle>
                      <CardDescription>Real Time Summary</CardDescription>
                  </CardHeader>
                  <CardContent className="overflow-y-auto h-[700px]">
                  <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Name</TableHead>
                          <TableHead>High</TableHead>
                          <TableHead>Low</TableHead>
                          <TableHead>Last</TableHead>
                          <TableHead>Vol COIN</TableHead>
                          <TableHead>Vol IDR</TableHead>
                          <TableHead className="text-right">Change</TableHead>
                          <TableHead className="text-right">Range</TableHead>
                          <TableHead className="text-right">Volume Ratio</TableHead>
                          <TableHead className="text-right">Server Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {summaryArray?.map((data, key) => (
                          <TableRow key={key}>
                            <TableCell className="font-bold">{data.name}</TableCell>
                            <TableCell className="font-medium">{formatCryptoVolume(data.high)}</TableCell>
                            <TableCell className="font-medium">{formatCryptoVolume(data.low)}</TableCell>
                            <TableCell className="font-medium">{formatCryptoVolume(data.last)}</TableCell>
                            <TableCell className="font-medium">{formatCryptoVolume(data.volume_coin)}</TableCell>
                            <TableCell className="font-medium">{formatRupiah(data.vol_idr)}</TableCell>
                            <TableCell className="font-medium text-right">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md`}>
                                {
                                  technicalAnalysis(data).priceChangePercent
                                }
                              </span>
                            </TableCell>
                            <TableCell className="font-medium text-right">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md`}>
                                {
                                  technicalAnalysis(data).priceRange
                                }
                              </span>
                            </TableCell>
                            <TableCell className="font-medium text-right">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md`}>
                                {
                                  technicalAnalysis(data).volRatio
                                }
                              </span>
                            </TableCell>
                            <TableCell className="font-medium text-right">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md`}>
                                {
                                  toTimeFormat(data.server_time)
                                }
                              </span>
                            </TableCell>
                          </TableRow>
                        ))} 
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

            <div className="col-span-4">
                <div className="flex gap-2 w-full">
                <Card className="w-full">
                  <CardHeader>
                      <CardTitle>24 Hours</CardTitle>
                      <CardDescription>Summary (24 Hours) Price</CardDescription>
                  </CardHeader>
                  <CardContent className="overflow-y-auto flex flex-col gap-3 h-[700px]">
                      {
                        summaryArray24?.map((item,key) => {
                          return (
                            <div key={key} className="flex justify-between">
                                <h3 className="font-medium uppercase">
                                  {item?.name}
                                </h3>
                                <h5>
                                  {formatCryptoVolume(item?.value)}
                                </h5>
                            </div>
                          )
                        })
                      }
                  </CardContent>
                </Card>
                <Card className="w-full">
                  <CardHeader>
                      <CardTitle>7 Days</CardTitle>
                      <CardDescription>Summary (7D) Price</CardDescription>
                  </CardHeader>
                  <CardContent className="overflow-y-auto flex flex-col gap-3 h-[700px]">
                      {
                        summaryArray7?.map((item,key) => {
                          return (
                            <div key={key} className="flex justify-between">
                                <h3 className="font-medium uppercase">
                                  {item?.name}
                                </h3>
                                <h5>
                                  {formatCryptoVolume(item?.value)}
                                </h5>
                            </div>
                          )
                        })
                      }
                  </CardContent>
                </Card>
                </div>
            </div>
                      

        </div>
    </main>
  );
}
