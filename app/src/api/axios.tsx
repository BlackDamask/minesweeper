import { API_BASE_URL } from "./config";
import axios from "axios";

export default axios.create({
    baseURL: API_BASE_URL
});