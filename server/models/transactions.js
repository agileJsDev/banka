import moment from 'moment';
import _ from 'lodash';

class Transactions {
  constructor() {
    this.transactions = [];
  }

  create(data) {
    const transaction = {
      transactionId: this.transactions.length + 1,
      createdOn: moment.now(),
      type: data.type,
      accountNumber: data.accountNumber,
      cashier: data.cashier,
      amount: data.amount,
      oldBalance: data.oldBalance,
      newBalance: data.newBalance
    };
    this.transactions.push(transaction);
    return transaction;
  }

  getUserTransactions(accountNumber) {
    const userTransactions = this.transactions
      .filter(transaction => transaction.accountNumber === Number(accountNumber))
      .map(transaction => _.omit(transaction, ['cashier'])); // Exclude cashier from the object
    return userTransactions;
  }

  findByID(id) {
    const specificTransaction = this.transactions.find(transaction => transaction.transactionId === Number(id));
    return specificTransaction;
  }
}

export default new Transactions();
