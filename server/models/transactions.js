import moment from 'moment';

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
}

export default new Transactions();
