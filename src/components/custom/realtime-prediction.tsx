import { currencyPair } from "@/apis/pair/pair.dto";
import { useIndodax } from "@/app/hooks/useIndodax";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table,TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCryptoVolume } from "@/utils/helper";
import { useEffect, useState } from "react";
import { ArrowUp,ArrowDown } from 'lucide-react';


const RealtimeMarketPrediction = ({ listPairs }:{listPairs:currencyPair[] }) => {
    const { marketData,Loading } = useIndodax({ Initsummary24:true })
    const [processedData, setProcessedData] = useState(() => listPairs
    .filter(item => item.ticker_id.endsWith('_idr'))
    .map(item => ({
      ...item,
      last_price: 0,
      lowest: 0,
      highest: 0,
      price_at: 0,
      volume_idr: 0,
      volume_coin: 0,
      last_updated: null,
      prediction: "",
      prediction_price: "",
    }))
  );

  const sortPredictions = (a: currencyPair, b:currencyPair): number => {
    if (a.last_price === 0 && b.last_price !== 0) return 1; // a has no price, b comes first
    if (b.last_price === 0 && a.last_price !== 0) return -1; // b has no price, a comes first
    return 0; // default return value when a and b are considered equal
  };

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
            const isOversold = marketItem[2] <= marketItem[3] * 1.05; // Adding oversold condition
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
      }).sort(sortPredictions); 
      setProcessedData(updatedData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Loading,marketData]);

    if(Loading){
        <>
            Mohon Tunggu
        </>
    }

    return(
        <Card className="w-full">
          <CardHeader>
              <CardTitle>Analysis</CardTitle>
          </CardHeader>
          <CardContent>
          <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Name</TableHead>
                  <TableHead>Last Price</TableHead>
                  <TableHead>Lowest Price</TableHead>
                  <TableHead>Highest Price</TableHead>
                  <TableHead>Price at T-24h</TableHead>
                  <TableHead>IDR Volume</TableHead>
                  <TableHead>Coin Volume</TableHead>
                  <TableHead>analysis</TableHead> 
                  <TableHead>Indicator</TableHead> 
                  <TableHead>(%)</TableHead> 
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedData?.map((data, key) => (
                  <TableRow key={key}>
                    <TableCell className="font-bold uppercase">{data.traded_currency}</TableCell>
                    <TableCell className="font-bold uppercase">{formatCryptoVolume(data.last_price)}</TableCell>
                    <TableCell className="font-bold uppercase">{formatCryptoVolume(data.lowest)}</TableCell>
                    <TableCell className="font-bold uppercase">{formatCryptoVolume(data.highest)}</TableCell>
                    <TableCell className="font-bold uppercase">{formatCryptoVolume(data.price_at)}</TableCell>
                    <TableCell className="font-bold uppercase">{formatCryptoVolume(data.volume_idr)}</TableCell>
                    <TableCell className="font-bold uppercase">{formatCryptoVolume(data.volume_coin)}</TableCell>
                    <TableCell>
                        {renderbadgeIndicator(data.prediction)}
                    </TableCell>
                    <TableCell>
                        {renderIndicator(data.prediction)}
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
            return <span className="p-1.5 bg-green-500 text-white rounded-md">{status} </span>
        case 'Bearish':
            return <span className="p-1.5 bg-red-500 text-white rounded-md">{status}</span>
        case 'Overbought':
            return <span className="p-1.5 bg-blue-500 text-white rounded-md">{status}</span>
        case 'High Volatility':
            return <span className="p-1.5 bg-yellow-500 text-white rounded-md">{status}</span>
        case 'Oversold':
            return <span className="p-1.5 bg-orange-500 text-white rounded-md">{status}</span>
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