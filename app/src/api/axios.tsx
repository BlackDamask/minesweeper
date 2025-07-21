import axios from "axios";

export default axios.create(
    {      
        baseURL: 'http://51.20.132.10:5000/api'
    }
);