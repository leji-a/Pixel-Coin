import { ref } from "vue"
import { UserStore } from "@/store/User"
import apiBase from "./apiBase"
import CryptoManager from "./CryptoManager"

class TransactionsManager {
  static Transaction = ref([])

  static getTransactions() {
    return TransactionsManager.Transaction.value
  }

  static getStatus() {
    const balances = []
    const workingBalances = {} // New object for calculations
    let previousCode = ""
    const Gestion = new CryptoManager 
  
    // Sort transactions by crypto code
    const sortedTransactions = TransactionsManager.Transaction.value.sort(
      (a, b) => a.crypto_code.localeCompare(b.crypto_code)
    )//oRDENAR POR CRIPTOMONEDA
  
    sortedTransactions.forEach((trade, index) => {
     const  coin = Gestion.GetCrypto().find( 
        (coin) => coin.code === trade.crypto_code  //Si no existe la critoen las opciones, saltea esa transacción
      )
      if (!coin) return // Skip if coin is not found
  
      
      if (previousCode !== trade.crypto_code) {
        if (previousCode) {
          balances.push({
            code: previousCode,
            balance: workingBalances[previousCode]
          })
        }
        previousCode = trade.crypto_code
        workingBalances[previousCode] = 0 // Reset total for new coin
      } // Reiniciar el total para la nueva criptomoneda
  
      // Update total based on action
      switch (trade.action) {
        case "purchase":
          workingBalances[previousCode] += trade.crypto_amount
          break
        case "sale":
          workingBalances[previousCode] -= trade.crypto_amount
          break
      } //Actualizar el total según la acción
  
      // Push the last balance when processing the last transaction
      if (index === sortedTransactions.length - 1) {
        balances.push({
          code: trade.crypto_code,
          balance: workingBalances[previousCode]
        })
      }
    }) // Agregar el último balance al final de la lista
  
    return balances
  }
  static async deleteTransaction(id) {
    try {
      await apiBase.delete(`/transactions/${id}`)
    } catch (err) {
      console.log(err)
    }
  }
  static async editTransaction(transaction) {
    try {
      await apiBase.patch(`/transactions/${transaction._id}`, transaction)
    } catch (err) {
      console.log(err)
    }
  }
  static async postTransaction(transaction) {
    try {
      const response = await apiBase.post("/transactions", transaction)
      return response.status >= 200 && response.status < 300 ? true : false
    } catch (err) {
      console.log(err)
    }
  }
static async fetchTransactions() {
  try {
    const store = UserStore();
    const response = await apiBase.get(`/transactions?q={"user_id": "${store.Username}"}`);
    TransactionsManager.Transaction.value = response.data;
    return response.data; // Devolver las transacciones directamente
  } catch (err) {
    console.log(err);
    return null; // Devolver null en caso de error
    }
} 
}
export default TransactionsManager