import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/app';
import userModel from '../server/models/users';
import accountModel from '../server/models/accounts';

chai.use(chaiHttp);

// Cache Token
let adminToken = '';
let userToken = '';

// Cache Account
let account = '';

describe('Admin/Staff should be able to Activate and Deactivate Bank Account', () => {
  describe('PATCH /api/v1/account/<account_number>', () => {
    describe('When Admin/Staff decides to activate or deactivate an account', () => {
      before(async () => {
        adminToken = userModel.generateAuthToken(
          { id: 1, type: 'staff', isAdmin: true }
        );
        userToken = userModel.generateAuthToken(
          { id: 1, type: 'client', isAdmin: false }
        );
        account = accountModel.getAllAcct();
      });

      // Throw error 403 if unauthorized user tries to update a bank account
      it('Send unauthorized message if user other than staff tries to activate or deactivate account', async () => {
        const res = await chai.request(app).patch('/api/v1/account/1111111111').set('Authorization', userToken).send({ status: 'dormant' });
        expect(res).to.have.status(403);
        expect(res.body).to.have.property('error').to.deep.equal('Unauthorized');
      });

      // Respond with error 404 if account number in params does not exist
      it('should respond with error 404 - not found if account number is not available', async () => {
        const res = await chai.request(app).patch('/api/v1/account/1111111111').set('Authorization', adminToken).send({ status: 'dormant' });
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error');
      });

      // Throw error message if account status is same as the new status (default status = active)
      it('should throw an error with status code 409 if account has already been activated or deactivated', async () => {
        const res = await chai.request(app).patch(`/api/v1/account/${account[0].accountNumber}`).set('Authorization', adminToken).send({ status: 'active' });
        expect(res).to.have.status(409);
        expect(res.body).to.have.property('error');
      });

      // Get 200 Ok status if account status is successfully updated
      it('should respond with an OK status code if account is successfully activated or deactivated', async () => {
        const res = await chai.request(app).patch(`/api/v1/account/${account[0].accountNumber}`).set('Authorization', adminToken).send({ status: 'dormant' });
        expect(res).to.have.status(200);
        expect(res.body.data).to.have.property('accountNumber');
        expect(res.body.data).to.have.property('status').to.deep.equal('dormant');
      });
    });
  });
});
