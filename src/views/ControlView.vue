<template>
    <div v-if="store.Logged" class="history-container">
        <h2>Panel de control de movimientos</h2>
        <div v-if="load" class="loader-container">
            <span class="loader"></span>
            <p class="loading-text">Cargando movimientos...</p>
        </div>
        <div v-else-if="movimientos" class="table-container">
            <table v-if="movimientos.length !== 0" class="history-table">
                <thead>
                    <tr>
                        <th>Número de movimiento</th>
                        <th>Tipo de movimiento</th>
                        <th>CriptoMoneda</th>
                        <th>Cantidad</th>
                        <th>Total</th>
                        <th>Fecha y Hora</th>
                        <th></th> <!--Acciones-->
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(movimiento, index) in movimientos" :key="index">
                        <td>{{ movimiento._id }} </td>
                        <td>{{ operacion(movimiento.action).name }}</td>
                        <td>{{ moneda(movimiento.crypto_code).name }}</td>
                        <td>{{ movimiento.crypto_amount }}</td>
                        <td>${{ movimiento.money }}</td>
                        <td>{{ formatearFecha(movimiento.datetime) }}</td>
                        <td><button @click="Delete(movimiento._id)">Eliminar</button></td>
                        <td><button @click="Edit(movimiento._id)">Editar</button></td>
                    </tr>
                </tbody>
            </table>
            <p v-else>No hay movimientos a mostrar</p>
        </div>

        <div v-if="showEditModal" class="modal-overlay">
            <div class="modal-content">
                <h2>Editar Movimiento</h2>
                <div class="form-group">
                    <label>Cantidad:</label>
                    <input 
                        type="number" 
                        v-model="editingTransaction.crypto_amount"
                        step="0.000001"
                        min="0"
                    >
                </div>
                <div class="form-group">
                    <label>Tipo de Moneda:</label>
                    <select v-model="editingTransaction.crypto_code">
                        <option v-for="coin in CryptoM.GetCrypto()" :key="coin.code" :value="coin.code">
                            {{ coin.name }}
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Fecha:</label>
                    <input 
                        type="date" 
                        v-model="editingTransaction.datetime"
                    >
                </div>
                <div class="form-group">
                    <label>Hora:</label>
                    <input 
                        type="time" 
                        v-model="editingTransaction.time"
                    >
                </div>
                <p v-if="mensaje" class="error-message">{{ mensaje }}</p>
                
                <div class="modal-buttons">
                    <button @click="saveEdit">Guardar</button>
                    <button @click="showEditModal = false">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <button @click="routerPush">Ir al login</button>
    </div>
</template>

<script setup>
import { UserStore } from '@/store/User'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from "vue-router"
import TransactionsManager from '@/services/TransactionsManager';
import CryptoManager from '@/services/CryptoManager';

const CryptoM = new CryptoManager()
const store = UserStore()
const router = useRouter()

let load = ref(true)
let movimientos = ref({})
let editingTransaction = ref({ time: '00:00' })
let showEditModal = ref(false)
const mensaje = ref('')

const routerPush = () => {
    router.push({ name: 'Login' })
}

const reload = async () => {
    try {
        load.value = true
        await TransactionsManager.fetchTransactions()
        const transactions = TransactionsManager.getTransactions()
        movimientos.value = transactions
    } catch (err) {
        console.log(err)
        movimientos.value = []
    } finally {
        load.value = false
    }
}

const moneda = (code) => {
    return CryptoM.GetCrypto().find(coin => coin.code === code)
}
const operacion = (code) => {
    const option = CryptoM.GetOptions().find(option => option.option === code)
    return option ? option : { name: code }
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

const Delete = async (id) => {
    await TransactionsManager.deleteTransaction(id)
    await reload()
}

const validateTransaction = async (transaction) => {
    if (!transaction) {
        mensaje.value = "Transacción no válida"
        return false
    }

    const amount = Number(transaction.crypto_amount)
    if (!amount || amount <= 0) {
        mensaje.value = "El monto debe ser un número positivo"
        return false
    }

    if (transaction.action === 'purchase') { 
        return true 
    }

    const accountBalance = TransactionsManager.getStatus()
    if (accountBalance.length === 0) {
        mensaje.value = "No hay balance disponible"
        return false
    }

    const cryptoBalance = accountBalance.find(coin => coin.codigo === transaction.crypto_code)
    if (!cryptoBalance) {
        mensaje.value = "No se encontró la criptomoneda en el balance"
        return false
    }

    if (amount > cryptoBalance.balance) {
        mensaje.value = "El monto debe ser menor al balance disponible"
        return false
    }

    return true
}

const Edit = async (id) => {
    mensaje.value = ''
    await TransactionsManager.fetchTransactions()
    
    const transaction = movimientos.value.find(mov => mov._id === id)
    const isValid = await validateTransaction(transaction)

    if (isValid) {
        editingTransaction.value = { ...transaction }
        showEditModal.value = true
    }
}

const saveEdit = async () => {
    try {
        mensaje.value = '';
        const isValid = await validateTransaction(editingTransaction.value);

        if (isValid) {
            const selectedDate = new Date(editingTransaction.value.datetime);
            const [hours, minutes] = editingTransaction.value.time.split(':');
            selectedDate.setHours(hours);
            selectedDate.setMinutes(minutes);
            editingTransaction.value.datetime = selectedDate.toISOString();
            await TransactionsManager.editTransaction(editingTransaction.value);
            showEditModal.value = false;
            await reload();
        }
    } catch (error) {
        console.error('Error al guardar:', error);
        mensaje.value = 'Error al guardar los cambios';
    }
}

const Update = async () => {
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

    const cryptoAmount = validateCryptoAmount(operacion.value.crypto_amount)

    if (cryptoAmount > 0) {
        const Price = await CryptoM.getPrice(operacion.value.crypto_code)
        operacion.value.money = calculateTotal(Price, operacion.value.action, cryptoAmount).toFixed(2)
    } else {
        operacion.value.money = 0
    }
}

watch(movimientos.value, Update)
</script>

<style scoped>
.history-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem;
}

.history-title {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 60px;
    color: #000000;
}

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

.loading-text {
    margin-top: 10px;
    color: #000000;
    font-size: 20px;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    min-width: 300px;
}

.form-group {
    margin: 15px 0;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
}

.form-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.modal-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.modal-buttons button {
    padding: 8px 16px;
}
</style>