import _ from 'lodash';
import userModel from '../models/users';
import accountModel from '../models/accounts';

class AccountController {
  static async create(req, res, next) {
    try {
      const account = await accountModel.findAccountByUserId(req.user.id);
      if (account) {
        return res.status(409).json({
          status: res.statusCode,
          error: 'An account is associated with the user'
        });
      }
      const user = await userModel.findUserById(req.user.id);

      const { firstname, lastname, email } = user;
      const {
        accountnumber, type, balance, createddate
      } = await accountModel.create(req.body.type, user.id);

      return res.status(201).json({
        status: res.statusCode,
        data: {
          accountnumber, firstname, lastname, email, type, openingbalance: balance, createddate
        }
      });
    } catch (err) {
      return next(err);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const data = req.body;
      const account = await accountModel.findAccountByNo(req.params.accountNumber);

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

      const { accountnumber, status, modifieddate } = await
      accountModel.updateAccountStatus(req.params.accountNumber, data.status);

      return res.status(200).json({
        status: res.statusCode, data: { accountnumber, status, modifieddate }
      });
    } catch (err) {
      return next(err);
    }
  }

  static async deleteAccount(req, res, next) {
    try {
      const account = await accountModel.findAccountByNo(req.params.accountNumber);
      if (account) {
        await accountModel.delete(account.accountnumber);
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
      const account = await accountModel.findAccountByNo(req.params.accountNumber);
      if (!account) {
        return res.status(404).json({
          status: res.statusCode, error: 'Account does not exist'
        });
      }
      const { email } = await userModel.findUserById(account.owner);
      account.ownerEmail = email;
      return res.status(200).json({
        status: res.statusCode,
        data: _.omit(account, ['id', 'owner', 'modifieddate'])
      });
    } catch (err) {
      return next(err);
    }
  }

  static async getUserAccounts(req, res, next) {
    try {
      const { id } = await userModel.findEmail(req.params.email);
      const account = await accountModel.findAccountByUserId(id);
      if (account) {
        return res.status(200).json({
          status: res.statusCode,
          accounts: [_.omit(account, ['id', 'owner', 'modifieddate'])]
        });
      }
      return res.status(404).json({
        status: res.statusCode, error: 'No account(s) found for the email'
      });
    } catch (err) {
      return next(err);
    }
  }

  static async getAllAccounts(req, res, next) {
    try {
      const allAccounts = await accountModel.getAllAccounts();
      if (allAccounts.length === 0) {
        return res.status(404).json({
          status: res.statusCode, error: 'Not Found'
        });
      }
      const { status } = req.query;
      if (status === 'active' || status === 'dormant') {
        const accounts = await accountModel.status(status);
        if (!accounts) {
          return res.status(404).json({
            status: res.statusCode, error: 'Not Found'
          });
        }
        return res.status(200).json({
          status: res.statusCode,
          data: accounts
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
