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
exports.getReceiverName = exports.finishTransaction = exports.startTransaction = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
const wallet_1 = __importDefault(require("../models/wallet"));
const transaction_1 = __importStar(require("../models/transaction"));
const startTransaction = async (req, res, next) => {
    const { error } = transaction_1.validateStartTransactionReq(req.body);
    if (error)
        return res.status(422).send({ message: error.details[0].message });
    const senderUserId = req['user'].id;
    const receiverPhone = req.body.receiverPhone;
    try {
        const sender = await user_1.default.findById(senderUserId).select('name');
        if (!sender)
            return res.status(404).send({ message: 'Sender not found' });
        const receiver = await user_1.default.findOne({ phone: receiverPhone }).select('name');
        if (!receiver)
            return res
                .status(404)
                .send({ message: 'No user with the given phone number' });
        const senderName = `${sender.name.first} ${sender.name.last}`;
        const receiverName = `${receiver.name.first} ${receiver.name.last}`;
        res.send({
            message: 'Users information fetched successfully',
            data: { senderName, receiverName },
        });
    }
    catch (e) {
        next(new Error('Error in starting transaction: ' + e));
    }
};
exports.startTransaction = startTransaction;
// TODO: Use a Transaction (Session) to finish transaction.
// TODO: Check that user is not trying to send money to self.
const finishTransaction = async (req, res, next) => {
    const { error } = transaction_1.validateFinishTransactionReq(req.body);
    if (error)
        return res.status(422).send({ message: error.details[0].message });
    const senderUserId = req['user'].id;
    const { receiverPhone, amount, transferPin } = req.body;
    try {
        const sender = await user_1.default.findById(senderUserId).select('name _id walletId');
        if (!sender)
            return res.status(404).send({ message: 'Sender not found' });
        const receiver = await user_1.default.findOne({ phone: receiverPhone }).select('name _id walletId');
        if (!receiver)
            return res
                .status(404)
                .send({ message: 'No user with the given phone number' });
        const senderWallet = await wallet_1.default.findById(sender.walletId).select('_id transferPin balance');
        if (!senderWallet)
            return res
                .status(404)
                .send({ message: "Sender doesn't have a wallet account" });
        const receiverWallet = await wallet_1.default.findById(receiver.walletId).select('_id');
        if (!receiverWallet)
            return res
                .status(404)
                .send({ message: "Receiver doesn't have a wallet account" });
        const isPin = await bcrypt_1.default.compare(transferPin, senderWallet.transferPin);
        if (!isPin)
            return res.status(400).send({ message: 'Incorrect pin' });
        if (amount > senderWallet.balance)
            return res.status(400).send({ message: 'Insufficient balance' });
        await wallet_1.default.updateOne({ _id: senderWallet._id }, { $inc: { balance: -amount } });
        await wallet_1.default.updateOne({ _id: receiverWallet._id }, { $inc: { balance: amount } });
        const transaction = await new transaction_1.default({
            senderId: sender._id,
            receiverId: receiver._id,
            amount,
        }).save();
        const senderName = `${sender.name.first} ${sender.name.last}`;
        const receiverName = `${receiver.name.first} ${receiver.name.last}`;
        res.send({
            message: 'Transaction successful',
            data: {
                senderName,
                receiverName,
                amount,
                transactionId: transaction._id,
            },
        });
    }
    catch (e) {
        next(new Error('Error in completing transaction: ' + e));
    }
};
exports.finishTransaction = finishTransaction;
const getReceiverName = async (req, res, next) => {
    const { error } = transaction_1.validateGetReceiverNameReq(req.params);
    if (error)
        return res.status(422).send({ message: error.details[0].message });
    try {
        const wallet = await wallet_1.default.findOne({
            phone: req.params.receiverPhone,
        })
            .populate('user', 'name')
            .select('user -_id');
        if (!wallet)
            return res
                .status(404)
                .send({ message: 'No wallet with the given phone number' });
        // Receiver hasn't done KYC
        if (!wallet.user.name)
            return res
                .status(400)
                .send({ message: "Receiver's account hasn't been verified" });
        const { first, middle, last } = wallet.user.name;
        const receiver = { fullName: `${first} ${middle} ${last}` };
        res.send({ message: "Receiver's name gotten successfully", receiver });
    }
    catch (e) {
        next(new Error("Error in getting receiver's name: " + e));
    }
};
exports.getReceiverName = getReceiverName;
