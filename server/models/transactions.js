import moment from 'moment';
import _ from 'lodash';

class Transactions {
  constructor() {
    this.transactions = [];
  }

  create(data) {
    const transaction = {
      id: this.transactions.length + 1,
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
      .map(transaction => _.omit(transaction, ['cashier']));
    return userTransactions;
  }
}

export default new Transactions();
