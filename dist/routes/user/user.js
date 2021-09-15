"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default();
const user_1 = require("../../controllers/user/user");
const user_2 = require("../../controllers/user/user");
const auth_1 = __importDefault(require("../../middleware/auth"));
router.post('/', user_1.addUser);
router.get('/verification-code/:phone', user_2.getVerificationCode);
router.post('/verify-code', user_2.verifyCode);
router.post('/kyc-verification', auth_1.default, user_2.verifyKYCData);
exports.default = router;
