<template>
  <div v-if="store.Logged" class="Logincontainer">
    <h1>Balance actual de la cuetna</h1>
    <div v-if="!load && movimientos">
      <div v-if="balances.length !== 0">
      <div>
        <table>
          <thead>
            <tr>
              <th>CriptoMoneda</th>
              <th>Cantidad</th>
              <th>Dinero</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(moneda, index) in movimientos" :key="index">
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>Total de dinero en cuenta: ${{  }}</p>
    </div>
    <div v-else>
      <p>¡La cuenta se encuentra vacía!</p>
    </div>
    </div>   
  </div>

  <div v-else>
    <button @click="routerPush">Ir al login</button>
  </div>
</template>


<script setup>
import { UserStore } from '@/store/User'
import { useRouter } from "vue-router"
import { onMounted, ref } from 'vue'
import TransactionsManager from '@/services/TransactionsManager';
//import CryptoManager from '@/services/CryptoManager';
const store = UserStore()
const router = useRouter()

const routerPush = () => {
    router.push({ name: 'Login' })
}

let load = ref(true)
let movimientos = ref([])

onMounted(async () => {
    await reload()
})

const reload = async () => {
    try {
        load.value = true
        await TransactionsManager.fetchTransactions()
       /* const transactions = TransactionsManager.getStatus().filter(coin => coin.balance > 0)//Revisar
        movimientos.value = transactions

        for(const coin of CryptoManager.getPrice()){
                const Precios = await CryptoManager.getPrice(coin.code);
                cotizaciones.push({codigo: moneda.codigo, valor: Cotizacion.totalAsk})
            }*/
    } catch (err) {
        console.log(err)
        movimientos.value = []
    } finally {
        load.value = false
    }
}
</script>
