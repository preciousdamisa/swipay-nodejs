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
exports.validateFinishTransactionReq = exports.validateStartTransactionReq = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const schema = new mongoose_1.Schema({
    senderId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    receiverId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    amount: { type: Number, min: 1.0, max: 1000000.0, required: true },
    description: { type: String, trim: true, minLength: 5, maxLength: 250 },
    category: {
        type: String,
        trim: true,
        enum: ['Airtime', 'Transportation', 'School Fee', 'Other'],
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model('transaction', schema);
function validateStartTransactionReq(reqBody) {
    return joi_1.default.object({
        receiverPhone: joi_1.default.string().trim().min(11).max(11).required(),
    }).validate(reqBody);
}
exports.validateStartTransactionReq = validateStartTransactionReq;
function validateFinishTransactionReq(reqBody) {
    const schema = joi_1.default.object({
        receiverPhone: joi_1.default.string().trim().min(11).max(11).required(),
        amount: joi_1.default.number().min(1.0).max(10000).required(),
        transferPin: joi_1.default.string().trim().min(4).max(4).required(),
    });
    return schema.validate(reqBody);
}
exports.validateFinishTransactionReq = validateFinishTransactionReq;
