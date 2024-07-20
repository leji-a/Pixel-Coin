const axios = require('axios')

const apis = [
    {
        baseURL: 'https://labor3-d60e.restdb.io/rest/',
        headers: { 'x-apikey': '64a2e9bc86d8c525a3ed8f63' }
    },
    {
        baseURL: 'https://laboratorio3-5459.restdb.io/rest/',
        headers: { 'x-apikey': '64a57c2b86d8c50fe6ed8fa5' }
    },
    {
        baseURL: 'https://laboratorio-36cf.restdb.io/rest/',
        headers: { 'x-apikey': '64a5ccf686d8c5d256ed8fce' }
    },
    {
        baseURL: 'https://laboratorio3-f36a.restdb.io/rest/',
        headers: { 'x-apikey': '64bdbb6f86d8c5e18ded91e3' }
    },
    {
        baseURL: 'https://laboratorio3-5fc7.restdb.io/rest/',
        headers: { 'x-apikey': '64bdbc3386d8c5613ded91e7' }
    },
    {
        baseURL: 'https://laboratorio-ab82.restdb.io/rest/',
        headers: { 'x-apikey': '650b525568885487530c00bb' }
    },
    {
        baseURL: 'https://laboratorio-afe2.restdb.io/rest/',
        headers: { 'x-apikey': '650b53356888544ec60c00bf' }
    },
    {
        baseURL: 'https://laboratorio3-f36a.restdb.io/rest/',
        headers: { 'x-apikey': '60eb09146661365596af552f' }
    }
]

async function createApiClient() {
    for (const api of apis) {
        try {
            const response = await axios.get(`${api.baseURL}transactions`, { headers: api.headers })
            if (response.status === 200) {
                return axios.create(api)
            }
        } catch (error) {
            console.error(`Error with API ${api.baseURL}: `, error.message)
        }
    }
    throw new Error('All APIs failed')
}

async function main() {
    try {
        const apiClient = await createApiClient()
        // Realiza requests
        const response = await apiClient.get('transactions')
        console.log(response.data)
    } catch (error) {
        console.error('Failed to create API client:', error.message)
    }
}

main()