import express from 'express';
import userCtrl from '../controllers/usersCtrl';
import validate from '../helpers/validateUser';

const router = express.Router();

router.post('/auth/signup', validate.signUp, userCtrl.signUp);
router.get('/users', userCtrl.getUsers);

export default router;
