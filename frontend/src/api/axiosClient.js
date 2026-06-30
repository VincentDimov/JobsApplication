import axios from "axios";

// Dynamisk baseURL beroende på miljö
const baseURL =
  import.meta.env.MODE === "development"
    ? "http://localhost:4000/api"
    : "https://jobs-application-delta.vercel.app/api";

const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  }
});

export default axiosClient;
