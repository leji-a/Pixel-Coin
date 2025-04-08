import axios from 'axios'

class CryptoManager {
    // Properties
    CryptoCurrency = [
        {
            code: "btc",
            name: "BitCoin"
        },
        
        {
            code: "eth",
            name: "Ethereum"
        },
        {
            code: "usdt",
            name: "Tether USDt"
        },
        
    ]
    TradeOptions = [
        {
            option: "purchase",
            name: "purchase"
        },
        {
            option: "sell",
            name: "sell"
        },
        
    ]
    // Constructor
    constructor() { }

    // Methods
    GetCrypto() { return this.CryptoCurrency }
    GetOptions() { return this.TradeOptions }    
    async getPrice(Crypto) {
        try {
            const response = await axios.get(`https://criptoya.com/api/argenbtc/${Crypto}/ars`)
            
            return response.data
        } catch (err) {
            console.log(err)
        }
    }
}

export default CryptoManager