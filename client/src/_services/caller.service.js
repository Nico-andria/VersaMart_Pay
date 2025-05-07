import axios from "axios"

const Axios = axios.create({
    baseURL : 'http://localhost:8800',
    headers:{
        'authorization': `Bearer ${localStorage.getItem("token")}`
    }
})

export default Axios