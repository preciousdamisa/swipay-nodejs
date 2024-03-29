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
exports.sendResponse = exports.validateCode = exports.validatePhone = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const schema = new mongoose_1.Schema({
    phone: {
        type: String,
        minLength: 11,
        maxLength: 11,
        unique: true,
        required: true,
    },
    code: {
        type: String,
        trim: true,
        minLength: 6,
        maxLength: 6,
        unique: true,
        required: true,
    },
});
exports.default = mongoose_1.default.model('Verification-Code', schema);
function validatePhone(data) {
    return joi_1.default.object({
        phone: joi_1.default.string()
            .trim()
            .min(11)
            .max(11)
            .regex(new RegExp('^[0-9]*$'))
            .required(),
    }).validate(data);
}
exports.validatePhone = validatePhone;
function validateCode(data) {
    return joi_1.default.object({
        phone: joi_1.default.string()
            .trim()
            .min(11)
            .max(11)
            .regex(new RegExp('^[0-9]*$'))
            .required(),
        code: joi_1.default.string().trim().min(6).max(6).required(),
    }).validate(data);
}
exports.validateCode = validateCode;
function sendResponse(sendCodeRes, res) {
    if (sendCodeRes.status === 1) {
        res.status(500).send({ message: sendCodeRes.message });
    }
    else {
        res.status(201).send({ message: sendCodeRes.message });
    }
}
exports.sendResponse = sendResponse;
