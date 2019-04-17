import express from 'express';
import userCtrl from '../controllers/userCtrl';
import accountController from '../controllers/accountCtrl';
import validate from '../helpers/validateUser';
import verifyAuthToken from '../helpers/verifyAuthToken';
import authorize from '../helpers/authorization';
import transaction from '../controllers/transactionCtrl';


const router = express.Router();

router.post('/auth/signup', validate.signUp, userCtrl.signUp);
router.post('/auth/signin', validate.logIn, userCtrl.logIn);
router.post('/accounts', validate.accountReg, verifyAuthToken, accountController.create);
router.patch('/account/:accountNumber', validate.updateStatus, verifyAuthToken, authorize.staff, accountController.updateStatus);
router.delete('/accounts/:accountNumber', verifyAuthToken, authorize.staff, accountController.deleteAccount);
router.get('/users', userCtrl.getUsers);
router.get('/accounts', accountController.getAllAcct);

router.post('/transactions/:accountNumber/debit', validate.updateAccount, verifyAuthToken, authorize.cashier, transaction.debit);

router.post('/transactions/:accountNumber/credit', validate.updateAccount, verifyAuthToken, authorize.cashier, transaction.credit);

router.patch('/auth/reset', validate.updatePsw, verifyAuthToken, userCtrl.resetPassword);


// working
router.get('/accounts/:accountNumber/transactions', verifyAuthToken, transaction.getUserTransactions);
router.get('/transactions/:transactionId', verifyAuthToken, transaction.getSingleTransaction);

router.get('/accounts/:accountNumber', verifyAuthToken, accountController.getAccountDetails);

router.get('/user/:email/accounts', verifyAuthToken, authorize.staff, accountController.getUserAccounts);


export default router;
