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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var axios_1 = require("axios");
var response;
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
function lambdaHandler(event, context) {
    return __awaiter(this, void 0, void 0, function () {
        var currentTemperature, now, ret, message, ret, ret, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    currentTemperature = void 0;
                    now = Math.floor(Date.now() / 1000);
                    return [4 /*yield*/, axios_1["default"]({
                            url: 'https://api.mackerelio.com/api/v0/services/home/metrics',
                            params: {
                                name: 'natureremo.temperature.Remo',
                                // Mackerel内部では300秒ごとに値を保存しているようで、最新の値以外は要らないのでfromには300秒前を指定。
                                from: now - 300,
                                to: now
                            },
                            headers: { 'X-Api-Key': process.env.MACKEREL_API_KEY }
                        })];
                case 1:
                    ret = _a.sent();
                    currentTemperature = ret.data['metrics'].slice(-1)[0]['value'];
                    _a.label = 2;
                case 2:
                    message = 'Nothing to do';
                    if (!(currentTemperature < 18.0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, axios_1["default"]("https://maker.ifttt.com/trigger/aircon_on_heater/with/key/" + process.env.IFTTT_API_KEY)];
                case 3:
                    ret = _a.sent();
                    message = ret.data.trim();
                    return [3 /*break*/, 6];
                case 4:
                    if (!(currentTemperature >= 30.0)) return [3 /*break*/, 6];
                    return [4 /*yield*/, axios_1["default"]("https://maker.ifttt.com/trigger/aircon_on_cooler/with/key/" + process.env.IFTTT_API_KEY)];
                case 5:
                    ret = _a.sent();
                    message = ret.data.trim();
                    _a.label = 6;
                case 6:
                    response = {
                        'statusCode': 200,
                        'body': JSON.stringify({
                            message: message
                        })
                    };
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _a.sent();
                    console.log(err_1);
                    return [2 /*return*/, err_1];
                case 8: return [2 /*return*/, response];
            }
        });
    });
}
exports.lambdaHandler = lambdaHandler;
