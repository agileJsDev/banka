import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/app';
import inputs from './data.spec';

chai.use(chaiHttp);

describe('Signup Route', () => {
  describe('POST /api/v1/auth/signup', () => {
    describe('When the user tries to signup an account on the application', () => {
      it('should return 201 status code and token if user is successfully created', async () => {
        const res = await chai.request(app).post('/api/v1/auth/signup').send(inputs.validSignupInputs);
        expect(res).to.have.status(201);
        expect(res.body.data).to.have.property('token');
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('firstName').eql(inputs.validSignupInputs.firstName);
        expect(res.body.data).to.have.property('lastName').eql(inputs.validSignupInputs.lastName);
        expect(res.body.data).to.have.property('email').eql(inputs.validSignupInputs.email);
        expect(res.body.data).to.have.property('createdDate');
      });

      it('should return an error message and 409 if user already exists', async () => {
        const res = await chai.request(app).post('/api/v1/auth/signup').send(inputs.validSignupInputs);
        expect(res).to.have.status(409);
        expect(res.body).to.have.property('error');
      });

      it('should return an error message and status code 400 when email address is invalid', async () => {
        const res = await chai.request(app).post('/api/v1/auth/signup').send({ email: 'bankagmail.com' });
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error');
      });
    });
  });
});
