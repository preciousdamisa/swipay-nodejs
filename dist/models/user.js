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
exports.validateKYCData = exports.validateAuthData = exports.validateSignupData = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const config_1 = __importDefault(require("config"));
const Jwt = __importStar(require("jsonwebtoken"));
const joi_1 = __importDefault(require("joi"));
const name_1 = __importDefault(require("./schemas/name"));
const address_1 = __importDefault(require("./schemas/address"));
const schema = new mongoose_1.Schema({
    name: { type: name_1.default },
    email: {
        type: String,
        trim: true,
        minLength: 5,
        maxLength: 250,
        unique: true,
        required: true,
    },
    phone: {
        type: String,
        trim: true,
        minLength: 11,
        maxLength: 11,
        unique: true,
        required: true,
    },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    picture: { large: String, medium: String, thumbnail: String },
    password: { type: String, trim: true, required: true },
    address: address_1.default,
    dob: {
        date: Date,
    },
    referrer: {
        code: {
            type: String,
            trim: true,
            minLength: 6,
            maxLength: 6,
            required: true,
        },
        userId: mongoose_1.Schema.Types.ObjectId,
    },
    externalBank: {
        name: { type: String, trim: true, minLength: 2, maxLength: 50 },
        accountNumber: { type: String, trim: true, minLength: 10, maxLength: 10 },
        bankCode: { type: String, trim: true, minLength: 3, maxLength: 3 },
    },
}, { timestamps: true });
schema.methods.genAuthToken = function () {
    return Jwt.sign({
        id: this._id,
        phone: this.phone,
        email: this.email,
    }, config_1.default.get('jwtAuthPrivateKey'), { expiresIn: '1h' });
};
exports.default = mongoose_1.default.model('user', schema);
function validateSignupData(data) {
    const schema = joi_1.default.object({
        email: joi_1.default.string()
            .min(5)
            .max(250)
            .email({ minDomainSegments: 2 })
            .required(),
        phone: joi_1.default.string()
            .trim()
            .min(11)
            .max(11)
            .regex(new RegExp('^[0-9]*$'))
            .required(),
        password: joi_1.default.string().trim().min(6).max(50).required(),
        refCode: joi_1.default.string().trim().min(6).max(6).required(),
    });
    return schema.validate(data);
}
exports.validateSignupData = validateSignupData;
function validateAuthData(data) {
    const schema = joi_1.default.object({
        email: joi_1.default.string()
            .max(250)
            .trim()
            .email({ minDomainSegments: 2 })
            .required(),
        password: joi_1.default.string().min(6).max(50).trim().required(),
    });
    return schema.validate(data);
}
exports.validateAuthData = validateAuthData;
function validateKYCData(data) {
    const schema = joi_1.default.object({
        userId: joi_1.default.string().trim().required(),
        firstName: joi_1.default.string().trim().min(2).max(25).required(),
        middleName: joi_1.default.string().trim().min(2).max(25),
        lastName: joi_1.default.string().trim().min(2).max(25).required(),
        bvn: joi_1.default.string().trim().min(11).max(11).required(),
        bankName: joi_1.default.string().trim().min(2).max(50).required(),
        accountNumber: joi_1.default.string().trim().min(10).max(10).required(),
        bankCode: joi_1.default.string().trim().min(3).max(3).required(),
        birthMonth: joi_1.default.string().trim().min(2).max(2).required(),
        birthDay: joi_1.default.string().trim().min(2).max(2).required(),
        birthYear: joi_1.default.string().trim().min(4).max(4).required(),
    });
    return schema.validate(data);
}
exports.validateKYCData = validateKYCData;
