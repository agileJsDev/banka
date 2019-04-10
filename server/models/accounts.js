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
      updatedOn: moment.now()
    };
    this.accounts.push(account);
    return account;
  }

  findAccount(id) {
    return this.accounts.find(acct => acct.owner === id);
  }

  getAllAcct() {
    return this.accounts;
  }
}

export default new Accounts();
