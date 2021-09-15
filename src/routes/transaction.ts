import Router from 'express';

import auth from '../middleware/auth';
import {
  startTransaction,
  finishTransaction,
} from '../controllers/transaction';

const router = Router();

router.get('/start-transaction', auth, startTransaction);
router.post('/finish-transaction', auth, finishTransaction);

export default router;
