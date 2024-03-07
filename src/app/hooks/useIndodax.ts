import { useEffect, useState, useRef } from "react";
import { fromUnixTime } from 'date-fns';
import { any } from "zod";

interface PricePoint {
    x: Date; // Using Date object for the x-axis (time)
    y: number; // Price for the y-axis
  }
  
  interface ChartData {
    series: Array<{
      name: string;
      data: PricePoint[];
    }>;
  }

export const useIndodax = ({
  InitchartTick = false,
  InitmarketTrade = false,
  Initsummary24 = false,
  pair_id,
}: {
  InitchartTick?: boolean,
  Initsummary24?: boolean,
  InitmarketTrade?: boolean,
  pair_id?: string,
}) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [marketData,setMarketData] = useState([]);
  const [chartData, setChartData] = useState<ChartData>({
    series: [
      {
        name: 'Price',
        data: [],
      },
    ],
  });
  const [Loading,setLoading] = useState(true);

  useEffect(() => {
    const webSocket = new WebSocket('wss://ws3.indodax.com/ws/');
    webSocket.onopen = () => {
      const authMessage = JSON.stringify({
        "params": {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE5NDY2MTg0MTV9.UR1lBM6Eqh0yWz-PVirw1uPCxe60FdchR8eNVdsskeo",
        },
        "id": 1
      });
      webSocket.send(authMessage);
      if (Initsummary24) {
        subscribeToSummary24();
      }
      if (InitchartTick && pair_id) {
        chartTick(pair_id);
      }
      if (InitmarketTrade && pair_id) {
        subscribeMarketTrade(pair_id);
      }
    };
    webSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data?.result) {
        if(data?.result?.channel){
            if(data?.result?.channel?.startsWith('chart:tick')){
                const tickData = data.result.data.data;
                const newData = tickData.map((tick: any) => ({
                  x: new Date(tick[0] * 1000), // Convert UNIX timestamp to JavaScript Date
                  y: tick[2], // Use the price point
                }));
                setChartData(prevChartData => ({
                  series: [{
                    ...prevChartData.series[0],
                    data: [...prevChartData.series[0].data, ...newData],
                  }],
                }));
            }else if(data?.result?.channel === 'market:summary-24h'){
              setMarketData(data?.result?.data?.data)
              setLoading(false);
            }
        }
      }
    };
    webSocket.onerror = (error) => {
      console.error('WebSocket Error: ', error);
    };
    wsRef.current = webSocket;
    return () => {
      webSocket.close();
    };
  }, [pair_id, InitchartTick, Initsummary24, InitmarketTrade]);

  const chartTick = (pair_id: string) => {
    const subscribeMessage = JSON.stringify({
      "method": "subscribe",
      "params": {
        "channel": `chart:tick-${pair_id}`
      },
      "id": 2
    });
    wsRef.current?.send(subscribeMessage);
  };

  const subscribeToSummary24 = () => {
    const subscribeMessage = JSON.stringify({
      "method": "subscribe",
      "params": {
        "channel": "market:summary-24h"
      },
      "id": 3
    });
    wsRef.current?.send(subscribeMessage);
  };

  const subscribeMarketTrade = (pair_id: string) => {
    const subscribeMessage = JSON.stringify({
      "method": "subscribe",
      "params": {
        "channel": `market:trade-activity-${pair_id}`
      },
      "id": 4
    });
    wsRef.current?.send(subscribeMessage);
  };

  return {
    chartData,
    marketData,
    Loading
  };
};
