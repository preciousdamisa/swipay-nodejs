import Router from 'express';

import auth from '../middleware/auth';
import { createWallet, fundWallet, getOwner } from '../controllers/wallet';

const router = Router();

router.post('/', auth, createWallet);
router.put('/fund', auth, fundWallet);
router.get('/owner', auth, getOwner);

export default router;
