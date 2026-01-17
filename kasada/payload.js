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
exports.generateKasadaPayload = exports.KasadaPayloadInput = void 0;
const api_client_1 = require("../shared/api-client");
/**
 * Kasada payload input.
 */
class KasadaPayloadInput {
    /**
     * Creates a new instance.
     * @param userAgent The user agent to impersonate
     * @param ipsLink The ips.js script link, parsed from the block page (429 status code)
     * @param script The ips.js script retrieved using the IpsLink url
     * @param ip The IPV4 address of your network or proxy.
     * @param acceptLanguage Your accept-language header.
     */
    constructor(userAgent, ipsLink, script, ip, acceptLanguage) {
        this.userAgent = userAgent;
        this.ipsLink = ipsLink;
        this.script = script;
        this.ip = ip;
        this.acceptLanguage = acceptLanguage;
    }
}
exports.KasadaPayloadInput = KasadaPayloadInput;
/**
 * Generates Kasada payload that can be used to obtain a valid `x-kpsdk-ct` token.
 * @param session The {@link Session}
 * @param input The {@link KasadaPayloadInput}
 * @returns {Promise<KasadaPayloadOutput>} A {@link Promise} that, when resolved, will contain the decoded Kasada /tl payload and headers.
 */
function generateKasadaPayload(session, input) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, api_client_1.sendKasadaPayloadRequest)(session, "https://kasada.hypersolutions.co/payload", input);
    });
}
exports.generateKasadaPayload = generateKasadaPayload;
