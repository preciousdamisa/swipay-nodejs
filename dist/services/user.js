"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkKYCData = exports.sendVerificationCode = void 0;
const axios_1 = __importDefault(require("axios"));
async function sendVerificationCode(phone, verificationCode) {
    try {
        const res = await axios_1.default.post('https://termii.com/api/sms/send', {
            to: phone,
            from: 'SwiPay',
            sms: 'Thanks for choosing SwiPay. To proceed, use this verification code. ' +
                verificationCode,
            type: 'plain',
            channel: 'generic',
            api_key: 'Your API Key',
        });
        console.log(res.data);
        return { message: 'Verification code sent successfully', status: 0 };
    }
    catch (e) {
        return { message: 'Error in sending verification code', status: 1 };
    }
}
exports.sendVerificationCode = sendVerificationCode;
async function checkKYCData(data) {
    try {
        const res = await axios_1.default.post('https://api.paystack.co/bvn/match', data, {
            headers: { Authorization: 'Bearer <SecKey>' },
        });
        return { message: '', status: 0 };
    }
    catch (e) {
        return { message: '', status: 1 };
    }
}
exports.checkKYCData = checkKYCData;
