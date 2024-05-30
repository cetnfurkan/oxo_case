import axios from "axios";

const BASE_URL = process.env.API_URL || "http://localhost:3010";

console.log("API URL", BASE_URL);


const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 1000,
});

instance.interceptors.request.use((config) => {
  
  console.log("Request was sent", config.baseURL! + config.url);
  

  return config;
});

instance.interceptors.response.use((response) => {
  
  console.log("Response was received", response.config.url);
  

  return response;
});

export default instance;