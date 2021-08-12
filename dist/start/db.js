"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const url = 'mongodb://localhost:27017/swipay';
exports.default = (cb) => {
    mongoose_1.default
        .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
        .then((res) => {
        cb(res, null);
    })
        .catch((err) => {
        cb(null, err);
    });
};
