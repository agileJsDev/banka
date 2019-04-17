import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/app';
import userModel from '../server/models/users';
import inputs from './data.spec';

chai.use(chaiHttp);

// Cache Token
let adminToken = '';
let userToken = '';

// Cache Response
let resp = '';

describe('Staff(Cashier) should be able to debit bank account', () => {
  describe('POST /api/v1/transactions/<account_number>/debit', () => {
    describe("When Staff(Cashier) wants to debit a user's bank account", () => {
      before(async () => {
        adminToken = userModel.generateAuthToken(
          { id: 1, type: 'staff', isAdmin: false }
        );
        userToken = userModel.generateAuthToken(
          { id: 1, type: 'client', isAdmin: false }
        );

        resp = await chai.request(app).post('/api/v1/accounts').set('Authorization', userToken).send({ type: 'savings' });
      });

      // Throw error 403 if unauthorized user tries to debit user bank account
      it('Send unauthorized message if user is not authorized', async () => {
        const res = await chai.request(app).post(`/api/v1/transactions/${resp.body.data.accountNumber}/debit`).set('Authorization', userToken).send({ amount: '400' });
        expect(res).to.have.status(403);
        expect(res.body).to.have.property('error').to.deep.equal('Unauthorized');
      });

      // Respond with error 404 if account number to be debited does not exist
      it('should respond with error 404 - not found - if account number does not exist', async () => {
        const res = await chai.request(app).post('/api/v1/transactions/1234567809/debit').set('Authorization', adminToken).send({ amount: '400' });
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error');
      });


      // Get an error response if token is invalid or expired - status code 401
      it('should respond with error 401 - unauthorized - if token is invalid or expired', async () => {
        const res = await chai.request(app).post(`/api/v1/transactions/${resp.body.data.accountNumber}/debit`).set('Authorization', 'eyJhbGciOiJIUzI1NiIsIkpXVCJ9.kcvIkS9ACezPO2DgAi-XvEikLy9ZA2y0kWiQ').send({ amount: '400' });
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('error').to.deep.equal('Invalid Token');
      });

      // Get 201 status code if account is successfully debited
      it('should respond with a status code 201 if account is successfully debited', async () => {
        const res = await chai.request(app).post(`/api/v1/transactions/${resp.body.data.accountNumber}/debit`).set('Authorization', adminToken).send({ amount: '700' });
        expect(res).to.have.status(201);
        expect(res.body.data).to.have.property('transactionId');
        expect(res.body.data).to.have.property('accountNumber');
        expect(res.body.data).to.have.property('amount');
        expect(res.body.data).to.have.property('cashier');
        expect(res.body.data).to.have.property('transactionType').to.deep.equal('debit');
        expect(res.body.data).to.have.property('acccountBalance').to.deep.equal(300);
      });

      it('should respond with a status code 400 if balance is not enough for debit transaction', async () => {
        const res = await chai.request(app).post(`/api/v1/transactions/${resp.body.data.accountNumber}/debit`).set('Authorization', adminToken).send({ amount: '700' });
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error').to.deep.equal('Balance not sufficient for debit transaction');
      });
    });
  });
});


// Credit Account API Endpoint Test

