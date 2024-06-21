import { ref } from 'vue'
import { useUserStore } from '@/store/User'
import apiBase from './apiBase'
import CryptoManager from './CryptoManager'

class TransactionsManager {
  constructor() {
    this.Transaction = ref([])
  }

  getTransactions() { return this.Transaction.value }

  getStatus() {
    const Manager = new CryptoManager();
    const balances = [];
    let total = 0;
    let previousCode = '';

    // Sort transactions by crypto code
    const sortedTransactions = this.Transaction.value.sort((a, b) => a.crypto_code.localeCompare(b.crypto_code));

    sortedTransactions.forEach((trade, index) => {
      const coin = Manager.GetCrypto().find(coin => coin.code === trade.crypto_code);
      if (!coin) return; // Skip if coin is not found

      if (previousCode !== trade.crypto_code) {
        if (previousCode) {
          balances.push({
            code: previousCode,
            balance: total
          });
        }
        previousCode = trade.crypto_code;
        total = 0; // Reset total for new coin
      }

      // Update total based on action
      switch (trade.action) {
        case 'purchase':
          total += trade.crypto_amount;
          break;
        case 'sale':
          total -= trade.crypto_amount;
          break;
      }

      // Push the last balance when processing the last transaction
      if (index === sortedTransactions.length - 1) {
        balances.push({
          code: trade.crypto_code,
          balance: total
        });
      }
    });

    return balances;
  }
  
  async deleteTransaction(id) {
    try {
      await apiBase.delete(`/transactions/${id}`)
    } catch (err) {
      console.log(err)
    }
  }

  async editTransaction(transaction) {
    try {
      await apiBase.patch(`/transactions/${transaction._id}`, transaction)
    } catch (err) {
      console.log(err)
    }
  }

  async postTransaction(transaction) {
    try {
      const response = await apiBase.post('/transactions', transaction)
    } catch (err) {
      console.log(err)
    }
  }

  async fetchTransaction() {
    try {
      const store = useUserStore()
      const response = await apiBase.get(`/transactions?q={"user_id": "${store.userName}"}`)
      this.Transaction.value = response.data
    } catch (err) {
      console.log(err)
    }
  }
}

export default TransactionsManager