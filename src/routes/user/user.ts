import Router from 'express';

const router = Router();

import { addUser } from '../../controllers/user/user';
import {
  getVerificationCode,
  verifyCode,
  verifyKYCData,
} from '../../controllers/user/user';
import auth from '../../middleware/auth';

router.post('/', addUser);
router.get('/verification-code/:phone', getVerificationCode);
router.post('/verify-code', verifyCode);

router.post('/kyc-verification', auth, verifyKYCData);

export default router;
