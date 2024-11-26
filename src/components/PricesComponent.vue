<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <div class="table-container p-4">
      <div v-if="!load">
        <table class="table table-bordered table-striped text-center">
          <thead class="table-dark">
            <tr>
              <th>Moneda</th>
              <th>Precio compra</th>
              <th>Precio venta</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="coin in prices" :key="coin.nombre">
              <td>{{ coin.nombre }}</td>
              <td>${{ coin.purchase.toLocaleString() }}</td>
              <td>${{ coin.sell.toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="text-center fs-5" v-else>
        <p>Cargando precios...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import CryptoManager from "@/services/CryptoManager";
import { ref, onMounted } from "vue";

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
      sell: cotizacion.totalBid,
    });
  }
  load.value = false;
};

onMounted(() => {
  update();
});
</script>

<style scoped>
.d-flex {
  background: linear-gradient(135deg, #6a11cb, #2575fc); /* Fondo con gradiente */
}

.table-container {
  max-width: 500px; /* Ancho máximo de la tabla */
  width: 100%;
  background-color: #ffffff; /* Fondo blanco */
  border-radius: 12px; /* Bordes redondeados */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Sombra */
  overflow: hidden; /* Asegura que el contenido no se desborde */
}

.table {
  margin: 0; /* Elimina el margen por defecto */
  border-collapse: collapse; /* Colapsa los bordes */
}

.table th, .table td {
  color: #000; /* Asegura que el texto sea visible */
  padding: 12px; /* Añade espacio interno */
  border-bottom: 1px solid #ddd; /* Añade una línea divisoria */
}

.table th {
  background-color: #343a40; /* Fondo oscuro para el encabezado */
  color: #fff; /* Texto blanco para el encabezado */
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: #f9f9f9; /* Color de fondo para filas impares */
}

.table-hover tbody tr:hover {
  background-color: #f1f1f1; /* Color de fondo al pasar el cursor */
}

p {
  color: #000; /* Color del texto "Cargando precios" */
}
</style>
