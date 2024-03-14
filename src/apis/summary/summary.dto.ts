export type CurrencyResponse = {
    high: string,
    low: string,
    vol_idr: string,
    last: string,
    buy: string,
    sell: string,
    server_time: number,
    name: string,
    [key: string]: string | number;
    [key: `vol_${string}`]: string;
};

export type currency24 = {
    [key:string]: string | number,
};

export type currency7d = {
    [key:string]: string | number,
};

export type CurrencyData = {
    name: string;
    volume_coin: number;
    volume_idr: number;
    trend?: 'Bullish' | 'Bearish' | 'Neutral';
  };