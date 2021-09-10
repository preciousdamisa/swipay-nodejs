"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWallet = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
const wallet_1 = __importStar(require("../models/wallet"));
const createWallet = async (req, res, next) => {
    const { error } = wallet_1.validateCreateWalletData(req.body);
    if (error)
        return res.status(422).send({ message: error.details[0].message });
    const { transferPin } = req.body;
    const userId = req['user'].id;
    try {
        const user = await user_1.default.findById(userId);
        if (!user)
            return res.status(400).send({ message: 'No user with the given ID' });
        const fetchedWallet = await wallet_1.default.findOne({ userId });
        if (fetchedWallet)
            return res.status(400).send({ message: 'User has a wallet already' });
        const hashedPin = await bcrypt_1.default.hash(transferPin, 12);
        // TODO: Create wallet and update user using a transaction.
        const wallet = await new wallet_1.default({
            transferPin: hashedPin,
            balance: 0.0,
            userId,
        }).save();
        await user_1.default.updateOne({ _id: userId }, { walletId: wallet._id });
        res.status(201).send({
            message: 'Wallet created successfully',
            wallet: { id: wallet._id },
        });
    }
    catch (e) {
        next(new Error('Error in adding user: ' + e));
    }
};
exports.createWallet = createWallet;
