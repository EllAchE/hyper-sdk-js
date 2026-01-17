"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseKasadaPath = void 0;
/**
 * Parses the Kasada ips.js path from the given HTML source code.
 * Returns `null` if the path can't be found.
 * Replaces &amp; with & in the result.
 * @param src The HTML source code
 */
function parseKasadaPath(src) {
    const scriptPathExpr = /<script\s+src="([^"]+)"/;
    const result = scriptPathExpr.exec(src);
    if (result === null || result === void 0 ? void 0 : result[1]) {
        return result[1].replace(/&amp;/g, '&');
    }
    return null;
}
exports.parseKasadaPath = parseKasadaPath;
