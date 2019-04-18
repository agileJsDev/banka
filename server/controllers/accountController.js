import _ from 'lodash';
import userModel from '../models/users';
import accountModel from '../models/accounts';

class AccountController {
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
            status: res.statusCode, error: `Account is already in ${data.status}`
          });
        }
      } else {
        return res.status(404).json({
          status: res.statusCode, error: 'Account does not exist'
        });
      }

      const { accountNumber, status, updatedOn } = await
      _.cloneDeep(accountModel.updateStatus(req.params.accountNumber, data.status));

      return res.status(200).json({
        status: res.statusCode, data: { accountNumber, status, updatedOn }
      });
    } catch (err) {
      return next(err);
    }
  }

  static async deleteAccount(req, res, next) {
    try {
      const account = await _
        .cloneDeep(accountModel.findAccountByNo(req.params.accountNumber));
      if (account) {
        await accountModel.delete(account);
        return res.status(200).json({ status: res.statusCode, message: 'Account successfully deleted' });
      }
      return res.status(404).json({
        status: res.statusCode, error: 'Account does not exist'
      });
    } catch (err) {
      return next(err);
    }
  }

  static async getAccountDetails(req, res, next) {
    try {
      const account = await _.cloneDeep(accountModel.findAccountByNo(req.params.accountNumber));
      if (!account) {
        return res.status(404).json({
          status: res.statusCode, error: 'Account does not exist'
        });
      }
      account.ownerEmail = userModel.findOne(account.owner).email;
      return res.status(200).json({
        status: res.statusCode,
        data: _.omit(account, ['id', 'owner', 'updatedOn'])
      });
    } catch (err) {
      return next(err);
    }
  }

  static async getUserAccounts(req, res, next) {
    try {
      const { id } = await _.cloneDeep(userModel.findEmail(req.params.email));
      const account = await _.cloneDeep(accountModel.findAccountsById(id));
      return res.status(200).json({
        status: res.statusCode,
        accounts: account
      });
    } catch (err) {
      return next(err);
    }
  }

  static async getAllAcct(req, res, next) {
    try {
      const allAccounts = accountModel.getAllAcct();
      const { status } = req.query;

      if (status === 'active' || status === 'dormant') {
        return res.status(200).json({
          status: res.statusCode,
          data: accountModel.status(status)
        });
      }
      return res.status(200).json({
        status: res.statusCode,
        data: allAccounts
      });
    } catch (err) {
      return next(err);
    }
  }
}


export default AccountController;
