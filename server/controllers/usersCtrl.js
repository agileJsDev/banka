import config from 'config';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import bcrypt from 'bcrypt';
import userModel from '../models/users';

class UsersCtrl {
  static async signUp(req, res, next) {
    try {
      const data = req.body;

      const emailExist = await userModel.findEmail(data.email);
      if (emailExist) {
        return res.status(409).json({
          status: res.statusCode,
          error: 'User already registered'
        });
      }
      data.password = await bcrypt.hash(data.password, 10);
      const user = _.cloneDeep(userModel.create(data));
      user.token = jwt.sign({ id: user.id, type: user.type, isAdmin: user.isAdmin }, config.get('jwtPrivateKey'));
      return res.status(201).header('x-auth-token', user.token)
        .json({
          status: res.statusCode,
          data: _.pick(user, ['token', 'id', 'firstName', 'lastName', 'email', 'type', 'createdDate'])
        });
    } catch (err) {
      return next(err);
    }
  }

  static getUsers(req, res) {
    const users = userModel.findAll();
    return res.status(200).send(users);
  }
}

export default UsersCtrl;
