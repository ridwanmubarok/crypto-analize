import { getSummary } from "@/apis/summary/getSummary";
import { CurrencyResponse, currency24, currency7d } from "@/apis/summary/summary.dto";
import { useEffect, useState } from "react";


type ResponseSummary = {
    tickers: CurrencyResponse[],
    prices_24h: any,
    prices_7d: any
}

export const useSummary = () => {
    const [summary, setSummary] = useState<CurrencyResponse[]>([]);
    const [summaryPrice24, setsummaryPrice24] = useState<currency24[]>([]);
    const [summaryPrice7, setsummaryPrice7] = useState<currency7d[]>([]);
    const [Loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true)
        const data = await getSummary();
        if(data){
            setSummary(data.tickers);
            setsummaryPrice24(data.prices_24h)
            setsummaryPrice7(data.prices_7d)
        }
        setLoading(false)
    }

    useEffect(() => {
       fetchData() 
    },[])

    return {
        summary,
        summaryPrice24,
        summaryPrice7,
        Loading
    }
}