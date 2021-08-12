"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = new mongoose_1.Schema({
    street: {
        type: String,
        minLength: 2,
        maxLength: 50,
        trim: true,
        required: true,
    },
    localGovt: {
        type: String,
        minLength: 2,
        maxLength: 50,
        trim: true,
        required: true,
    },
    city: {
        type: String,
        minLength: 2,
        maxLength: 25,
        trim: true,
        required: true,
    },
    state: {
        type: String,
        minLength: 2,
        maxLength: 25,
        trim: true,
        required: true,
    },
}, { _id: false });
