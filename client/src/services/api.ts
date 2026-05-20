import axios from "axios";

const API = axios.create({
  // Localhost hata kar aapka live Render backend URL daal diya h
  baseURL: "https://socialsync-ai-v8qq.onrender.com/api",
});

export default API;