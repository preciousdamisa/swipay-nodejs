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
exports.getVerificationCode = exports.addUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const nanoid_1 = require("nanoid");
const user_1 = __importDefault(require("../../models/user"));
const user_2 = require("../../models/user");
const verification_code_1 = __importStar(require("../../models/verification-code"));
const addUser = async (req, res, next) => {
    const { error } = user_2.validateSignupData(req.body);
    if (error)
        return res.status(422).send({ message: error.details[0].message });
    const { phone, email, password } = req.body;
    try {
        const fetchedUser = await user_1.default.findOne({ $or: [{ phone }, { email }] });
        if (fetchedUser)
            return res.status(400).send({ message: 'User already registered' });
        const hashedPw = await bcrypt_1.default.hash(password, 12);
        const user = await new user_1.default({
            phone,
            email,
            password: hashedPw,
            balance: 0.0,
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
    const { error } = verification_code_1.validatePhone(req.body);
    if (error)
        return res.status(422).send({ message: error.details[0].message });
    const { phone } = req.body;
    const code = nanoid_1.customAlphabet('0123456789', 6)();
    const message = 'Verification code saved and sent successfully';
    try {
        const fetchedCode = await verification_code_1.default.findOne({ phone });
        if (fetchedCode) {
            await verification_code_1.default.updateOne({ phone }, { $set: { code } });
            return res.status(201).send({ message });
            // Call utils function to Send verification code to user.
        }
        await new verification_code_1.default({ phone, code }).save();
        // Call utils function to Send verification code to user.
        res.status(201).send({ message });
    }
    catch (e) {
        next(new Error('Error in generating verification code: ' + e));
    }
};
exports.getVerificationCode = getVerificationCode;
