import config from 'config';
import jwt from 'jsonwebtoken';
import { pool } from '../db';

class Users {
  static async create(inputData) {
    const { rows } = await pool.query(`INSERT INTO 
    users(email, firstName, lastName,password, type)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [inputData.email, inputData.firstName, inputData.lastName, inputData.password, inputData.type || 'client']);
    return rows[0];
  }

  static async createAdminUser(data) {
    let { role } = data;
    if (role === 1) {
      role = true;
    } else if (role === 0) {
      role = false;
    }
    
    const { rows } = await pool.query(`INSERT INTO 
    users(email, firstName, lastName, password, type, isAdmin)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [data.email, data.firstName, data.lastName, data.password, 'staff', role]);
    return rows[0];
  }

  static async findEmail(email) {
    const data = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (data.rowCount < 1) {
      return false;
    }
    return data.rows[0];
  }

  static async findAll() {
    const { rows } = await pool.query('SELECT * FROM users');
    return rows;
  }

  static async findUserById(id) {
    const data = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (data.rowCount < 1) {
      return false;
    }
    return data.rows[0];
  }

  static async resetPassword(id, password) {
    const data = await pool.query('UPDATE users SET password = $1 WHERE id = $2', [password, id]);
    return data;
  }


  static generateAuthToken(user) {
    const token = jwt.sign(
      { id: user.id, type: user.type, isAdmin: user.isadmin },
      config.get('jwtPrivateKey'), { expiresIn: '1h' }
    );
    return token;
  }
}

export default Users;
