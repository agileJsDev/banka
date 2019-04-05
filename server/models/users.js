import uuid from 'uuid';
import moment from 'moment';

class Users {
  constructor() {
    this.users = [];
  }

  create(data) {
    const user = {
      id: uuid.v4(),
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
}

export default new Users();
