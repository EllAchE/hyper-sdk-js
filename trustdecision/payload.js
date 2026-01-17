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
exports.generateTrustDecisionPayload = exports.PayloadInput = void 0;
const api_client_1 = require("../shared/api-client");
/**
 * TrustDecision payload generation input.
 */
class PayloadInput {
    /**
     * Creates a new instance.
     * Refer to the {@link https://docs.justhyped.dev/api-reference/trust-decision|documentation} for more information.
     * @param userAgent The userAgent that you're using for the entire session
     * @param pageUrl The target page URL where TrustDecision protection is active
     * @param fpUrl The td-fp URL where the payload is posted
     * @param ip The IP address that will be used to post the sensor data to the target site
     * @param acceptLanguage Your accept-language header value
     * @param script The TrustDecision fingerprinting script source code obtained from the fm.js endpoint
     */
    constructor(userAgent, pageUrl, fpUrl, ip, acceptLanguage, script) {
        this.userAgent = userAgent;
        this.pageUrl = pageUrl;
        this.fpUrl = fpUrl;
        this.ip = ip;
        this.acceptLanguage = acceptLanguage;
        this.script = script;
    }
}
exports.PayloadInput = PayloadInput;
/**
 * Generates TrustDecision payload that should be posted to TrustDecision's fingerprinting endpoint.
 * Also returns timezone and clientId required for subsequent operations.
 * @param session The {@link Session}
 * @param input The {@link PayloadInput}
 * @returns {Promise<{payload: string, timeZone: string, clientId: string}>} A {@link Promise} that, when resolved, will contain payload data
 */
function generateTrustDecisionPayload(session, input) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield (0, api_client_1.sendRequest)(session, "https://trustdecision.hypersolutions.co/payload", input, (res) => {
            if (!res.payload) {
                throw new api_client_1.InvalidApiResponseError("No payload obtained from API");
            }
            if (!res.timeZone) {
                throw new api_client_1.InvalidApiResponseError("No timeZone obtained from API");
            }
            if (!res.clientId) {
                throw new api_client_1.InvalidApiResponseError("No clientId obtained from API");
            }
        });
        return {
            payload: response.payload,
            timeZone: response.timeZone,
            clientId: response.clientId
        };
    });
}
exports.generateTrustDecisionPayload = generateTrustDecisionPayload;
