import { currencyPair } from "@/apis/pair/pair.dto";
import { useIndodax } from "@/app/hooks/useIndodax";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table,TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCryptoVolume } from "@/utils/helper";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp,ArrowDown } from 'lucide-react';
import { Input } from "@/components/ui/input"
import debounce from "lodash.debounce";
import { Button } from "@/components/ui/button"

interface RealtimeMarketPredictionProps {
  listPairs: any[];
  currency: boolean;
  setCurrency: (val: boolean) => void;
}

const RealtimeMarketPrediction: React.FC<RealtimeMarketPredictionProps> = ({ listPairs,currency,setCurrency }) => {
  const { marketData,Loading } = useIndodax({ Initsummary24:true })
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [processedData, setProcessedData] = useState<any[]>([]);
  const prevProcessedDataRef = useRef<any[]>([]); // Ref to hold the previous state for comparison

  const debouncedSearchTerm = useMemo(() => debounce(setSearchTerm, 300), []);

    useEffect(() => {
      const initialData = listPairs
        .filter(item => currency ? item.ticker_id.endsWith('_idr') : item.ticker_id.endsWith('_usdt') )
        .map(item => ({
          ...item,
        }));
      setProcessedData(initialData);
    }, [listPairs,currency]);

    useEffect(() => {
      if (!Loading) {
          const updatedData = processedData.map(processedItem => {
              const marketItem = marketData.find(item => item[0] === processedItem.id);
              if (marketItem) {
                const priceChange = marketItem[2] - marketItem[5];
                const priceRange = marketItem[4] - marketItem[3];
                const priceChangePercentage = (priceChange / marketItem[5]) * 100; 
                const isBullish = priceChange > 0 && priceChange / marketItem[5] > 0.05;
                const isBearish = priceChange < 0 && Math.abs(priceChange / marketItem[5]) > 0.05;
                const isOverbought = marketItem[2] >= marketItem[4] * 0.95;
                const isOversold = marketItem[2] <= marketItem[3] * 1.05;
                const highVolatility = priceRange / marketItem[5] > 0.1;
                let prediction = "";
                if (isBullish) {
                  prediction = "Bullish";
                } else if (isBearish) {
                  prediction = "Bearish";
                } else if (isOverbought) {
                  prediction = "Overbought";
                }else if(isOversold){
                    prediction = "Oversold";
                } else if (highVolatility) {
                  prediction = "High Volatility";
                }
              return {
                ...processedItem,
                last_price: marketItem[2],
                lowest: marketItem[3],
                highest: marketItem[4],
                price_at: marketItem[5],
                volume_idr: marketItem[6],
                volume_coin: marketItem[7],
                prediction,
                prediction_price: priceChangePercentage.toFixed(2) + "%"
              };
            }
              return processedItem;
          })
          .sort(sortPredictions); 
          setProcessedData(updatedData);
          prevProcessedDataRef.current = processedData;
      }
    }, [Loading, marketData]);

    const sortPredictions = (a: currencyPair, b:currencyPair): number => {
      if (a.prediction === "" && b.prediction !== "") return 1;
      if (b.prediction === "" && a.prediction !== "") return -1;
      return 0;
    };

    const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      debouncedSearchTerm(event.target.value);
    }, [debouncedSearchTerm]);
    const filteredData = useMemo(() => processedData.filter(data =>
      data.traded_currency.toLowerCase().includes(searchTerm.toLowerCase())
    ), [processedData, searchTerm]);

    const hasDataChanged = (currentItem: currencyPair, index: number) => {
        const prevItem = prevProcessedDataRef.current[index];
        return prevItem && currentItem.last_price !== prevItem.last_price;
      };
    


    return(
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
              <div className="flex flex-col gap-3">
                <CardTitle className="me-5">Realtime Market { currency ? '(IDR)' : '(USDT)' }</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button onClick={()=> setCurrency(true) } className={`${currency ? 'bg-blue-500' : 'bg-gray-500'}`}>IDR</Button>
                  <Button onClick={()=> setCurrency(false) } className={`${!currency ? 'bg-blue-500' : 'bg-gray-500'}`}>USDT</Button>
                </div>
              </div>
              
              <div className="w-1/2">
                <Input onChange={handleSearchChange} type="text" placeholder="Search ....." />
              </div>
          </CardHeader>
          <CardContent>
          <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticker</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>analysis</TableHead> 
                  <TableHead>Indicator</TableHead> 
                  <TableHead>(%)</TableHead> 
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData?.map((data: currencyPair, key) => (
                  <TableRow className={`${hasDataChanged(data,key) ? 'bg-green-100' : ''}`} key={key}>
                    <TableCell className="font-bold uppercase">{data.traded_currency}</TableCell>
                    <TableCell>
                        <div className="flex flex-col">
                          <div className="flex">
                              <span className="w-[50px] text-xs mr-3">Low</span>
                              <span className="font-bold">
                                {formatCryptoVolume(data.last_price ?? 0, currency ? 'idr' : 'usdt')}
                              </span>
                          </div>
                          <div className="flex">
                              <span className="w-[50px] text-xs mr-3">High</span>
                              <span className="font-bold">
                                {formatCryptoVolume(data.highest ?? 0, currency ? 'idr' : 'usdt')}
                              </span>
                          </div>
                          <div className="flex">
                              <span className="w-[50px] text-xs mr-3">24</span>
                              <span className="font-bold">
                                {formatCryptoVolume(data.price_at ?? 0, currency ? 'idr' : 'usdt')}
                              </span>
                          </div>
                          <div className="flex">
                              <span className="w-[50px] text-xs mr-3">Last</span>
                              <span className="font-bold">
                                {formatCryptoVolume(data.last_price ?? 0, currency ? 'idr' : 'usdt')}
                              </span>
                          </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-col">
                          <div className="flex">
                              <span className="w-[50px] text-xs mr-3">{currency ? 'IDR' : 'USDT'}</span>
                              <span className="font-bold">
                                {formatCryptoVolume(data.volume_idr ?? 0, currency ? 'idr' : 'usdt')}
                              </span>
                          </div>
                          <div className="flex">
                              <span className="w-[50px] text-xs mr-3 uppercase">{data?.traded_currency}</span>
                              <span className="font-bold">
                                {formatCryptoVolume(data.volume_coin ?? 0, currency ? 'idr' : 'usdt')}
                              </span>
                          </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        {renderbadgeIndicator(data.prediction ?? '-')}
                    </TableCell>
                    <TableCell>
                        {renderIndicator(data.prediction ?? '-')}
                    </TableCell>
                    <TableCell>
                        {data.prediction_price}
                    </TableCell>

                  </TableRow>
                ))} 
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    )
}

const renderbadgeIndicator = (status: string) => {
    switch (status) {
        case 'Bullish':
            return <span className="text-xs font-bold p-1.5 bg-green-500 text-white rounded-md">{status} </span>
        case 'Bearish':
            return <span className="text-xs font-bold p-1.5 bg-red-500 text-white rounded-md">{status}</span>
        case 'Overbought':
            return <span className="text-xs font-bold p-1.5 bg-blue-500 text-white rounded-md">{status}</span>
        case 'High Volatility':
            return <span className="text-xs font-bold p-1.5 bg-yellow-500 text-white rounded-md">{status}</span>
        case 'Oversold':
            return <span className="text-xs font-bold p-1.5 bg-orange-500 text-white rounded-md">{status}</span>
    }
}


const renderIndicator = (status: string) => {
    switch (status) {
        case 'Bullish':
            return <ArrowUp className="text-green-500"/>
        case 'Bearish':
            return <ArrowDown className="text-red-500"/>
        case 'Overbought':
            return '-'
        case 'High Volatility':
            return '-'
        case 'Oversold':
            return <ArrowDown/>
    }
}


export default RealtimeMarketPrediction;