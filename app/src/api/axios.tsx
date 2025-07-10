import axios from "axios";

export default axios.create(
    {      
        baseURL: 'http://213.176.114.172:5000/api'
    }
);