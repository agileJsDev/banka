import express from 'express';
import userCtrl from '../controllers/userCtrl';
import accountCtrl from '../controllers/accountCtrl';
import validate from '../helpers/validateUser';
import verifyAuthToken from '../helpers/verifyAuthToken';
import authorize from '../helpers/authorization';
import transaction from '../controllers/transactionCtrl';

const router = express.Router();

router.post('/auth/signup', validate.signUp, userCtrl.signUp);
router.post('/auth/signin', validate.logIn, userCtrl.logIn);
router.post('/accounts', validate.accountReg, verifyAuthToken, accountCtrl.create);
router.patch('/account/:accountNumber', validate.updateStatus, verifyAuthToken, authorize.staff, accountCtrl.updateStatus);
router.delete('/accounts/:accountNumber', verifyAuthToken, authorize.staff, accountCtrl.deleteAccount);
router.get('/users', userCtrl.getUsers);
router.get('/accounts', accountCtrl.getAllAcct);

router.post('/transactions/:accountNumber/debit', validate.updateAccount, verifyAuthToken, authorize.cashier, transaction.debit);

router.post('/transactions/:accountNumber/credit', validate.updateAccount, verifyAuthToken, authorize.cashier, transaction.credit);

router.patch('/auth/reset', validate.updatePsw, verifyAuthToken, userCtrl.resetPassword);


// working
router.get('/accounts/:accountNumber/transactions', verifyAuthToken, transaction.getUserTransactions);


export default router;
