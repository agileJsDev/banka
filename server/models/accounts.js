import _ from 'lodash';
import moment from 'moment';
import genAccountNo from '../utils/genAccountNo';
import { pool } from '../db';
import userModel from './users';

class Accounts {
  static async create(accountType, userId) {
    const { rows } = await pool.query(`INSERT INTO 
    accounts( type, owner, accountNumber)
    VALUES ($1, $2, $3)
    RETURNING *`,
    [accountType, userId, genAccountNo()]);
    return rows[0];
  }

  static async findAccountByUserId(userId) {
    const data = await pool.query(`
      SELECT * FROM accounts WHERE owner = $1
    `, [userId]);
    if (data.rowCount < 1) return false;
    return data.rows[0];
  }

  static async findUserAccounts(userId) {
    const { rows } = await pool.query('SELECT * FROM accounts WHERE owner = $1', [userId]);
    return rows.map(acct => _.omit(acct, ['id', 'owner', 'modifieddate']));
  }

  static async findAccountByNo(accountnumber) {
    const data = await pool.query('SELECT * FROM accounts WHERE accountnumber = $1', [accountnumber]);
    if (data.rowCount < 1) return false;
    return data.rows[0];
  }

  static async delete(accountnumber) {
    await pool.query('DELETE FROM accounts WHERE accountnumber = $1', [accountnumber]);
  }

  static async getAllAccounts() {
    const { rows } = await pool.query('SELECT * FROM accounts');
    const accounts = rows.map(async (acc) => {
      const account = acc;
      const { email } = await userModel.findUserById(account.owner);
      account.ownerEmail = email;
      return _.omit(account, ['id', 'owner', 'modifieddate']);
    });
    const promise = await Promise.all(accounts);
    return promise;
  }

  static async updateAccountStatus(accountNumber, newStatus) {
    const { rows } = await pool
      .query('UPDATE accounts SET status = $1, modifieddate = $2 WHERE accountnumber = $3 RETURNING *',
        [newStatus, moment.utc(), accountNumber]);
    return rows[0];
  }

  static async debit(accountNumber, amount) {
    const account = await Accounts.findAccountByNo(accountNumber);
    const balance = Number((parseFloat(account.balance) - Number(amount)).toFixed(2));
    const { rows } = await pool
      .query('UPDATE accounts SET balance = $1, modifieddate = $2 WHERE accountnumber = $3 RETURNING *',
        [balance, moment.utc(), accountNumber]);
    return rows[0].balance;
  }

  static async credit(accountNumber, amount) {
    const account = await Accounts.findAccountByNo(accountNumber);
    const balance = Number((parseFloat(account.balance) + Number(amount)).toFixed(2));
    const { rows } = await pool
      .query('UPDATE accounts SET balance = $1, modifieddate = $2 WHERE accountnumber = $3 RETURNING *',
        [balance, moment.utc(), accountNumber]);
    return rows[0].balance;
  }

  static async status(status) {
    const accounts = await Accounts.getAllAccounts();
    const filteredAccounts = accounts.filter(account => account.status === status);
    if (filteredAccounts.length === 0) return false;
    return filteredAccounts;
  }
}

export default Accounts;
