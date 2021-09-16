import Router from 'express';

import auth from '../middleware/auth';
import {
  startTransaction,
  getReceiverName,
  finishTransaction,
} from '../controllers/transaction';

const router = Router();

router.get('/start-transaction', auth, startTransaction);
router.get('/receiver-name/:receiverPhone', auth, getReceiverName);
router.post('/finish-transaction', auth, finishTransaction);

export default router;
