<template>
  <div class="container">
    <div v-if="!load"> 
      <table class="table-responsive table table-bordered-dark table-striped small prices-table">
        <thead>
          <tr class="fs-4">
            <th class="moneda">Moneda</th>
            <th class="compra">Precio compra</th>
            <th class="venta">Precio Venta</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="coin in prices" :key="coin.nombre">
            <td>{{ coin.nombre }}</td>
            <td>${{ coin.purchase }}</td>
            <td>${{ coin.sell }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="cargando fs-4" v-else>
      <p class="text-center">Cargando precios...</p>  
    </div>
  </div>
</template>

<script setup>
import CryptoManager from "@/services/CryptoManager";
import { ref, onMounted } from 'vue';

const CryptoM = new CryptoManager();

const prices = ref([]);
const load = ref(false);

const update = async () => {
  prices.value.length = 0;
  load.value = true;
  for (const coin of CryptoM.GetCrypto()) {
    const cotizacion = await CryptoM.getPrice(coin.code);
    prices.value.push({
      nombre: coin.name,
      purchase: cotizacion.totalAsk,
      sell: cotizacion.totalBid
    });
  }
  load.value = false;
}

onMounted(() => {
  update();
});
</script>

<style scoped>
.container {
  width: 100%; /* Ancho completo */
  max-width: 400px; /* Ancho máximo reducido */
  height: auto; /* Altura automática */
  overflow-y: auto; /* Permite desplazamiento vertical si es necesario */
}
</style>
