import Router from 'express';

const router = Router();

import { addUser } from '../../controllers/user/user';
import {
  getVerificationCode,
  verifyCode,
  verifyKYCData,
} from '../../controllers/user/user';

router.post('/', addUser);
router.get('/verification-code/:phone', getVerificationCode);
router.post('/verify-code', verifyCode);

router.post('/kyc-verification', verifyKYCData);

export default router;
