import express from 'express';
import userCtrl from '../controllers/usersCtrl';
import validate from '../helpers/validateUser';
import verifyAuthToken from '../helpers/verifyAuthToken';
// import permission from '../helpers/permission';

const router = express.Router();

router.post('/auth/signup', validate.signUp, userCtrl.signUp);
router.post('/auth/signin', validate.logIn, userCtrl.logIn);
router.get('/users', verifyAuthToken, userCtrl.getUsers);

export default router;
