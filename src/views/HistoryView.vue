<template>
    <div v-if="store.Logged" class="history-container">
      <h2 class="history-title">Historial de Ventas</h2>
      <div v-if="!load && movimientos" class="table-container">
        <table v-if="movimientos.length !== 0" class="history-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Tipo</th>
              <th>Criptomoneda</th>
              <th>Cantidad</th>
              <th>Total</th>
              <th>Fecha y Hora</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(movimiento, index) in movimientos" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ operacion(movimiento.action).name }}</td>
              <td>{{ moneda(movimiento.crypto_code).name }}</td>
              <td>{{ movimiento.crypto_amount }}</td>
              <td>${{ movimiento.money.toLocaleString('es-ES') }}</td>
              <td>{{ formatearFecha(movimiento.datetime) }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else class="no-movimientos">No hay movimientos para mostrar.</p>
      </div>
      <div v-else class="loader-container">
        <span class="loader"></span>
        <p class="loading-text">Cargando historial...</p>
      </div>
    </div>
    <div v-else class="login-container">
        <h1 class="error-title">NO DEBERIAS ESTAR AQUI!!!!</h1>
        <h3 class="error-message">Debes logearte para poder utilizar la página</h3>
        <button @click="volverAlLogin()">Volver al inicio</button>
    </div>
  </template>
  
  <script setup>
  import { UserStore } from '@/store/User';
  import { onMounted, ref } from 'vue';
  import { useRouter } from "vue-router";
  import TransactionsManager from '@/services/TransactionsManager';
  import CryptoManager from '@/services/CryptoManager';
  
  const CryptoM = new CryptoManager();
  const store = UserStore();
  const route = useRouter();

  const volverAlLogin = () => {
    route.push({ name: 'Login' });
};
  
  let load = ref(true);
  let movimientos = ref([]);
  
  const reload = async () => {
    try {
      load.value = true;
      await TransactionsManager.fetchTransactions();
      movimientos.value = TransactionsManager.getTransactions();
    } catch (err) {
      console.log(err);
      movimientos.value = [];
    } finally {
      load.value = false;
    }
  };
  
  const moneda = (code) => CryptoM.GetCrypto().find(coin => coin.code === code);
  const operacion = (code) => CryptoM.GetOptions().find(option => option.option === code) || { name: code };
  
  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Intl.DateTimeFormat('es-ES', opciones).format(fecha) + "hs";
  };
  
  onMounted(async () => {
    await reload();
  });
  </script>
  
  <style scoped>
  /* Contenedor principal */
  .history-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem;
  }
  
  /* Título */
  .history-title {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 60px;
    color: #000000;
  }
  
  /* Tabla */
  .table-container {
    width: 100%;
    overflow-x: auto;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 20px 80px rgb(0, 0, 0);
  }
  
  .history-table {
    width: 100%;
    border-collapse: collapse;
    text-align: center;
    margin: 0;
  }
  
  .history-table th {
    background-color: #182c42;
    color: white;
    padding: 12px;
    font-size: 14px;
    text-transform: uppercase;
  }
  
  .history-table td {
    padding: 12px;
    font-size: 14px;
    color: #000000;
    border-bottom: 1px solid #ddd;
  }
  
  .history-table tr:nth-child(even) {
    background-color: #ffffff;
  }
  
  .history-table tr:hover {
    background-color: #8895a1;
  }
  
  /* Sin movimientos */
  .no-movimientos {
    font-size: 16px;
    font-weight: bold;
    color: #aa1616;
    text-align: center;
    margin: 20px 0;
  }
  
  /* Loader */
  .loader-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;
  }
  
  .loader {
    border: 4px solid #f3f3f3;
    border-top: 10px dotted #681474;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  .loading-text {
    margin-top: 10px;
    color: #000000;
    font-size: 20px;
  }
  
  /* Botón de login */
  .login-container {
    text-align: center;
    margin-top: 20px;
  }
  
  .btn-login {
    padding: 12px 24px;
    background-color: #4e1764;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }
  
  .btn-login:hover {
    background-color: #7528cc;
}

.error-title {
    font-size: 2rem;
    color: #f44336;
    margin-bottom: 10px;
    font-weight: bold;
}

.error-message {
    font-size: 1.4rem;
    color: #fff;
    margin-top: 10px;
}

/* Botón */
button {
    background-color: #8e24aa;
    color: #fff;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.1s ease, transform 0.1s ease;
    margin-top: 20px;
}

button:hover {
    background-color: #7b1fa2;
    transform: scale(1.02);
}

button:active {
    transform: scale(0.98);
}
</style>