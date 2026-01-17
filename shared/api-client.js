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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendKasadaPayloadRequest = exports.sendPayloadWithHeadersRequest = exports.sendPayloadRequest = exports.sendRequest = exports.InvalidApiResponseError = void 0;
const undici_1 = require("undici");
const util_1 = require("util");
const zlib = __importStar(require("zlib"));
const index_1 = require("../index");
// Compression utilities
const gzip = (0, util_1.promisify)(zlib.gzip);
const brotliDecompress = (0, util_1.promisify)(zlib.brotliDecompress);
/**
 * An invalid API response error
 */
class InvalidApiResponseError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.InvalidApiResponseError = InvalidApiResponseError;
/**
 * Compresses payload using the specified compression type
 */
function compressPayload(payload, compression) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (compression) {
            case index_1.CompressionType.Gzip:
                return yield gzip(payload);
            default:
                return payload;
        }
    });
}
/**
 * HTTP/2 client with full compression support using undici
 */
function sendRequest(session, url, input, validateResponse) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validate session
        if (!session.apiKey) {
            throw new InvalidApiResponseError("Missing API key");
        }
        // Prepare request payload
        const jsonPayload = JSON.stringify(input);
        let requestBody = Buffer.from(jsonPayload, 'utf8');
        let useCompression = false;
        // Check if payload should be compressed
        if (requestBody.length > 1000) {
            try {
                //@ts-ignore - Type mismatch between Buffer and ArrayBuffer
                requestBody = yield compressPayload(requestBody, session.compression);
                useCompression = true;
            }
            catch (err) {
                throw new InvalidApiResponseError(`Failed to compress request body with ${session.compression}: ${err}`);
            }
        }
        // Prepare headers
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Api-Key': session.apiKey,
            'Accept-Encoding': session.compression,
            'User-Agent': 'Hyper Solutions TypeScript SDK'
        };
        // Set compression header if used
        if (useCompression) {
            headers['Content-Encoding'] = session.compression;
        }
        // Add JWT signature if available
        if (session.jwtKey && session.jwtKey.length > 0) {
            headers['X-Signature'] = (0, index_1.generateSignature)(session.apiKey, session.jwtKey);
        }
        // Add app signature if available
        if (session.appKey && session.appKey.length > 0 &&
            session.appSecret && session.appSecret.length > 0) {
            headers['x-app-signature'] = (0, index_1.generateSignature)(session.appKey, session.appSecret);
            headers['x-app-key'] = session.appKey;
        }
        try {
            // Prepare request options
            const requestOptions = {
                method: 'POST',
                headers,
                body: requestBody,
                headersTimeout: session.timeout,
                bodyTimeout: session.timeout * 2,
                decompress: true,
            };
            // Add proxy support if configured
            if (session.proxy) {
                requestOptions.dispatcher = new undici_1.ProxyAgent({
                    uri: session.proxy,
                    requestTls: {
                        rejectUnauthorized: session.rejectUnauthorized,
                        allowH2: true,
                    }
                });
            }
            else {
                requestOptions.dispatcher = new undici_1.Agent({
                    connect: {
                        rejectUnauthorized: session.rejectUnauthorized,
                        allowH2: true
                    }
                });
            }
            // Make HTTP request using undici
            const response = yield (0, undici_1.request)(url, requestOptions);
            // Parse JSON response
            let result;
            try {
                result = JSON.parse(yield response.body.text());
            }
            catch (err) {
                throw new InvalidApiResponseError(`Invalid JSON response: ${err}`);
            }
            // Validate response
            if (result.error) {
                throw new InvalidApiResponseError(result.error);
            }
            // Check status code
            if (response.statusCode !== 200) {
                throw new InvalidApiResponseError(`Bad HTTP status code ${response.statusCode}`);
            }
            // Run custom validation if provided
            if (validateResponse) {
                validateResponse(result);
            }
            return result;
        }
        catch (err) {
            if (err instanceof InvalidApiResponseError) {
                throw err;
            }
            throw new InvalidApiResponseError(`Request failed: ${err}`);
        }
    });
}
exports.sendRequest = sendRequest;
/**
 * Helper function for simple payload-only requests (Akamai, Incapsula)
 */
function sendPayloadRequest(session, url, input) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield sendRequest(session, url, input, (res) => {
            if (!res.payload) {
                throw new InvalidApiResponseError("No payload obtained from API");
            }
        });
        return response.payload;
    });
}
exports.sendPayloadRequest = sendPayloadRequest;
/**
 * Helper function for payload + headers requests (DataDome)
 */
function sendPayloadWithHeadersRequest(session, url, input) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield sendRequest(session, url, input, (res) => {
            if (!res.payload) {
                throw new InvalidApiResponseError("No payload obtained from API");
            }
        });
        return {
            payload: response.payload,
            headers: response.headers || {}
        };
    });
}
exports.sendPayloadWithHeadersRequest = sendPayloadWithHeadersRequest;
/**
 * Helper function for Kasada requests
 */
function sendKasadaPayloadRequest(session, url, input) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield sendRequest(session, url, input, (res) => {
            if (!res.payload) {
                throw new InvalidApiResponseError("No payload obtained from API");
            }
            if (!res.headers) {
                throw new InvalidApiResponseError("No headers obtained from API");
            }
        });
        return {
            payload: response.payload,
            headers: response.headers
        };
    });
}
exports.sendKasadaPayloadRequest = sendKasadaPayloadRequest;
