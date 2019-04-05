import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import signupData from './data.spec';

chai.use(chaiHttp);

describe('Signup Route', () => {
  describe('POST /api/v1/auth/signup', () => {
    it('should return 201 status code and token if user is successfully created', async () => {
      const res = await chai.request(app).post('/api/v1/auth/signup').send(signupData);

      expect(res).to.have.status(201);
      expect(res.body.data).to.have.property('token');
      expect(res.body.data).to.have.property('firstName').eql(signupData.firstName);
      expect(res.body.data).to.have.property('lastName').eql(signupData.lastName);
      expect(res.body.data).to.have.property('email').eql(signupData.email);
    });
  });
});
