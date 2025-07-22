import axios from "axios";

export default axios.create(
    {      
        baseURL: 'http://51.20.207.233:5000/api'
    }
);