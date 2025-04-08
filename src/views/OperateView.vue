<template>
  <div v-if="store.Logged" class="operation-container">
    <div class="operation-box">
      <p>¿Qué operación hará?</p>
      <div class="select-container">
        <select v-model="operacion.action" class="select-action">
          <option
            v-for="operacion in CryptoM.GetOptions()"
            :key="operacion.option"
            :value="operacion.option"
          >
            {{ operacion.name }}
          </option>
        </select>
        <select v-model="operacion.crypto_code" class="select-crypto">
          <option
            v-for="coin in CryptoM.GetCrypto()"
            :key="coin.code"
            :value="coin.code"
          >
            {{ coin.name }}
          </option>
        </select>
      </div>
      <div class="input-container">
        <input
          type="number"
          min="0.000001"
          v-model="operacion.crypto_amount"
          placeholder="Cantidad"
          class="input-amount"
        />
        <p>Cantidad en pesos argentinos ${{ operacion.money }}</p>
      </div>
      <div class="date-time-container">
        <label>
          Fecha:
          <input
            type="date"
            v-model="date.fecha"
            :max="actualString"
            class="input-date"
          />
        </label>
        <label>
          Hora: <input type="time" v-model="date.hora" class="input-time" />
        </label>
      </div>
      <p v-if="userBalance >= 1">
        Cantidad de balance de criptomonedas: {{ userBalance }}
      </p>
      <p v-else class="error">
        Cantidad insuficiente de criptomonedas para vender
      </p>
      <button @click="Operate" class="btn-operate">{{ option.name }}</button>
    </div>
  </div>
  <div v-else class="login-container">
    <h1 class="error-title">NO DEBERIAS ESTAR AQUI!!!!</h1>
    <h3 class="error-message">Debes logearte para poder utilizar la página</h3>
    <button @click="routerPush" class="btn-login">Ir al login</button>
  </div>
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <p>Operación exitosa.</p>
      <button @click="closeModal" class="btn-close">Cerrar</button>
    </div>
  </div>
</template>

<script setup>
import { UserStore } from "@/store/User";
import { ref, watch, computed, onMounted } from "vue";
import TransactionsManager from "@/services/TransactionsManager";

import CryptoManager from "@/services/CryptoManager";
const CryptoM = new CryptoManager();

const store = UserStore();

import { useRouter } from "vue-router";

const router = useRouter();

const routerPush = () => {
  router.push({ name: "Login" });
};



let operacion = ref({
  user_id: store.Username,
  action: "purchase",
  crypto_code: "btc",
  crypto_amount: 0,
  money: 0,
  datetime: "",
});


const monedaSell = async () => {
  try {
    const status = TransactionsManager.getStatus();

    const moneda = status.find(
      (coin) => coin.code === operacion.value.crypto_code
    );
    const userBalance = moneda ? moneda.balance : 0;

    console.log("User balance:", userBalance);
    console.log("Sell amount:", operacion.value.crypto_amount);

    if (userBalance >= Number(operacion.value.crypto_amount)) {
      const transactionData = {
        user_id: store.Username,
        action: "sale", // Cambiado a 'sale' para coincidir con la lógica en getStatus
        crypto_code: operacion.value.crypto_code,
        crypto_amount: Number(operacion.value.crypto_amount),
        money: Number(operacion.value.money),
        datetime: new Date().toISOString(),
      };

      console.log("Transaction data:", transactionData);

      const resultado = await TransactionsManager.postTransaction(
        transactionData
      );
        if (resultado) {
          showModal.value = true;
        }else {
        console.log("Sale failed");
      }
    } else {
      console.log(
        `Insufficient funds. Your balance (${userBalance}) is lower than the sell amount (${operacion.value.crypto_amount}).`
      );
    }
  } catch (error) {
    console.error("Error in monedaPurchase:", error);
  }
};

