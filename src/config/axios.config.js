import axios from "axios";
import { config } from "./index.js";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL:
    config.ENV === "development"
      ? config.CLIENT_SERVER_URL
      : config.CLIENT_SERVER_URL,
});

export default axiosInstance;
