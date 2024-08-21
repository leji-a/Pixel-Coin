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
  
    // Sort transactions by crypto code
    const sortedTransactions = TransactionsManager.Transaction.value.sort(
      (a, b) => a.crypto_code.localeCompare(b.crypto_code)
    )
  
    sortedTransactions.forEach((trade, index) => {
      const coin = CryptoManager.GetCrypto().find(
        (coin) => coin.code === trade.crypto_code
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
      }
  
      // Update total based on action
      switch (trade.action) {
        case "purchase":
          workingBalances[previousCode] += trade.crypto_amount
          break
        case "sale":
          workingBalances[previousCode] -= trade.crypto_amount
          break
      }
  
      // Push the last balance when processing the last transaction
      if (index === sortedTransactions.length - 1) {
        balances.push({
          code: trade.crypto_code,
          balance: workingBalances[previousCode]
        })
      }
    })
  
    return balances
  }
  static async deleteTransaction(id) {
    try {
      const client = new apiBase()

      await client.main().delete(`/transactions/${id}`)
    } catch (err) {
      console.log(err)
    }
  }
  static async editTransaction(transaction) {
    try {
      const client = new apiBase()

      await client.main().patch(`/transactions/${transaction._id}`, transaction)
    } catch (err) {
      console.log(err)
    }
  }
  static async postTransaction(transaction) {
    try {
      const client = new apiBase()

      const response = await client.main().post("/transactions", transaction)
      return response.status >= 200 && response.status < 300 ? true : false
    } catch (err) {
      console.log(err)
    }
  }
  static async fetchTransactions() {
    try {
      const store = UserStore()
      const client = new apiBase()
      const response = await client.main().get(`/transactions?q={"user_id": "${store.Username}"}`)
      TransactionsManager.Transaction.value = response.data
    } catch (err) {
      console.log("Error fetching data", err)
    }
  }
}

export default TransactionsManager