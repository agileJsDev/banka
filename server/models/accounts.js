import moment from 'moment';
import _ from 'lodash';
import genAccountNo from '../utils/genAccountNo';
import userModel from './users';

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
      balance: parseFloat(1000),
      updatedOn: moment.now(),
    };
    this.accounts.push(account);
    return account;
  }

  findAccountsById(id) {
    return this.accounts.filter(acct => acct.owner === id).map(acct => _.omit(acct, ['id', 'owner', 'updatedOn']));
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
    const accounts = this.accounts.map((acct) => {
      const account = _.cloneDeep(acct);
      const { email } = userModel.findOne(account.owner);
      account.ownerEmail = email;
      return _.omit(account, ['id', 'owner', 'updatedOn']);
    });
    return accounts;
  }

  updateStatus(accountNumber, newStatus) {
    const account = this.accounts.find(acct => acct.accountNumber === Number(accountNumber));
    account.status = newStatus;
    account.updatedOn = moment.now();
    return account;
  }

  debit(accountNumber, amount) {
    const account = this.findAccountByNo(accountNumber);
    account.balance = Number((parseFloat(account.balance) - Number(amount)).toFixed(2));
    account.updatedOn = moment.now();
    return account.balance;
  }

  credit(accountNumber, amount) {
    const account = this.findAccountByNo(accountNumber);
    account.balance = Number((parseFloat(account.balance) + Number(amount)).toFixed(2));
    account.updatedOn = moment.now();
    return account.balance;
  }

  status(status) {
    const account = this.getAllAcct();
    return account.filter(acct => acct.status === status);
  }

  // domant() {
  //   const account = this.getAllAcct();
  //   return account.filter(acct => acct.status === 'dormant');
  // }
}

export default new Accounts();
