import axios from 'axios'

const baseURL = 'https://internshipbackend.vercel.app/api/v1'
const axiosInstance = axios.create({
    baseURL: baseURL,
    headers:{
        'Content-Type': 'application/json',
    }
})

export default axiosInstance