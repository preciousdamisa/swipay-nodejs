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
exports.validateCreateWalletData = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const schema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, unique: true },
    transferPin: {
        type: String,
        trim: true,
        required: true,
    },
    balance: { type: Number, min: 0.0, max: 1000000.0, required: true },
}, { timestamps: true });
exports.default = mongoose_1.default.model('wallet', schema);
function validateCreateWalletData(data) {
    const schema = joi_1.default.object({
        transferPin: joi_1.default.string().trim().min(4).max(4).required(),
    });
    return schema.validate(data);
}
exports.validateCreateWalletData = validateCreateWalletData;
