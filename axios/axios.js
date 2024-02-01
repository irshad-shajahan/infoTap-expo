import axios from 'axios'

const baseURL='http://192.168.29.239:8080/api'
export default  axios.create({
    baseURL,
    withCredentials:true
    
})

// export const axiosPrivate= axios.create({
//     baseURL: 'http://localhost:8000',
//     headers: { 'Content-Type': 'application/json' },
//     withCredentials:true
// })
