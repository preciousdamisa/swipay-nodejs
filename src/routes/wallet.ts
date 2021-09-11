import Router from 'express';

import auth from '../middleware/auth';
import { createWallet, fundWallet } from '../controllers/wallet';

const router = Router();

router.post('/', auth, createWallet);
router.put('/fund', auth, fundWallet);

export default router;
