import Router from 'express';

import { auth } from '../../controllers/user/auth';

const router = Router();

router.post('/', auth);

export default router;
