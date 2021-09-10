import Router from 'express';

import auth from '../middleware/auth';
import { createWallet } from '../controllers/wallet';

const router = Router();

router.post('/', auth, createWallet);

export default router;
