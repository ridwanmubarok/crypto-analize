import { getServerTime } from "@/apis/server_time/getServerTime"
import { getServerTimeRes } from "@/apis/server_time/server_time.dto";
import { useEffect, useState } from "react";

export const useServerTime = () => {
    const [ServerTime, setServerTime] = useState<getServerTimeRes>();
    const [Loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true)
        const data = await getServerTime();
        if(data){
            setServerTime(data);
        }
        setLoading(false)
    }

    useEffect(() => {
       fetchData() 
    },[])

    return {
        ServerTime
    }
}