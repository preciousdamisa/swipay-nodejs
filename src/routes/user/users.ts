import Router from 'express';

const router = Router();

import { addUser } from '../../controllers/user/user';
import { getVerificationCode } from '../../controllers/user/user';

router.post('/', addUser);
router.get('/verification-code/:phone', getVerificationCode);

export default router;
