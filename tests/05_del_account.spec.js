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

describe('Admin/Staff should be able to delete bank account', () => {
  describe('DELETE /api/v1/account/<account_number>', () => {
    describe('When Admin/Staff decides to delete an account', () => {
      before(async () => {
        adminToken = userModel.generateAuthToken(
          { id: 1, type: 'staff', isAdmin: true }
        );
        userToken = userModel.generateAuthToken(
          { id: 1, type: 'client', isAdmin: false }
        );
        account = accountModel.getAllAcct();
      });

      // Throw error 403 if unauthorized user tries to delete user bank account
      it('Send unauthorized message if user not authorized', async () => {
        const res = await chai.request(app).delete('/api/v1/account/1111111111').set('Authorization', userToken);
        expect(res).to.have.status(403);
        expect(res.body).to.have.property('error').to.deep.equal('Unauthorized');
      });

      // Respond with error 404 if account number to be deleted does not exist
      it('should respond with error 404 - not found - if account number does not exist', async () => {
        const res = await chai.request(app).delete('/api/v1/account/1111111111').set('Authorization', adminToken);
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error');
      });

      // Get an error response if token is invalid or expired - status code 401
      it('should respond with error 401 - unauthorized - if token is invalid or expired', async () => {
        const res = await chai.request(app).delete(`/api/v1/account/${account[0].accountNumber}`).set('Authorization', 'eyJhbGciOiJIUzI1NiIsIkpXVCJ9.kcvIkS9ACezPO2DgAi-XvEikLy9ZA2y0kWiQ');
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('error').to.deep.equal('Invalid Token');
      });

      // Get 200 Ok status if account  is successfully deleted
      it('should respond with an OK status code 200 if account is successfully deleted', async () => {
        const res = await chai.request(app).delete(`/api/v1/account/${account[0].accountNumber}`).set('Authorization', adminToken);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message').to.deep.equal('Account successfully deleted');
      });
    });
  });
});
