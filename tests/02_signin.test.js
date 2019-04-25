import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/app';
import inputs from './mockdata.test';

chai.use(chaiHttp);

describe('Log In Route', () => {
  describe('POST /api/v1/auth/signin', () => {
    describe('When the user tries to log into their account', () => {
      it('should return 200 status code and token if user is successfully logged in', async () => {
        const res = await chai.request(app).post('/api/v1/auth/signin').send(inputs.validLoginInputs);

        expect(res).to.have.status(200);
        expect(res.body.data).to.have.property('token');
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('firstname').eql(inputs.validSignupInputs.firstName);
        expect(res.body.data).to.have.property('lastname').eql(inputs.validSignupInputs.lastName);
        expect(res.body.data).to.have.property('email').eql(inputs.validLoginInputs.email);
      });

      it('should throw an error 404 for not registered email address', async () => {
        const res = await chai.request(app).post('/api/v1/auth/signin').send(inputs.invalidLoginEmail);
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error').to.deep.equal('No Associated Account with this Email');
      });

      it('should return an error 401 for invalid password credential', async () => {
        const res = await chai.request(app).post('/api/v1/auth/signin').send(inputs.invalidLoginPsw);
        expect(res).to.have.status(401);
      });
    });
  });
});
