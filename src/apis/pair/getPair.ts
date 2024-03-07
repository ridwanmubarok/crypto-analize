import { API_ROUTES } from "@/constants/routes"
import Axios from "@/apis/__common/axios"
const getPairs = async () => {
  const result = await Axios.get(
    API_ROUTES.PAIR
  );
  return result.data;
};
export {getPairs}