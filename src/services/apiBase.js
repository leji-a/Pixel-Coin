import axios from "axios";

const apiBase = axios.create({
	baseURL: 'https://laboratorio3-5459.restdb.io/rest/',
	headers: {'x-apikey': '64a57c2b86d8c50fe6ed8fa5'}
}); 

export default apiBase;