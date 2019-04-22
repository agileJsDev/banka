import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/app';
import inputs from './mockdata.test';

chai.use(chaiHttp);

describe('Signup Route', () => {
  describe('POST /api/v1/auth/signup', () => {
    describe('When the user tries to signup an account on the application', () => {
      it('should return 201 status code and token if user is successfully created', (done) => {
        chai.request(app).post('/api/v1/auth/signup').send(inputs.validSignupInputs).end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.data).to.have.property('token');
          expect(res.body.data).to.have.property('id');
          expect(res.body.data).to.have.property('firstname').eql(inputs.validSignupInputs.firstName);
          expect(res.body.data).to.have.property('lastname').eql(inputs.validSignupInputs.lastName);
          expect(res.body.data).to.have.property('email').eql(inputs.validSignupInputs.email);
          expect(res.body.data).to.have.property('createddate');
          done();
        });
      });

      it('should return an error message and 409 if user already exists', (done) => {
        chai.request(app).post('/api/v1/auth/signup').send(inputs.validSignupInputs).end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body).to.have.property('error').to.be.a('string');
          done();
        });
      });

      it('should return an error message and status code 400 when email address is invalid', (done) => {
        chai.request(app).post('/api/v1/auth/signup').send({ email: 'bankagmail.com' }).end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error').to.be.a('string');
          done();
        });
      });

      it('should return an error message and status code 400 when name is not given', (done) => {
        chai.request(app).post('/api/v1/auth/signup').send(inputs.validLoginInputs).end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error').to.be.a('string');
          done();
        });
      });
    });
  });
});
