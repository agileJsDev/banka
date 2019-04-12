import accountModel from '../models/accounts';
import tModel from '../models/transactions';

class transactionsCtrl {
  static async debit(req, res, next) {
    try {
      const cashier = req.user.id;
      const account = accountModel.findAccountByNo(req.params.accountNumber);

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

      const newBalance = await accountModel.debit(account.accountNumber, amount);
      const data = {
        type: 'debit', oldBalance, amount, newBalance, accountNumber: account.accountNumber, cashier
      };
      const transactionDetail = tModel.create(data);
      return res.status(201).json({
        status: res.statusCode,
        data: {
          transactionId: transactionDetail.id,
          accountNumber: transactionDetail.accountNumber,
          amount: transactionDetail.amount,
          cashier: transactionDetail.cashier,
          transactionType: transactionDetail.type,
          acccountBalance: transactionDetail.newBalance,
          date: transactionDetail.createdOn
        }
      });
    } catch (err) {
      return next(err);
    }
  }
}

export default transactionsCtrl;
