import express from 'express';
import userCtrl from '../controllers/usersCtrl';
import validate from '../helpers/validateUser';
import auth from '../helpers/auth';
import permission from '../helpers/permission';

const router = express.Router();

router.post('/auth/signup', validate.signUp, userCtrl.signUp);
router.post('/auth/signin', validate.logIn, userCtrl.logIn);
router.get('/users', userCtrl.getUsers);

export default router;
