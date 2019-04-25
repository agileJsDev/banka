import _ from 'lodash';
import bcrypt from 'bcrypt';
import userModel from '../models/users';

class UsersController {
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
        data: _.pick(user, ['token', 'id', 'firstname', 'lastname', 'email', 'type', 'createddate'])
      });
    } catch (err) {
      return next(err);
    }
  }

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
        data: _.pick(user, ['token', 'id', 'firstname', 'lastname', 'email'])
      });
    } catch (err) {
      return next(err);
    }
  }

  static async getUsers(req, res) {
    const users = await userModel.findAll();
    return res.status(200).send(users);
  }

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
      data.password = await bcrypt.hash('banka', 10);
      const adminUser = await userModel.createAdminUser(data);
      return res.status(201).json({
        status: res.statusCode,
        data: _.omit(adminUser, ['modifieddate', 'password', 'id'])
      });
    } catch (err) {
      return next(err);
    }
  }
}

export default UsersController;
