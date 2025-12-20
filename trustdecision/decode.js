"use strict";
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
exports.DecodeInput = void 0;
exports.decodeTrustDecisionSessionKey = decodeTrustDecisionSessionKey;
const api_client_1 = require("../shared/api-client");
/**
 * TrustDecision session key decode input.
 */
class DecodeInput {
    /**
     * Creates a new instance.
     * Refer to the {@link https://docs.justhyped.dev/api-reference/trust-decision|documentation} for more information.
     * @param result The result field from TrustDecision's fingerprinting endpoint response
     * @param requestId The requestId field from TrustDecision's fingerprinting endpoint response
     */
    constructor(result, requestId) {
        this.result = result;
        this.requestId = requestId;
    }
}
exports.DecodeInput = DecodeInput;
/**
 * Decodes the result and requestId from TrustDecision's fingerprinting endpoint
 * to generate the td-session-key header value.
 * @param session The {@link Session}
 * @param input The {@link DecodeInput}
 * @returns {Promise<string>} A {@link Promise} that, when resolved, will contain the decoded session key
 */
function decodeTrustDecisionSessionKey(session, input) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, api_client_1.sendPayloadRequest)(session, "https://trustdecision.hypersolutions.co/decode", input);
    });
}
