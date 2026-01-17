"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseObject = void 0;
/**
 * Parses `var dd = {...};` as a JSON object.
 *
 * Note: NOT A PUBLIC API.
 * @param body Response body
 */
function parseObject(body) {
    let result = /var\s+dd\s*=\s*(\{\s*([\s\S]*?)\s*})/.exec(body);
    if (result == null || result.length < 2 || result[1] == null) {
        return null;
    }
    let raw = result[1].replace(/'([^']*)'/g, `"$1"`);
    raw = raw.replace(/([^"]|^)(\b\w+)\s*: /g, `$1"$2":`);
    return JSON.parse(raw);
}
exports.parseObject = parseObject;
