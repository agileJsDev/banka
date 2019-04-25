import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/app';
import inputs from './mockdata.test';
import userModel from '../server/models/users';

chai.use(chaiHttp);

let token = '';

describe('Createa Bank Account Route', () => {
  describe('POST /api/v1/accounts', () => {
    describe('When a Registered user tries to create a bank account', () => {
      it('should respond with error message and status code 401 if no token is provided', async () => {
        const res = await chai.request(app).post('/api/v1/accounts').send({ type: 'savings' });
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('error');
      });

      it('should respond with error message and status code 401 if header token is invalid', async () => {
        const res = await chai.request(app).post('/api/v1/accounts').set('Authorization', 23454848).send({ type: 'savings' });
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('error');
      });

      it('should return a 201 status code if user successfully creates an account', async () => {
        token = userModel.generateAuthToken(
          { id: 1, type: 'client', isAdmin: false }
        );
        const res = await chai.request(app).post('/api/v1/accounts').set('Authorization', token).send({ type: 'savings' });
        expect(res).to.have.status(201);
        expect(res.body.data).to.have.property('accountnumber');
        expect(res.body.data).to.have.property('type');
        expect(res.body.data).to.have.property('firstname').eql(inputs.validSignupInputs.firstName);
        expect(res.body.data).to.have.property('lastname').eql(inputs.validSignupInputs.lastName);
        expect(res.body.data).to.have.property('email').eql(inputs.validLoginInputs.email);
      });

      it('should respond with error message if user has already registered a bank account', async () => {
        const res = await chai.request(app).post('/api/v1/accounts').set('Authorization', token).send({ type: 'savings' });
        expect(res).to.have.status(409);
        expect(res.body).to.have.property('error');
      });
    });
  });
});
