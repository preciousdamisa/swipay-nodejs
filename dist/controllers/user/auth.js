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
exports.auth = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importStar(require("../../models/user"));
const auth = async (req, res, next) => {
    const { error } = user_1.validateAuthData(req.body);
    if (error)
        return res.status(422).send({ message: error.details[0].message });
    try {
        const user = await user_1.default.findOne({ email: req.body.email });
        if (!user)
            return res.status(404).send({ message: 'User not registered!' });
        const isPw = await bcrypt_1.default.compare(req.body.password, user.password);
        if (!isPw)
            return res.status(400).send({ message: 'Invalid email or password.' });
        res.send({
            message: 'Login successful!',
            user: {
                id: user._id,
                token: user.genAuthToken(),
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
        });
    }
    catch (err) {
        next(new Error('Error in authenticating user: ' + err));
    }
};
exports.auth = auth;
