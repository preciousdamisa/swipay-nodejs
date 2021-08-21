"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default();
const user_1 = require("../../controllers/user/user");
const user_2 = require("../../controllers/user/user");
router.post('/', user_1.addUser);
router.get('/verification-code/:phone', user_2.getVerificationCode);
router.post('/kyc-verification', user_2.verifyKYCData);
exports.default = router;
