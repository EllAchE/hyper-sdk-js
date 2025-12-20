"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = exports.NoJwtKeyError = exports.InvalidApiKeyError = exports.CompressionType = void 0;
exports.generateSignature = generateSignature;
const jsonwebtoken_1 = require("jsonwebtoken");
/**
 * Compression types supported by the SDK
 */
var CompressionType;
(function (CompressionType) {
    CompressionType["Gzip"] = "gzip";
})(CompressionType || (exports.CompressionType = CompressionType = {}));
/**
 * An invalid API key was passed into {@link Session}.
 */
class InvalidApiKeyError extends Error {
}
exports.InvalidApiKeyError = InvalidApiKeyError;
/**
 * A caller attempted to call {@link Session#generateSignature|generateSignature} when the
 * {@link Session} doesn't have a JWT key set.
 */
class NoJwtKeyError extends Error {
}
exports.NoJwtKeyError = NoJwtKeyError;
/**
 * Generates the value used for the `X-Signature` API request header.
 *
 * @param apiKey The API key to include in the signature
 * @param jwtKey The JWT key used to sign the payload
 * @returns The generated JWT signature string
 * @throws {Error} If apiKey or jwtKey is empty or undefined
 */
function generateSignature(apiKey, jwtKey) {
    if (!apiKey || apiKey.length === 0) {
        throw new Error("API key is required");
    }
    if (!jwtKey || jwtKey.length === 0) {
        throw new Error("JWT key is required");
    }
    return (0, jsonwebtoken_1.sign)({
        "key": apiKey,
        "exp": Math.floor(Date.now() / 1000) + 60 // 60 seconds
    }, jwtKey, {
        algorithm: "HS256"
    });
}
/**
 * A session that can be used to interact with the Hyper Solutions API services.
 */
class Session {
    /**
     * Creates a new session.
     * @param apiKey Your Hyper Solutions API key
     * @param jwtKey Your JWT key. This is only required if you wish to utilize request signing to prevent replay attacks.
     * @param appKey Optional application key
     * @param appSecret Optional application secret
     * @param options Optional session configuration
     */
    constructor(apiKey, jwtKey, appKey, appSecret, options) {
        var _a, _b, _c;
        if (apiKey.length == 0) {
            throw new InvalidApiKeyError();
        }
        this.apiKey = apiKey;
        this.jwtKey = jwtKey;
        this.appKey = appKey;
        this.appSecret = appSecret;
        this.compression = (_a = options === null || options === void 0 ? void 0 : options.compression) !== null && _a !== void 0 ? _a : CompressionType.Gzip;
        this.timeout = (_b = options === null || options === void 0 ? void 0 : options.timeout) !== null && _b !== void 0 ? _b : 30000;
        this.proxy = options === null || options === void 0 ? void 0 : options.proxy;
        this.rejectUnauthorized = (_c = options === null || options === void 0 ? void 0 : options.rejectUnauthorized) !== null && _c !== void 0 ? _c : true;
    }
}
exports.Session = Session;
__exportStar(require("./akamai"), exports);
__exportStar(require("./datadome"), exports);
__exportStar(require("./incapsula"), exports);
__exportStar(require("./kasada"), exports);
__exportStar(require("./trustdecision"), exports);
