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
exports.Challenge = exports.CryptoChallenge = exports.InvalidSecurityCheckpointCookieError = void 0;
exports.parseChallengeHTML = parseChallengeHTML;
exports.parseChallengeJSON = parseChallengeJSON;
const crypto_1 = require("crypto");
/**
 * The value of the `sec_cpt` cookie is invalid.
 */
class InvalidSecurityCheckpointCookieError extends Error {
    constructor(cookieValue) {
        super("Invalid sec_cpt cookie: " + cookieValue);
    }
}
exports.InvalidSecurityCheckpointCookieError = InvalidSecurityCheckpointCookieError;
/**
 * Crypto challenge.
 */
class CryptoChallenge {
    constructor(token, timestamp, nonce, difficulty, timeout, count) {
        this.token = token;
        this.timestamp = timestamp;
        this.nonce = nonce;
        this.difficulty = difficulty;
        this.timeout = timeout;
        this.count = count;
    }
    /**
     * Generates a payload to be submitted to `/_sec/verify?provider=crypto`.
     * @param cookie The value of the `sec_cpt` cookie
     * @returns The generated payload
     */
    generatePayload(cookie) {
        // Parse id
        const index = cookie.indexOf("~");
        if (index == -1) {
            throw new InvalidSecurityCheckpointCookieError(cookie);
        }
        const id = cookie.substring(0, index);
        // Generate payload
        return JSON.stringify({
            token: this.token,
            answers: this.generateAnswers(id)
        });
    }
    generateAnswers(id) {
        const answers = new Array(this.count);
        const prefix = id + this.timestamp + this.nonce;
        for (let i = 0; i < answers.length; i++) {
            const initialPart = prefix + (this.difficulty + i);
            while (true) {
                const answer = Math.random().toString(16);
                const hash = (0, crypto_1.createHash)("sha256");
                hash.update(initialPart + answer);
                const checksum = hash.digest();
                let output = 0;
                for (const v of checksum) {
                    output = ((output << 8) | v) >>> 0;
                    output %= this.difficulty + i;
                }
                if (output != 0) {
                    continue;
                }
                answers[i] = answer;
                break;
            }
        }
        return answers;
    }
}
exports.CryptoChallenge = CryptoChallenge;
/**
 * Security checkpoint challenge.
 */
class Challenge {
    constructor(duration, path, cryptoChallenge) {
        this.duration = duration;
        this.path = path;
        this.cryptoChallenge = cryptoChallenge;
    }
    /**
     * Returns a Promise that is resolved when the challenge's duration has passed.
     */
    wait() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => setTimeout(resolve, this.duration * 1000));
        });
    }
    /**
     * Reports if the crypto challenge is present.
     */
    hasCryptoChallenge() {
        return this.cryptoChallenge != undefined;
    }
    /**
     * Updates the crypto challenge with the response from `/_sec/verify?provider=crypto`.
     * @param response The raw HTTP response
     */
    updateCryptoChallenge(response) {
        const raw = JSON.parse(response);
        if (!raw.hasOwnProperty("token")) {
            this.cryptoChallenge = undefined;
            return;
        }
        this.cryptoChallenge = new CryptoChallenge(raw.token, raw.timestamp, raw.nonce, raw.difficulty, raw.timeout, raw.count);
    }
}
exports.Challenge = Challenge;
/**
 * Parses a security checkpoint challenge from the given HTML code.
 * Returns `null` if the parsed challenge is invalid.
 * @param src The HTML source code
 * @returns The challenge
 */
function parseChallengeHTML(src) {
    // exec regex
    const durationResult = /data-duration=(\d+)/.exec(src);
    if (durationResult == null || durationResult.length < 2) {
        return null;
    }
    // Parse duration as a number, return null if NaN
    const duration = parseInt(durationResult[1]);
    if (isNaN(duration)) {
        return null;
    }
    // Parse path
    const pageRegex = new RegExp('data-duration=\\d+\\s+src="([^"]+)"');
    const pageResult = pageRegex.exec(src);
    if (pageResult == null || pageResult.length < 2) {
        return null;
    }
    const path = pageResult[1];
    // Parse crypto challenge
    let challenge = undefined;
    const rawData = /challenge="(.*?)"/.exec(src);
    if (rawData != null && rawData.length >= 2) {
        const raw = JSON.parse(atob(rawData[1]));
        challenge = new CryptoChallenge(raw.token, raw.timestamp, raw.nonce, raw.difficulty, raw.timeout, raw.count);
    }
    return new Challenge(duration, path, challenge);
}
/**
 * Parses a security checkpoint challenge from the given raw JSON.
 * Returns `null` if the JSON is invalid.
 *
 * This function should be used to parse a block response (HTTP status 428).
 * @param src The raw JSON response
 * @returns The parsed {@link Challenge}
 */
function parseChallengeJSON(src) {
    const raw = JSON.parse(src);
    if (!raw.hasOwnProperty("sec-cp-challenge")) {
        return null;
    }
    return new Challenge(raw.chlg_duration, raw.branding_url_content, new CryptoChallenge(raw.token, raw.timestamp, raw.nonce, raw.difficulty, raw.timeout, raw.count));
}
