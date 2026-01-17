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
exports.generateTrustDecisionSignature = exports.SignatureInput = void 0;
const api_client_1 = require("../shared/api-client");
/**
 * TrustDecision session signature generation input.
 */
class SignatureInput {
    /**
     * Creates a new instance.
     * Refer to the {@link https://docs.justhyped.dev/api-reference/trust-decision|documentation} for more information.
     * @param clientId The client ID returned from the payload generation endpoint
     * @param path The API endpoint path that will be called. This should match the value used in the td-session-path header of your actual request.
     */
    constructor(clientId, path) {
        this.clientId = clientId;
        this.path = path;
    }
}
exports.SignatureInput = SignatureInput;
/**
 * Generates a unique td-session-sign header value for each API request.
 * This signature can only be used once and must be regenerated for every request.
 * @param session The {@link Session}
 * @param input The {@link SignatureInput}
 * @returns {Promise<string>} A {@link Promise} that, when resolved, will contain the session signature
 */
function generateTrustDecisionSignature(session, input) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, api_client_1.sendPayloadRequest)(session, "https://trustdecision.hypersolutions.co/sign", input);
    });
}
exports.generateTrustDecisionSignature = generateTrustDecisionSignature;
