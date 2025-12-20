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
exports.KasadaPowInput = void 0;
exports.generateKasadaPow = generateKasadaPow;
const api_client_1 = require("../shared/api-client");
/**
 * Input for Kasada Proof of Work calculation.
 */
class KasadaPowInput {
    /**
     * Creates a new instance of KasadaPowInput.
     * @param st The x-kpsdk-st value returned by the /tl POST request.
     * @param ct The x-kpsdk-ct value returned by the /tl POST request.
     * @param domain The domain.
     * @param fc Optional. The x-kpsdk-fc value returned by the /mfc GET request.
     * @param workTime Optional. Can be used to pre-generate POW strings.
     */
    constructor(st, ct, domain, fc, workTime) {
        this.st = st;
        this.ct = ct;
        this.domain = domain;
        if (workTime !== undefined) {
            this.workTime = workTime;
        }
        if (fc !== undefined) {
            this.fc = fc;
        }
    }
}
exports.KasadaPowInput = KasadaPowInput;
/**
 * Generates Kasada POW (x-kpsdk-cd).
 * @param session The {@link Session}
 * @param input The {@link KasadaPowInput}
 * @returns {Promise<string>} A {@link Promise} that, when resolved, will contain the x-kpsdk-cd token.
 */
function generateKasadaPow(session, input) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, api_client_1.sendPayloadRequest)(session, "https://kasada.hypersolutions.co/cd", input);
    });
}
