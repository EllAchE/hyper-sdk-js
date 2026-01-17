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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUtmvcCookie = exports.UtmvcInput = exports.getSessionIds = exports.isSessionCookie = exports.generateUtmvcScriptPath = exports.parseUtmvcScriptPath = void 0;
const assert_1 = __importDefault(require("assert"));
const api_client_1 = require("../shared/api-client");
const scriptRegex = new RegExp(`src="(/_Incapsula_Resource\?[^"]*)"`);
/**
 * Parses the utmvc script path from the given HTML input.
 * @param input The HTML page
 */
function parseUtmvcScriptPath(input) {
    const result = scriptRegex.exec(input);
    if (result == null || result.length < 2) {
        return null;
    }
    return result[1];
}
exports.parseUtmvcScriptPath = parseUtmvcScriptPath;
/**
 * Generates a script path to post the generated `___utmvc` cookie to.
 */
function generateUtmvcScriptPath() {
    return `/_Incapsula_Resource?SWKMTFSR=1&e=${Math.random()}`;
}
exports.generateUtmvcScriptPath = generateUtmvcScriptPath;
/**
 * Checks if the given HTTP cookie name is a session cookie.
 * This can be used to extract session cookies for use with {@link generateUtmvcCookie}.
 *
 * Callers should use {@link getSessionIds} instead if possible.
 * @param name The name of the cookie
 * @returns {boolean} If the given cookie name is a session cookie
 */
function isSessionCookie(name) {
    return name.startsWith("incap_ses_");
}
exports.isSessionCookie = isSessionCookie;
/**
 * Extracts session cookie values from the given cookies.
 * @param cookies Cookies to extract session cookies from
 * @returns {string[]} Session cookie values
 */
function getSessionIds(cookies) {
    return cookies
        .filter(cookie => isSessionCookie(cookie.name))
        .map(cookie => cookie.value);
}
exports.getSessionIds = getSessionIds;
/**
 * Utmvc API input.
 */
class UtmvcInput {
    /**
     * Creates a new instance.
     * @param userAgent The user agent to impersonate
     * @param script The Incapsula utmvc JavaScript code
     * @param sessionIds The session ID's. Read the
     *        {@link https://docs.justhyped.dev/incapsula/api-reference|documentation} for more information.
     *        Callers can use {@link getSessionIds} or {@link isSessionCookie} to assist with extracting
     *        session cookies from their cookie jar.
     */
    constructor(userAgent, script, sessionIds) {
        (0, assert_1.default)(userAgent.length > 0, "userAgent must be a non-empty string");
        (0, assert_1.default)(script.length > 0, "script must be a non-empty string");
        this.userAgent = userAgent;
        this.script = script;
        this.sessionIds = sessionIds;
    }
}
exports.UtmvcInput = UtmvcInput;
/**
 * Generates a `___utmvc` cookie.
 * @param session The {@link Session}
 * @param input The {@link UtmvcInput}
 * @returns {Promise<{payload: string, swhanedl: string | undefined}>} A {@link Promise} that, when resolved, will contain a `___utmvc` cookie
 */
function generateUtmvcCookie(session, input) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield (0, api_client_1.sendRequest)(session, "https://incapsula.hypersolutions.co/utmvc", input, (res) => {
            if (!res.payload) {
                throw new api_client_1.InvalidApiResponseError("No payload obtained from API");
            }
        });
        return {
            payload: response.payload,
            swhanedl: response.swhanedl
        };
    });
}
exports.generateUtmvcCookie = generateUtmvcCookie;
