import _ from 'lodash';
import userModel from '../models/users';
import accountModel from '../models/accounts';

class AccountCtrl {
  static async create(req, res, next) {
    try {
      const accountExists = accountModel.findAccount(req.user.id);
      if (accountExists) {
        return res.status(409).json({
          status: res.statusCode,
          error: 'You already have a bank account'
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

  static async getAllAcct(req, res) {
    const allAccounts = accountModel.getAllAcct();
    res.status(200).send(allAccounts);
  }
}


export default AccountCtrl;
