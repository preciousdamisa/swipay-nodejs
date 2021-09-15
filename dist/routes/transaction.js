"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth"));
const transaction_1 = require("../controllers/transaction");
const router = express_1.default();
router.get('/start-transaction', auth_1.default, transaction_1.startTransaction);
router.post('/finish-transaction', auth_1.default, transaction_1.finishTransaction);
exports.default = router;
