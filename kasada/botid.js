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
exports.BotIDHeaderInput = void 0;
exports.generateBotIDHeader = generateBotIDHeader;
const api_client_1 = require("../shared/api-client");
/**
 * BotID header input.
 */
class BotIDHeaderInput {
    /**
     * Creates a new instance.
     * @param script The c.js script retrieved from the BotID script endpoint
     * @param userAgent The user agent to impersonate
     * @param ip The IPV4 address of your network or proxy.
     * @param acceptLanguage Your accept-language header.
     */
    constructor(script, userAgent, ip, acceptLanguage) {
        this.script = script;
        this.userAgent = userAgent;
        this.ip = ip;
        this.acceptLanguage = acceptLanguage;
    }
}
exports.BotIDHeaderInput = BotIDHeaderInput;
/**
 * Generates a BotID header that can be used as the `x-is-human` header value.
 * @param session The {@link Session}
 * @param input The {@link BotIDHeaderInput}
 * @returns {Promise<string>} A {@link Promise} that, when resolved, will contain the x-is-human header value.
 */
function generateBotIDHeader(session, input) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, api_client_1.sendPayloadRequest)(session, "https://kasada.hypersolutions.co/botid", input);
    });
}
