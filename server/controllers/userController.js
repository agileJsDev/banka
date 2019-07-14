import _ from 'lodash';
import bcrypt from 'bcrypt';
import userModel from '../models/users';

class UsersController {
  /**
   *
   * @description Create user account when provided inputs are valid
   * @static
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns token, id, firstname, lastname, type, created date of user account
   * @memberof UsersController
   */
  static async signUp(req, res, next) {
    try {
      const data = req.body;
      const email = await userModel.findEmail(data.email);
      if (email) {
        return res.status(409).json({
          status: res.statusCode,
          error: 'User already registered'
        });
      }

      data.password = await bcrypt.hash(data.password, 10);
      const user = await userModel.create(data);
      user.token = userModel.generateAuthToken(user);
      return res.status(201).json({
        status: res.statusCode,
        data: _.pick(user, ['token', 'id', 'firstname', 'lastname', 'email', 'type', 'createddate', 'isadmin'])
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   *
   * @description Login users given the provided credentials are correct
   * @static
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns User id, firstname, lastname, and token
   * @memberof UsersController
   */
  static async logIn(req, res, next) {
    try {
      const data = req.body;

      const user = await userModel.findEmail(data.email);
      if (!user) {
        return res.status(404).json({
          status: res.statusCode,
          error: 'Invalid Email or Password'
        });
      }
      const isPasswordValid = await bcrypt.compare(data.password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          status: res.statusCode,
          error: 'Invalid Email or Password'
        });
      }

      user.token = userModel.generateAuthToken(user);
      return res.status(200).json({
        status: res.statusCode,
        data: _.pick(user, ['token', 'id', 'firstname', 'lastname', 'email', 'type', 'isadmin'])
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   *
   * @description Password Reset API
   * @static
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns
   * @memberof UsersController
   */
  static async resetPassword(req, res, next) {
    try {
      const user = await userModel.findUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ status: res.statusCode, error: 'No User Found' });
      }
      const data = req.body;
      const isPasswordValid = await bcrypt.compare(data.password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          status: res.statusCode,
          error: 'Invalid Password. Make sure password matches the current one'
        });
      }
      const newPassword = await bcrypt.hash(data.newPassword, 10);
      await userModel.resetPassword(req.user.id, newPassword);
      return res.status(200).json({ status: res.statusCode, message: 'Password changed successfully' });
    } catch (err) {
      return next(err);
    }
  }


  /**
   *
   * @description Create Admin User
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   * @memberof UsersController
   */
  static async createAdminUser(req, res, next) {
    try {
      const data = req.body;
      const email = await userModel.findEmail(data.email);
      if (email) {
        return res.status(409).json({
          status: res.statusCode,
          error: 'Email has been used'
        });
      }
      data.password = await bcrypt.hash('Banka007', 10);
      const adminUser = await userModel.createAdminUser(data);
      return res.status(201).json({
        status: res.statusCode,
        data: _.omit(adminUser, ['modifieddate', 'password', 'id'])
      });
    } catch (err) {
      return next(err);
    }
  }

/*   // Devlopment Method
  static async getUsers(req, res) {
    const users = await userModel.findAll();
    return res.status(200).send(users);
  } */
}

export default UsersController;
