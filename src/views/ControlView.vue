<template>
    <div v-if="store.Logged" class="history-container">
        <h2>Panel de control de movimientos</h2>
        <div v-if="!load && movimientos" class="table-container">
            <table v-if="movimientos.length !== 0" class="history-table">
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
    return option ? option : { name: code } // Return the original code as name if no match found
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

const mensaje = ref('')
let editingTransaction = ref()
let showEditModal

const validateTransaction = async (transaction) => {
    if (!transaction) {
        mensaje.value = "Transacción no válida"
        return false
    }

    // Validar que el monto sea un número positivo
    const amount = Number(transaction.crypto_amount)
    if (!amount || amount <= 0) {
        mensaje.value = "El monto debe ser un número positivo"
        return false
    }

    // Compra, directamente
    if (transaction.action === 'purchase') { 
        return true 
    }

    // Venta, valida balance
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
        mensaje.value = ''
        const isValid = await validateTransaction(editingTransaction.value)

        if (isValid) {
            await TransactionsManager.editTransaction(editingTransaction.value)
            showEditModal.value = false
            await reload()
        }
    } catch (error) {
        console.error('Error al guardar:', error)
        mensaje.value = 'Error al guardar los cambios'
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