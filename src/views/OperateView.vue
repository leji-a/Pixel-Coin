<template>
    <div v-if="store.Logged">
        <p>¿Qué operación hará?</p>
        <select v-model="operacion.action">
            <option v-for="operacion in CryptoM.GetOptions()" :key="operacion.option" :value="operacion.option"> {{
                operacion.name }}</option>
        </select>
        <select v-model="operacion.crypto_code">
            <option v-for="coin in CryptoM.GetCrypto()" :key="coin.code" :value="coin.code"> {{ coin.name }}</option>
        </select>
        <input type="number" min="0.000001" v-model="operacion.crypto_amount" placeholder="Cantidad">
        <p>Cantidad en pesos argentinos {{ operacion.money }}</p>
        Fecha: <input type="date" v-model="date.fecha" :max="actualString">
        Hora: <input type="time" v-model="date.hora">
        <button @click="Operate">{{ option.name }}</button>
    </div>
    <div v-else>
        <button @click="routerPush">Ir al login</button>
    </div>
</template>

<script setup>
import { UserStore } from "@/store/User"
import { useRouter } from "vue-router"
import { ref, watch, computed, onMounted } from 'vue'
import CryptoManager from '@/services/CryptoManager'
import TransactionsManager from '@/services/TransactionsManager'

const store = UserStore()
const router = useRouter()
const CryptoM = new CryptoManager()

let operacion = ref({
    user_id: store.Username,
    action: 'purchase',
    crypto_code: 'btc',
    crypto_amount: 0,
    money: 0,
    datetime: ''
})

const fetchAndCheckTransactions = async () => {
    try {
        await TransactionsManager.fetchTransactions()
        return TransactionsManager.getTransactions()
    } catch (error) {
        console.error("Error fetching transactions:", error)
        return [] // empty array on error
    }
}

const Operate = async () => {
    const cryptoAmount = Number(operacion.value.crypto_amount)
    // Validate crypto amount
    if (isNaN(cryptoAmount) || cryptoAmount <= 0) {
        console.log("Invalid crypto amount. Please enter a positive value.")
        return
    }

    // Destructure operation data
    const { action, cryptoCode, /*...rest*/ } = operacion.value

    try {
        const transactions = await fetchAndCheckTransactions()
        const transactionsArray = transactions
        
        const moneda = transactionsArray.find(coin => coin.code === cryptoCode) //revisar code
        if (!moneda) {
            console.error("Error: Coin not found in fetched transactions.")
            return // No coin
        }

        let resultado
        switch (action) {
            case 'purchase':
                resultado = await TransactionsManager.postTransaction({ ...operacion.value })
                console.log("Purchase status: ", resultado)
                break
            case 'sell':
                if (moneda && moneda.balance >= cryptoAmount) { //revisar balance
                    resultado = await TransactionsManager.postTransaction({ ...operacion.value })
                    console.log("Sell status: ", resultado)
                } else {
                    console.log("Insufficient funds. Your balance is lower than the sell amount.")
                }
                break
            default:
                console.error("Invalid action: ", action)
        }
    } catch (error) {
        console.error("Error:", error)
    }
}
const option = computed(() => {
    return CryptoM.GetOptions().find(operation => operation.option === operacion.value.action)
})

const Fecha = () => {
    const fecha = new Date(
        parseInt(date.value.actual.slice(0, 4)),
        parseInt(date.value.actual.slice(5, 7)) - 1,
        parseInt(date.value.actual.slice(8, 10)),
        parseInt(date.value.hora.slice(0, 2)),
        parseInt(date.value.hora.slice(3, 5))
    )
    operacion.value.datetime = fecha.toISOString()
}
const actual = new Date()
const actualString = actual.toISOString().slice(0, 10)
let date = ref({
    actual: actualString,
    hora: '00:00'
})
// Funciones de ayuda
function validateCryptoAmount(amount) {
    const numberAmount = Number(amount)
    return isNaN(numberAmount) || numberAmount <= 0 ? 0 : numberAmount
}
function calculateTotal(price, action, amount) {
    if (action === 'purchase') {
        return price.totalAsk * amount  
    } else {
        return price.totalBid * amount
    }
}
const Update = async () => {
    // Validate and adjust crypto amount
    const cryptoAmount = validateCryptoAmount(operacion.value.crypto_amount)

    if (cryptoAmount > 0) {
        const Price = await CryptoM.getPrice(operacion.value.crypto_code)
        operacion.value.money = calculateTotal(Price, operacion.value.action, cryptoAmount).toFixed(2)
    } else {
        // Money 0 if invalid or non-positive amount
        operacion.value.money = 0
    }
}

watch(operacion.value, Update)
watch(date, Fecha)

const routerPush = () => {
    router.push({ name: 'Login' })
}

onMounted(() => {
    Fecha()
})
</script>