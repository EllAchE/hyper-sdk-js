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
exports.SensorInput = void 0;
exports.generateSensorData = generateSensorData;
const api_client_1 = require("../shared/api-client");
/**
 * Sensor data input.
 */
class SensorInput {
    /**
     * Creates a new instance.
     * Refer to the {@link https://docs.justhyped.dev/api-reference/akamai|documentation} for more information.
     * @param abck The current `_abck` cookie.
     * @param bmsz The current `bm_sz` cookie.
     * @param version The Akamai web SDK version.
     * @param pageUrl The URL of the page.
     * @param userAgent The user agent to impersonate.
     * @param ip The IPV4 address of your network or proxy.
     * @param acceptLanguage Your accept-language header.
     * @param context Empty on first sensor, context from last sensor response on subsequent sensors.
     * @param script Script is mutually exclusive with [SensorInput.Context], the first sensor request should include the script field. Subsequent request should only include the Context.
     * @param scriptUrl The URL of the script.
     */
    constructor(abck, bmsz, version, pageUrl, userAgent, ip, acceptLanguage, context, script, scriptUrl) {
        this.abck = abck;
        this.bmsz = bmsz;
        this.version = version;
        this.pageUrl = pageUrl;
        this.userAgent = userAgent;
        this.ip = ip;
        this.acceptLanguage = acceptLanguage;
        this.script = script;
        this.scriptUrl = scriptUrl;
        this.context = context;
    }
}
exports.SensorInput = SensorInput;
/**
 * Generates sensor data that can be used to obtain a valid `_abck` cookie.
 * @param session The {@link Session}
 * @param input The {@link SensorInput}
 * @returns {Promise<{payload: string, context: string}>} A {@link Promise} that, when resolved, will contain sensor data and context
 */
function generateSensorData(session, input) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield (0, api_client_1.sendRequest)(session, "https://akm.hypersolutions.co/v2/sensor", input, (res) => {
            if (!res.payload) {
                throw new api_client_1.InvalidApiResponseError("No payload obtained from API");
            }
            if (!res.context) {
                throw new api_client_1.InvalidApiResponseError("No context obtained from API");
            }
        });
        return {
            payload: response.payload,
            context: response.context
        };
    });
}
