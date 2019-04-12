import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/app';
import userModel from '../server/models/users';

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
        expect(res.body.data).to.have.property('transactionType');
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
