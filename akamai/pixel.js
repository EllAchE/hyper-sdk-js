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
exports.generatePixelData = exports.PixelInput = exports.parsePixelScriptVar = exports.parsePixelScriptUrl = exports.PixelScriptUrls = exports.parsePixelHtmlVar = void 0;
const api_client_1 = require("../shared/api-client");
/**
 * Parses the required pixel challenge variable from the given HTML source code.
 * Returns `null` if the variable can't be found.
 * @param src The HTML source code
 */
function parsePixelHtmlVar(src) {
    const result = /bazadebezolkohpepadr="(\d+)"/.exec(src);
    if (result == null || result.length < 2) {
        return null;
    }
    return parseInt(result[1]);
}
exports.parsePixelHtmlVar = parsePixelHtmlVar;
/**
 * Pixel script URLs.
 */
class PixelScriptUrls {
    constructor(scriptUrl, postUrl) {
        this.scriptUrl = scriptUrl;
        this.postUrl = postUrl;
    }
}
exports.PixelScriptUrls = PixelScriptUrls;
/**
 * Parses the URL of the pixel challenge script, and generates the URL
 * to post a generated payload to from the given HTML source code.
 *
 * Returns null if the URL couldn't be found.
 * @param src The HTML source code
 * @returns {PixelScriptUrls} The generated URLs. Contains both script URL and post URL.
 */
function parsePixelScriptUrl(src) {
    const result = /src="(https?:\/\/.+\/akam\/\d+\/\w+)"/.exec(src);
    if (result == null || result.length < 2) {
        return null;
    }
    const scriptUrl = result[1];
    // Create post URL
    const parts = scriptUrl.split("/");
    parts[parts.length - 1] = "pixel_" + parts[parts.length - 1];
    const postUrl = parts.join("/");
    return new PixelScriptUrls(scriptUrl, postUrl);
}
exports.parsePixelScriptUrl = parsePixelScriptUrl;
/**
 * Gets the dynamic value from the pixel script.
 *
 * Returns null if the dynamic variable couldn't be found.
 * @param src The pixel script source code
 * @returns {string} The dynamic variable
 */
function parsePixelScriptVar(src) {
    const indexResult = /g=_\[(\d+)]/.exec(src);
    if (indexResult == null || indexResult.length < 2) {
        return null;
    }
    const index = parseInt(indexResult[1]);
    const arrayDeclaration = /var _=\[(.+?)];/.exec(src);
    if (arrayDeclaration == null || arrayDeclaration.length < 2) {
        return null;
    }
    const rawStrings = /("[^",]*")/.exec(arrayDeclaration[1]);
    if (rawStrings == null || index >= rawStrings.length) {
        return null;
    }
    // Remove leading and trailing quotes
    return rawStrings[index].replace(/^"|"$/g, "");
}
exports.parsePixelScriptVar = parsePixelScriptVar;
/**
 * Pixel API input.
 */
class PixelInput {
    /**
     * Creates a new instance.
     * @param userAgent The user agent to impersonate
     * @param htmlVar The HTML var, obtained from {@link parsePixelHtmlVar}
     * @param scriptVar The script var, obtained from {@link parsePixelScriptVar}
     * @param ip The IPV4 address of your network or proxy.
     * @param acceptLanguage Your accept-language header.
     */
    constructor(userAgent, htmlVar, scriptVar, ip, acceptLanguage) {
        this.userAgent = userAgent;
        this.htmlVar = htmlVar;
        this.scriptVar = scriptVar;
        this.ip = ip;
        this.acceptLanguage = acceptLanguage;
    }
}
exports.PixelInput = PixelInput;
/**
 * Generates pixel data that can be used to obtain a valid `ak_bmsc` cookie.
 * @param session The {@link Session}
 * @param input The {@link PixelInput}
 * @returns {Promise<string>} A {@link Promise} that, when resolved, will contain the pixel data
 */
function generatePixelData(session, input) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, api_client_1.sendPayloadRequest)(session, "https://akm.hypersolutions.co/pixel", input);
    });
}
exports.generatePixelData = generatePixelData;
