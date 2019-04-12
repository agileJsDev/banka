import moment from 'moment';
import genAccountNo from '../utils/genAccountNo';

class Accounts {
  constructor() {
    this.accounts = [];
  }

  create(accountType, user) {
    const account = {
      id: (this.accounts.length + 1),
      accountNumber: genAccountNo(),
      createdOn: moment.now(),
      owner: user.id,
      type: accountType,
      status: 'active',
      balance: parseFloat(0),
      updatedOn: moment.now(),
    };
    this.accounts.push(account);
    return account;
  }

  findAccountById(id) {
    return this.accounts.find(acct => acct.owner === id);
  }

  findAccountByNo(accountNumber) {
    return this.accounts.find(acct => acct.accountNumber === Number(accountNumber));
  }

  delete(accountDetails) {
    const index = this.accounts.indexOf(accountDetails);
    this.accounts.splice(index, 1);
  }

  getAllAcct() {
    return this.accounts;
  }

  updateStatus(accountNumber, newStatus) {
    const account = this.accounts.find(acct => acct.accountNumber === Number(accountNumber));
    account.status = newStatus;
    account.updatedOn = moment.now();
    return account;
  }
}

export default new Accounts();
