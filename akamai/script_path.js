"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAkamaiPath = void 0;
/**
 * Parses the Akamai Bot Manager web SDK path from the given HTML source code.
 * Returns `null` if the path can't be found.
 * @param src The HTML source code
 */
function parseAkamaiPath(src) {
    var _a;
    const result = /<script type="text\/javascript"\s*(?:nonce=".*?")?\s*src="([a-z\d/\-_]+)"><\/script>/i.exec(src);
    return (_a = result === null || result === void 0 ? void 0 : result[1]) !== null && _a !== void 0 ? _a : null;
}
exports.parseAkamaiPath = parseAkamaiPath;
