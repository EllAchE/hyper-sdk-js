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
exports.SbsdInput = void 0;
exports.generateSbsdPayload = generateSbsdPayload;
const api_client_1 = require("../shared/api-client");
/**
 * Sbsd input.
 */
class SbsdInput {
    /**
     * Creates a new instance.
     * Refer to the {@link https://docs.justhyped.dev/akamai-web/api-reference|documentation} for more information.
     * @param index The index value
     * @param uuid The uuid of the sbsd challenge (https://example.com/.well-known/sbsd?v=dcc78710-14fe-3835-cc6e-b9b5ea3b6010). uuid is dcc78710-14fe-3835-cc6e-b9b5ea3b6010 on this url.
     * @param o_cookie The "sbsd_o" cookie value
     * @param pageUrl The URL of the page
     * @param userAgent The user agent to impersonate
     * @param script The script content
     * @param ip The IPV4 address of your network or proxy.
     * @param acceptLanguage Your accept-language header.
     */
    constructor(index, uuid, o_cookie, pageUrl, userAgent, script, ip, acceptLanguage) {
        this.index = index;
        this.uuid = uuid;
        this.pageUrl = pageUrl;
        this.userAgent = userAgent;
        this.o = o_cookie;
        this.script = script;
        this.ip = ip;
        this.acceptLanguage = acceptLanguage;
    }
}
exports.SbsdInput = SbsdInput;
/**
 * Generates SBSD data that can be used to obtain a valid `sbsd` cookie.
 * @param session The {@link Session}
 * @param input The {@link SbsdInput}
 * @returns {Promise<string>} A {@link Promise} that, when resolved, will contain sbsd sensor data
 */
function generateSbsdPayload(session, input) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, api_client_1.sendPayloadRequest)(session, "https://akm.hypersolutions.co/sbsd", input);
    });
}
