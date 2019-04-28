import accountModel from '../models/accounts';
import transactionModel from '../models/transactions';


class TransactionsController {
  /**
   *
   * @description Debiit bank account
   * @static
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns Transaction Id, account number, credit amount, cashier Id, transaction type and account balance
   * @memberof TransactionsController
   */
  static async debit(req, res, next) {
    try {
      const cashier = req.user.id;
      const account = await accountModel.findAccountByNo(req.params.accountNumber);
      if (!account) {
        return res.status(404).json({
          status: res.statusCode, error: 'Account does not exist'
        });
      }
      const oldBalance = account.balance;
      const amount = Number(req.body.amount);
      if (amount > oldBalance) {
        return res.status(400).json({
          status: res.statusCode,
          error: 'Balance not sufficient for debit transaction'
        });
      }
      const type = 'debit';
      const newBalance = await accountModel.debit(account.accountnumber, amount);
      return await TransactionsController
        .response(oldBalance, amount, newBalance, account, cashier, res, type);
    } catch (err) {
      return next(err);
    }
  }

  /**
   *
   * @description Credit bank account
   * @static
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns Transaction Id, account number, credit amount, cashier Id, transaction type and account balance
   * @memberof TransactionsController
   */
  static async credit(req, res, next) {
    try {
      const cashier = req.user.id;
      const account = await accountModel.findAccountByNo(req.params.accountNumber);
      if (!account) {
        return res.status(404).json({
          status: res.statusCode, error: 'Account does not exist'
        });
      }

      const oldBalance = account.balance;
      const amount = Number(req.body.amount);
      const type = 'credit';
      const newBalance = await accountModel.credit(account.accountnumber, amount);
      return TransactionsController
        .response(oldBalance, amount, newBalance, account, cashier, res, type);
    } catch (err) {
      return next(err);
    }
  }

  /**
   *
   * @description View a specific transaction
   * @static
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns Transaction detail that consists of transaction Id, created date, type,
   * @returns account number, amount, old balance and new balance
   * @memberof TransactionsController
   */
  static async getSingleTransaction(req, res, next) {
    try {
      const transation = await transactionModel
        .findByID(req.params.transactionId);
      if (!transation) {
        return res.status(404).json({
          status: res.statusCode, error: 'No transaction with the given ID'
        });
      }

      return res.status(200).json({
        status: res.statusCode,
        data: transation
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   *
   * @description View an account’s transaction history
   * @static
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns List of and account transaction details
   * @memberof TransactionsController
   */
  static async getUserTransactions(req, res, next) {
    try {
      const userTransactions = await transactionModel
        .getUserTransactions(req.params.accountNumber);
      if (!userTransactions) {
        return res.status(404).json({
          status: res.statusCode, error: 'No transaction found for the account'
        });
      }
      return res.status(200).json({
        status: res.statusCode,
        data: userTransactions
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   *
   *
   * @static
   * @param {*} oldBalance
   * @param {*} amount
   * @param {*} newBalance
   * @param {*} account
   * @param {*} cashier
   * @param {*} res
   * @param {*} type
   * @returns
   * @memberof TransactionsController
   */
  static async response(oldBalance, amount, newBalance, account, cashier, res, type) {
    const data = {
      type, oldBalance, amount, newBalance, accountNumber: account.accountnumber, cashier
    };
    const transactionDetail = await transactionModel.create(data);
    return res.status(201).json({
      status: res.statusCode,
      data: {
        transactionId: transactionDetail.transactionid,
        accountNumber: transactionDetail.accountnumber,
        amount: transactionDetail.amount,
        cashier: transactionDetail.cashier,
        transactionType: transactionDetail.type,
        acccountBalance: transactionDetail.newbalance,
        date: transactionDetail.createddate
      }
    });
  }
}

export default TransactionsController;
