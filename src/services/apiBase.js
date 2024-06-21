import axios from 'axios'

const apiBase = axios.create({
    baseURL: "",
    headers: {'x-apikey': ''}
})

export default apiBase