const Operate = async () => {
  const cryptoAmount = Number(operacion.value.crypto_amount);

  if (isNaN(cryptoAmount) || cryptoAmount <= 0) {
    console.log("Invalid crypto amount. Please enter a positive value.");
    return;
  }

  const { action } = operacion.value;

try {

    let resultado;
    switch (action) {
      case "purchase":
        resultado = await TransactionsManager.postTransaction({
          ...operacion.value,
        });
        console.log("Purchase status: ", resultado);
        if (resultado) {
          showModal.value = true;
        }
        break;
      case "sell":
        monedaSell();
        break;
      default:
        console.error("Invalid action: ", action);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
const option = computed(() => {
  return CryptoM.GetOptions().find(
    (operation) => operation.option === operacion.value.action
  );
});

const Fecha = () => {
  const [year, month, day] = date.value.actual.split("-").map(Number);
  const [hour, minute] = date.value.hora.split(":").map(Number);
  const fecha = new Date(year, month - 1, day, hour, minute);
  operacion.value.datetime = fecha.toISOString();
};

const actual = new Date();
let date = ref({
  actual: actual.toISOString().split("T")[0], // Fecha en formato YYYY-MM-DD
  hora: "00:00", // Hora inicial predeterminada
});

const Update = async () => {
  function validateCryptoAmount(amount) {
    const numberAmount = Number(amount);
    return isNaN(numberAmount) || numberAmount <= 0 ? 0 : numberAmount;
  }

  const cryptoAmount = validateCryptoAmount(operacion.value.crypto_amount);

  if (cryptoAmount > 0) {
    const { totalAsk, totalBid } = await CryptoM.getPrice(operacion.value.crypto_code);
    const price = operacion.value.action === "purchase" ? totalAsk : totalBid;
    operacion.value.money = (price * cryptoAmount).toFixed(2);
  } else {
    operacion.value.money = 0;
  }
};

watch(operacion.value, Update);
watch(date, Fecha);



const userBalance = ref(0);

const fetchUserBalance = async () => {
  try {
    await TransactionsManager.fetchTransactions();
    const status = TransactionsManager.getStatus();
    const moneda = status.find(
      (coin) => coin.code === operacion.value.crypto_code
    );
    userBalance.value = moneda ? moneda.balance : 0;
  } catch (error) {
    console.error("Error fetching user balance:", error);
  }
};

onMounted(() => {
  Fecha();
  fetchUserBalance();
});

// Update user balance when crypto_code changes
watch(() => operacion.value.crypto_code, fetchUserBalance);

const showModal = ref(false);

const closeModal = () => {
  showModal.value = false;
};
</script>

<style scoped>
/* Estilos generales */
.operation-container,
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(50deg, #d6a3eb, #07005f);
  background-size: 200%;
  animation: gradientAnimation 5s ease infinite;
}

/* Animación para el degradado */
@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.operation-box,
.login-container {
  padding: 30px;
  background-color: #ffffff;
  border-color: black;
  border-block-end-style: solid;
  border-block-start-style: solid;
  border-radius: 12px;
  box-shadow: 0 30px 50px rgb(5, 5, 5);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

/* Estilo para los inputs y selects */
.select-container,
.input-container,
.date-time-container {
  margin-bottom: 20px;
}

.select-action,
.select-crypto,
.input-amount,
.input-date,
.input-time {
  width: 95%;
  padding: 12px;
  margin-top: 10px;
  border: 3px solid #56186e9f;
  border-radius: 6px;
}

.btn-operate,
.btn-login {
  padding: 20px 26px;
  background-color: #0f5324;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-operate:hover,
.btn-login:hover {
  background-color: #0d3628;
}

.error {
  color: #e74c3c;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
}

.btn-close {
  padding: 12px 24px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-close:hover {
  background-color: #218838;
}

/* Estilo para el mensaje de error */
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

/* Estilo para los botones */
.btn-login {
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

.btn-login:hover {
  background-color: #7b1fa2;
  transform: scale(1.02);
}

.btn-login:active {
  transform: scale(0.98);
}
</style>
