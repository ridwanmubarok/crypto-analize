import { API_ROUTES } from "@/constants/routes"
import Axios from "@/apis/__common/axios"
const getSummary = async () => {
  const result = await Axios.get(
    API_ROUTES.SUMMARY
  );
  return result.data;
};
export {getSummary}