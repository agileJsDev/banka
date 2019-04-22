import _ from 'lodash';
import { pool } from '../db';

class Transactions {
  static async create(data) {
    const { rows } = await pool.query(`INSERT INTO 
    transactions(type, accountnumber, cashier, amount, oldbalance, newbalance)
    VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
    [data.type, data.accountNumber, data.cashier, data.amount, data.oldBalance, data.newBalance]);
    return rows[0];
  }

  static async getUserTransactions(accountNumber) {
    const data = await pool.query('SELECT * FROM transactions WHERE accountnumber = $1', [accountNumber]);
    if (data.rowCount < 1) return false;
    const userTransactions = data.rows.map(transaction => _.omit(transaction, ['cashier'])); // Exclude cashier from
    return userTransactions;
  }

  static async findByID(id) {
    const data = await pool.query('SELECT * FROM transactions WHERE transactionid = $1',
      [id]);
    if (data.rowCount < 1) return false;
    return _.omit(data.rows[0], ['cashier']);
  }
}

export default Transactions;
