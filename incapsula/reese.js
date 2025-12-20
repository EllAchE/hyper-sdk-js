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
exports.Reese84Input = void 0;
exports.generateReese84Sensor = generateReese84Sensor;
const api_client_1 = require("../shared/api-client");
/**
 * Reese84 API input.
 */
class Reese84Input {
    /**
     * Creates a new instance.
     * @param userAgent The user agent to impersonate
     * @param ip The IPV4 address of your network or proxy.
     * @param acceptLanguage Your accept-language header.
     * @param pageUrl The page url.
     * @param script Your script string.
     * @param scriptUrl Important when solving reese on Pardon Our Interruption page
     * @param pow Your pow string (optional).
     */
    constructor(userAgent, ip, acceptLanguage, pageUrl, script, scriptUrl, pow) {
        this.userAgent = userAgent;
        this.ip = ip;
        this.acceptLanguage = acceptLanguage;
        this.pageUrl = pageUrl;
        this.script = script;
        this.scriptUrl = scriptUrl;
        this.pow = pow;
    }
}
exports.Reese84Input = Reese84Input;
/**
 * Generates a reese84 sensor that can be used to obtain a valid `reese84` cookie.
 * @param session The {@link Session}
 * @param input The {@link Reese84Input}
 * @returns {Promise<string>} A {@link Promise} that, when resolved, will contain a reese84 sensor
 */
function generateReese84Sensor(session, input) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, api_client_1.sendPayloadRequest)(session, "https://incapsula.hypersolutions.co/reese84", input);
    });
}
