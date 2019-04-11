import _ from 'lodash';
import userModel from '../models/users';
import accountModel from '../models/accounts';

class AccountCtrl {
  static async create(req, res, next) {
    try {
      const accountExists = accountModel.findAccountById(req.user.id);
      if (accountExists) {
        return res.status(409).json({
          status: res.statusCode,
          error: 'An account is associated with the user'
        });
      }
      const user = await _.cloneDeep(userModel.findOne(req.user.id));
      const { firstName, lastName, email } = user;
      const {
        accountNumber, type, openingBalance, createdOn
      } = _.cloneDeep(accountModel.create(req.body.type, user));

      return res.status(201).json({
        status: res.statusCode,
        data: {
          accountNumber, firstName, lastName, email, type, openingBalance, createdOn
        }
      });
    } catch (err) {
      return next(err);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const data = req.body;
      const account = await _.cloneDeep(accountModel.findAccountByNo(req.params.accountNumber));

      if (account) {
        if (account.status === data.status) {
          return res.status(409).json({
            status: res.statusCode,
            error: `Account is already in ${data.status}`
          });
        }
      } else {
        return res.status(404).json({
          status: res.statusCode,
          error: 'Account does not exist'
        });
      }

      const {
        accountNumber,
        status,
        updatedOn
      } = await _.cloneDeep(accountModel.updateStatus(req.params.accountNumber, data.status));

      return res.status(200).json({
        status: res.statusCode,
        data: { accountNumber, status, updatedOn }
      });
    } catch (err) {
      return next(err);
    }
  }

  static async getAllAcct(req, res) {
    const allAccounts = accountModel.getAllAcct();
    res.status(200).send(allAccounts);
  }
}


export default AccountCtrl;
