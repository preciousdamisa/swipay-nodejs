"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = new mongoose_1.Schema({
    title: { type: String, maxLength: 25, trim: true },
    first: { type: String, maxLength: 25, trim: true, required: true },
    middle: { type: String, maxLength: 25, trim: true },
    last: { type: String, maxLength: 25, trim: true, required: true },
}, { _id: false });
