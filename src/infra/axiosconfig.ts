import axios from "axios";

const api = axios.create({
  baseURL: "https://sua-api.com/api", // ajuste a URL conforme seu backend
  timeout: 5000,
});

export default api;
