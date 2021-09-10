"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth"));
const wallet_1 = require("../controllers/wallet");
const router = express_1.default();
router.post('/', auth_1.default, wallet_1.createWallet);
exports.default = router;
