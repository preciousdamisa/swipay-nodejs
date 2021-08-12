import Router from 'express';

import { createWallet } from '../controllers/wallet';

const router = Router();

router.post('/', createWallet);

export default router;
