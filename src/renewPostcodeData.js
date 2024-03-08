"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const node_fetch_1 = __importDefault(require("node-fetch"));
const jszip_1 = __importDefault(require("jszip"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const iconv_lite_1 = __importDefault(require("iconv-lite"));
const fs = __importStar(require("graceful-fs"));
function createFile(data) {
    try {
        const dir = data[2].slice(0, 3);
        const file = data[2].slice(3);
        if (dir.length !== 3 || file.length !== 4) {
            console.log(`unknown postal code: ${data[2]}`);
            return;
        }
        fs.mkdirSync(`docs/api/${dir}`, { recursive: true });
        fs.writeFileSync(`docs/api/${dir}/${file}.json`, JSON.stringify({
            local_government_code: data[0],
            zip_code: data[2],
            address: [data[6], data[7], data[8]],
            address_kana: [data[3], data[4], data[5]]
        }));
    }
    catch (err) {
        console.log(err);
    }
}
function renewPostcodeData() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield (0, node_fetch_1.default)('https://www.post.japanpost.jp/zipcode/dl/kogaki/zip/ken_all.zip');
        const buffer = yield res.buffer();
        const zip = yield jszip_1.default.loadAsync(buffer);
        const fileName = Object.keys(zip.files)[0];
        const converterStream = iconv_lite_1.default.decodeStream('shift_jis');
        zip.file(fileName).nodeStream().pipe(converterStream)
            .pipe((0, csv_parser_1.default)({ headers: false }))
            .on('data', (data) => createFile(data));
    });
}
exports.default = renewPostcodeData;
