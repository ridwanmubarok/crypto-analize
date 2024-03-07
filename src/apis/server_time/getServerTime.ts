import { API_ROUTES } from "@/constants/routes"
import Axios from "@/apis/__common/axios"
const getServerTime = async () => {
  const result = await Axios.get(
    API_ROUTES.SERVER_TIME
  );
  return result.data;
};
export {getServerTime}