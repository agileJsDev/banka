// import uuid from 'uuid';
import moment from 'moment';
import config from 'config';
import jwt from 'jsonwebtoken';

class Users {
  constructor() {
    this.users = [];
  }

  create(data) {
    const user = {
      id: (this.users.length + 1),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      type: data.type || 'client',
      isAdmin: false,
      createdDate: moment.now(),
      modifiedDate: moment.now()
    };
    this.users.push(user);
    return user;
  }

  findEmail(email) {
    return this.users.find(user => user.email === email);
  }

  findOne(id) {
    return this.users.find(user => user.id === id);
  }

  findAll() {
    return this.users;
  }

  updatePsw(id, data) {
    const user = this.findOne(id);
    const index = this.users.indexOf(user);
    this.users[index].token = data.token;
    this.users[index].modifiedDate = moment.now();
    return this.users[index];
  }

  generateAuthToken(user) {
    this.token = jwt.sign(
      { id: user.id, type: user.type, isAdmin: user.isAdmin },
      config.get('jwtPrivateKey'), { expiresIn: '1h' }
    );
    return this.token;
  }
}

export default new Users();