describe('Staff(Cashier) should be able to credit bank account', () => {
  describe('POST /api/v1/transactions/<account_number>/credit', () => {
    describe("When Staff(Cashier) wants to credit a user's bank account", () => {
      before(async () => {
        adminToken = userModel.generateAuthToken(
          { id: 1, type: 'staff', isAdmin: false }
        );
        userToken = userModel.generateAuthToken(
          { id: 1, type: 'client', isAdmin: false }
        );
      });

      // Throw error 403 if unauthorized user tries to credit user bank account
      it('Send unauthorized message if user is not authorized', async () => {
        const res = await chai.request(app).post(`/api/v1/transactions/${resp.body.data.accountNumber}/credit`).set('Authorization', userToken).send({ amount: '400' });
        expect(res).to.have.status(403);
        expect(res.body).to.have.property('error').to.deep.equal('Unauthorized');
      });

      // Respond with error 404 if account number to be credited does not exist
      it('should respond with error 404 - not found - if account number does not exist', async () => {
        const res = await chai.request(app).post('/api/v1/transactions/1234567809/credit').set('Authorization', adminToken).send({ amount: '400' });
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error');
      });


      // Get an error response if token is invalid or expired - status code 401
      it('should respond with error 401 - unauthorized - if token is invalid or expired', async () => {
        const res = await chai.request(app).post(`/api/v1/transactions/${resp.body.data.accountNumber}/credit`).set('Authorization', 'eyJhbGciOiJIUzI1NiIsIkpXVCJ9.kcvIkS9ACezPO2DgAi-XvEikLy9ZA2y0kWiQ').send({ amount: '400' });
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('error').to.deep.equal('Invalid Token');
      });

      // Get 201 status code if account is successfully credited
      it('should respond with a status code 201 if account is successfully credited', async () => {
        const res = await chai.request(app).post(`/api/v1/transactions/${resp.body.data.accountNumber}/credit`).set('Authorization', adminToken).send({ amount: '1700' });
        expect(res).to.have.status(201);
        expect(res.body.data).to.have.property('transactionId');
        expect(res.body.data).to.have.property('accountNumber');
        expect(res.body.data).to.have.property('amount');
        expect(res.body.data).to.have.property('cashier');
        expect(res.body.data).to.have.property('transactionType').to.deep.equal('credit');
        expect(res.body.data).to.have.property('acccountBalance').to.deep.equal(2000);
      });
    });
  });
});


// Password Resset Test

describe('Users shoiuld be able to reset passwpord', () => {
  describe('PATCH /api/v1/reset', () => {
    describe('When the user tries to change account password', () => {
      let user2Token;
      before(async () => {
        user2Token = userModel.generateAuthToken(
          { id: 2, type: 'client', isAdmin: false }
        );
      });

      it('should throw an error 404 if user is not found', async () => {
        const res = await chai.request(app).patch('/api/v1/auth/reset').set('Authorization', user2Token).send(inputs.pswResetValid);
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error').to.deep.equal('No User Found');
      });

      it('should return an error 401 for invalid current password', async () => {
        const res = await chai.request(app).patch('/api/v1/auth/reset').set('Authorization', userToken).send(inputs.pswResetInValid);
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('error').to.deep.equal('Invalid Password. Make sure password matches the current one');
      });

      it('should return an error 400 if confirm password does not mathc the new password', async () => {
        const res = await chai.request(app).patch('/api/v1/auth/reset').set('Authorization', userToken).send(inputs.pswResetInValid2);
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error');
      });


      it('should return 200 status code if password is succeefully changed', async () => {
        const res = await chai.request(app).patch('/api/v1/auth/reset').set('Authorization', userToken).send(inputs.pswResetValid);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message').to.deep.equal('Password changed successfully');
      });

      it('to confrim password change, User tries log in', async () => {
        const res = await chai.request(app).post('/api/v1/auth/signin').send({
          email: inputs.validLoginInputs.email,
          password: inputs.pswResetValid.newPassword
        });
        expect(res).to.have.status(200);
        expect(res.body.data).to.have.property('token');
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('firstName').eql(inputs.validSignupInputs.firstName);
        expect(res.body.data).to.have.property('lastName').eql(inputs.validSignupInputs.lastName);
        expect(res.body.data).to.have.property('email').eql(inputs.validLoginInputs.email);
      });
    });
  });
});


/* View User Transactions History */
describe('Users shoiuld be able to view Transactions Histrty', () => {
  describe('GET /accounts/<account-number>/transactions', () => {
    describe('When users tries to view account transaction history', () => {
      it('should respond with error 401 - unauthorized - if token is invalid or expired', async () => {
        const res = await chai.request(app).get(`/api/v1/accounts/${resp.body.data.accountNumber}/transactions`).set('Authorization', 'eyJhbGciOiJIUzI1NiIsIkpXVCJ9.kcvIkS9ACezPO2DgAi-XvEikLy9ZA2y0kWiQ');
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('error').to.deep.equal('Invalid Token');
      });

      it('should respond with 200 status code and list of transaction if successful', async () => {
        const res = await chai.request(app).get(`/api/v1/accounts/${resp.body.data.accountNumber}/transactions`).set('Authorization', userToken);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.an('array');
      });
    });
  });
});
