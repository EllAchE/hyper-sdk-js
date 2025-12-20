"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliderInput = exports.SliderParseResult = void 0;
exports.parseSliderDeviceCheckUrl = parseSliderDeviceCheckUrl;
exports.generateSliderPayload = generateSliderPayload;
const util_1 = require("./util");
const api_client_1 = require("../shared/api-client");
/**
 * Slider parse result.
 */
class SliderParseResult {
    constructor(isIpBanned, url) {
        this.url = url;
        this.isIpBanned = isIpBanned;
    }
}
exports.SliderParseResult = SliderParseResult;
/**
 * Parses the device check URL (`/captcha/?initialCid`...) from a captcha page.
 * @param body The response body
 * @param cookie The `datadome` cookie
 * @param referer The referer
 */
function parseSliderDeviceCheckUrl(body, cookie, referer) {
    const dd = (0, util_1.parseObject)(body);
    if (dd == null) {
        return new SliderParseResult(false);
    }
    if (dd.t === "bv") {
        return new SliderParseResult(true);
    }
    const params = {
        initialCid: dd.cid,
        hash: dd.hsh,
        cid: cookie,
        t: dd.t,
        referer,
        s: dd.hasOwnProperty("s") ? dd.s.toString() : "0",
        e: dd.e,
        dm: "cd"
    };
    return new SliderParseResult(false, "https://geo.captcha-delivery.com/captcha/?" + new URLSearchParams(params).toString());
}
/**
 * Slider API input.
 */
class SliderInput {
    /**
     * Creates a new SliderInput instance.
     * @param userAgent The browser user agent to impersonate.
     * @param deviceLink The device check URL obtained from {@link parseSliderDeviceCheckUrl}.
     * @param html The response body obtained from doing a GET request to the device check URL.
     * @param puzzle The captcha puzzle image bytes, base64 encoded.
     *               The URL that returns the puzzle image looks like this:
     *               `https://dd.prod.captcha-delivery.com/image/2024-xx-xx/hash.jpg`
     * @param piece The captcha puzzle piece image bytes, base64 encoded.
     *              The URL that returns the puzzle piece image looks like this:
     *              `https://dd.prod.captcha-delivery.com/image/2024-xx-xx/hash.frag.png`
     * @param parentUrl The parent URL.
     * @param ip The IPV4 address of your network or proxy.
     * @param acceptLanguage Your accept-language header.
     */
    constructor(userAgent, deviceLink, html, puzzle, piece, parentUrl, ip, acceptLanguage) {
        this.userAgent = userAgent;
        this.deviceLink = deviceLink;
        this.html = html;
        this.puzzle = puzzle;
        this.piece = piece;
        this.parentUrl = parentUrl;
        this.ip = ip;
        this.acceptLanguage = acceptLanguage;
    }
}
exports.SliderInput = SliderInput;
/**
 * Generates a DataDome slider payload that can be used to obtain a solved `datadome` cookie.
 * @param session The {@link Session}
 * @param input The {@link SliderInput} containing required parameters for slider payload generation
 * @returns {Promise<{payload: string, headers: {[key: string]: string}}>} A {@link Promise} that resolves to an object containing the slider payload and response headers
 */
function generateSliderPayload(session, input) {
    return (0, api_client_1.sendPayloadWithHeadersRequest)(session, "https://datadome.hypersolutions.co/slider", input);
}
