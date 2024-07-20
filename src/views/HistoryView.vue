<template>
    <div v-if="store.Logged">
        Historial
        <div v-if="!load">
            <table v-if="movimientos.length !== 0">
                <thead>
                    <tr>
                        <th>Número de movimiento</th>
                        <th>Tipo de movimiento</th>
                        <th>CriptoMoneda</th>
                        <th>Cantidad</th>
                        <th>Total</th>
                        <th>Fecha y Hora</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(movimiento, index) in movimientos" :key="index">
                        <td>{{ movimiento._id }}</td>
                        <td>{{ operacion(movimiento.action).name }}</td>
                        <td>{{ moneda(movimiento.crypto_code).name }}</td>
                        <td>{{ movimiento.crypto_amount }}</td>
                        <td>${{ movimiento.money }}</td>
                        <td>{{ formatearFecha(movimiento.datetime) }}</td>
                        
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

</template>

<script setup>
import { UserStore } from '@/store/User'
import { onMounted, ref } from 'vue'
import TransactionsManager from '@/services/TransactionsManager';
import CryptoManager from '@/services/CryptoManager';

let load = ref(true)
let movimientos = ref([])

const TransactionsM = new TransactionsManager()
const CryptoM = new CryptoManager()
const store = UserStore()

const reload = async () => {
    try {
        load.value = true
        await TransactionsManager.fetchTransaction()
        movimientos.value = TransactionsManager.fetchTransaction()
    } catch (err) {
        console.log(err)
    } finally {
        load.value = false
    }
}
const moneda = (code) => {
    return CryptoM.GetCrypto().find(coin => coin.code === code)
}

const operacion = (code) => {
    return CryptoM.GetOptions().find(option => option.option === code)
}
const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);

    const opciones = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const formato = new Intl.DateTimeFormat('es-ES', opciones);
    const fechaFormateada = formato.format(fecha);

    return fechaFormateada + "hs";
}
onMounted(async () => {
    await reload()
})
</script>