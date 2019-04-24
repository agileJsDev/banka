import express from 'express';
import userController from '../controllers/userController';
import accountController from '../controllers/accountController';
import validate from '../helpers/validateUser';
import verifyAuthToken from '../helpers/verifyAuthToken';
import authorize from '../helpers/authorization';
import transaction from '../controllers/transactionController';

const router = express.Router();

// Users Route
router.post('/auth/signup', validate.signUp, userController.signUp);
router.post('/auth/signin', validate.logIn, userController.logIn);
router.post('/accounts', validate.accountReg, verifyAuthToken, accountController.create);

// All Staff
router.route('/account/:accountNumber')
  .delete(verifyAuthToken, authorize.staff, accountController.deleteAccount)
  .patch(validate.updateStatus, verifyAuthToken, authorize.staff, accountController.updateStatus);
router.get('/user/:email/accounts', verifyAuthToken, authorize.staff, accountController.getUserAccounts);
router.get('/accounts', verifyAuthToken, authorize.staff, accountController.getAllAccounts);

// Only Cashier
router.post('/transactions/:accountNumber/debit', validate.updateAccount, verifyAuthToken, authorize.cashier, transaction.debit);
router.post('/transactions/:accountNumber/credit', validate.updateAccount, verifyAuthToken, authorize.cashier, transaction.credit);

// All Roles
router.patch('/auth/reset', validate.updatePassword, verifyAuthToken, userController.resetPassword);
router.get('/accounts/:accountNumber/transactions', verifyAuthToken, transaction.getUserTransactions);
router.get('/transactions/:transactionId', verifyAuthToken, transaction.getSingleTransaction);
router.get('/accounts/:accountNumber', verifyAuthToken, accountController.getAccountDetails);


// Development Route
router.get('/users', userController.getUsers);

export default router;
