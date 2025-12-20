"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterstitialInput = void 0;
exports.parseInterstitialDeviceCheckUrl = parseInterstitialDeviceCheckUrl;
exports.generateInterstitialPayload = generateInterstitialPayload;
const util_1 = require("./util");
const api_client_1 = require("../shared/api-client");
/**
 * Parses the device check URL (`/interstitial/?initialCid`...) from a blocked response body.
 * @param body The response body
 * @param cookie The `datadome` cookie value
 * @param referer The referer
 */
function parseInterstitialDeviceCheckUrl(body, cookie, referer) {
    const dd = (0, util_1.parseObject)(body);
    if (dd == null) {
        return null;
    }
    const params = {
        initialCid: dd.cid,
        hash: dd.hsh,
        cid: cookie,
        referer,
        s: dd.hasOwnProperty("s") ? dd.s.toString() : "0",
        b: dd.hasOwnProperty("b") ? dd.b.toString() : "0",
        dm: "cd"
    };
    return "https://geo.captcha-delivery.com/interstitial/?" + new URLSearchParams(params).toString();
}
/**
 * Interstitial API input.
 */
class InterstitialInput {
    /**
     * Creates a new InterstitialInput instance.
     * @param userAgent The browser user agent to impersonate.
     * @param deviceLink The device check URL obtained from {@link parseInterstitialDeviceCheckUrl}.
     * @param html The response body obtained from doing a GET request to the device check URL.
     * @param ip The IPV4 address of your network or proxy.
     * @param acceptLanguage Your accept-language header.
     */
    constructor(userAgent, deviceLink, html, ip, acceptLanguage) {
        this.userAgent = userAgent;
        this.deviceLink = deviceLink;
        this.html = html;
        this.ip = ip;
        this.acceptLanguage = acceptLanguage;
    }
}
exports.InterstitialInput = InterstitialInput;
/**
 * Generates a DataDome interstitial payload that can be used to obtain a solved `datadome` cookie.
 * @param session The {@link Session}
 * @param input The {@link InterstitialInput} containing required parameters for interstitial payload generation
 * @returns {Promise<{payload: string, headers: {[key: string]: string}}>} A {@link Promise} that resolves to an object containing the interstitial payload and response headers
 */
function generateInterstitialPayload(session, input) {
    return (0, api_client_1.sendPayloadWithHeadersRequest)(session, "https://datadome.hypersolutions.co/interstitial", input);
}
