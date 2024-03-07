import { currencyPair } from "@/apis/pair/pair.dto";
import { useEffect, useState } from "react";
import { getPairs } from "@/apis/pair/getPair";

export const usePair = () => {
    const [pair, setPair] = useState<currencyPair[]>([]);
    const [activePair,setActivePair] = useState("");
    const [Loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true)
        const data = await getPairs();
        if(data){
            setPair(data);
        }
        setLoading(false)
    }

    useEffect(() => {
       fetchData() 
    },[])

    return {
        pair,
        Loading,
        activePair,
        setActivePair
    }
}