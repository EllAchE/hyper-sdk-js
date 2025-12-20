"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsInput = void 0;
exports.generateTagsPayload = generateTagsPayload;
const api_client_1 = require("../shared/api-client");
/**
 * Tags API input.
 */
class TagsInput {
    /**
     * Creates a new instance.
     * Refer to the {@link https://docs.justhyped.dev/akamai-web/api-reference|documentation} for more information.
     * @param userAgent The user agent to impersonate
     * @param ddk sitekey, static for each site. parse it from the /js/ payload request from browser
     * @param referer The referer visible as the referer header in the payload POST
     * @param type First time 'ch', second time 'le'
     * @param ip The IPV4 address of your network or proxy.
     * @param acceptLanguage Your accept-language header.
     * @param version Version string
     * @param cid Your current datadome cookie (optional)
     */
    constructor(userAgent, ddk, referer, type, ip, acceptLanguage, version, cid) {
        this.userAgent = userAgent;
        this.ddk = ddk;
        this.referer = referer;
        this.type = type;
        this.ip = ip;
        this.acceptLanguage = acceptLanguage;
        this.version = version;
        this.cid = cid;
    }
}
exports.TagsInput = TagsInput;
/**
 * Generates a DataDome tags payload that can be used to obtain a solved `datadome` cookie.
 * @param session The {@link Session}
 * @param input The {@link TagsInput}
 * @returns {Promise<string>} A {@link Promise} that, when resolved, will contain a tags payload
 */
function generateTagsPayload(session, input) {
    return (0, api_client_1.sendPayloadRequest)(session, "https://datadome.hypersolutions.co/tags", input);
}
