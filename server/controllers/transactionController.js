import accountModel from '../models/accounts';
import transactionModel from '../models/transactions';


class TransactionsController {
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
}

export default TransactionsController;
