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
exports.verifyKYCData = exports.verifyCode = exports.getVerificationCode = exports.addUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const nanoid_1 = require("nanoid");
const user_1 = __importStar(require("../../models/user"));
const verification_code_1 = __importStar(require("../../models/verification-code"));
const user_2 = require("./../../services/user");
const addUser = async (req, res, next) => {
    const { error } = user_1.validateSignupData(req.body);
    if (error)
        return res.status(422).send({ message: error.details[0].message });
    const { email, phone, password, refCode } = req.body;
    try {
        const fetchedUser = await user_1.default.findOne({ $or: [{ phone }, { email }] });
        if (fetchedUser)
            return res.status(400).send({ message: 'User already registered' });
        const referrer = await user_1.default.findOne({ referralCode: refCode });
        if (!referrer)
            return res
                .status(400)
                .send({ message: 'No user with this referral code' });
        const hashedPw = await bcrypt_1.default.hash(password, 12);
        const user = await new user_1.default({
            email,
            phone,
            password: hashedPw,
            referrer: { code: refCode, userId: referrer._id },
        }).save();
        res.status(201).send({
            message: 'Signup successful!',
            user: {
                token: user.genAuthToken(),
                email,
                phone,
            },
        });
    }
    catch (e) {
        next(new Error('Error in adding user: ' + e));
    }
};
exports.addUser = addUser;
const getVerificationCode = async (req, res, next) => {
    const { error } = verification_code_1.validatePhone(req.params);
    if (error)
        return res.status(422).send({ message: error.details[0].message });
    let { phone } = req.params;
    phone = '234' + phone.slice(1);
    const code = nanoid_1.customAlphabet('0123456789', 6)();
    let sendCodeRes;
    try {
        const fetchedCode = await verification_code_1.default.findOne({ phone });
        if (fetchedCode) {
            await verification_code_1.default.updateOne({ phone }, { $set: { code } });
            sendCodeRes = await user_2.sendVerificationCode(phone, code);
            return verification_code_1.sendResponse(sendCodeRes, res);
        }
        await new verification_code_1.default({ phone, code }).save();
        sendCodeRes = await user_2.sendVerificationCode(phone, code);
        verification_code_1.sendResponse(sendCodeRes, res);
    }
    catch (e) {
        next(new Error('Error in generating verification code: ' + e));
    }
};
exports.getVerificationCode = getVerificationCode;
const verifyCode = async (req, res, next) => {
    const { error } = verification_code_1.validateCode(req.body);
    if (error)
        return res.status(422).send({ message: error.details[0].message });
    try {
        const fetchedCode = await verification_code_1.default.findOne({
            phone: req.body.phone,
            code: req.body.code,
        });
        if (!fetchedCode)
            return res.status(404).send({ message: '' });
        res.send({ message: 'Verified code successfully' });
    }
    catch (e) {
        next(new Error('Error in verifying code: ' + e));
    }
};
exports.verifyCode = verifyCode;
const verifyKYCData = async (req, res, next) => {
    const { error } = user_1.validateKYCData(req.body);
    if (error)
        return res.status(422).send({ message: error.details[0].message });
    const { userId, firstName, lastName, bankName, accountNumber, bankCode, birthMonth, birthDay, birthYear, } = req.body;
    const dob = new Date(+birthYear, +birthMonth - 1, +birthDay + 1, 0, 0, 0, 0);
    try {
        // const response = await checkKYCData(req.body);
        // if (response.status) {
        //   res.send({ message: 'Verification successful' });
        // } else {
        //   res.status(400).send({
        //     message: 'Invalid data! Please ensure all provided data is correct',
        //   });
        // }
        const middleName = req.body.middleName;
        const result = await user_1.default.updateOne({ _id: userId }, {
            name: {
                first: firstName,
                middle: middleName === '' || middleName === undefined ? '' : middleName,
                last: lastName,
            },
            externalBank: { name: bankName, accountNumber, bankCode },
            'dob.date': dob,
        });
        console.log(result);
        res.send('Success');
    }
    catch (e) {
        next(new Error('Error in verifying data: ' + e));
    }
};
exports.verifyKYCData = verifyKYCData;
