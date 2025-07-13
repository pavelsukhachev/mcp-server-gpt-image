"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileConverter = void 0;
var FileConverter = /** @class */ (function () {
    function FileConverter() {
    }
    FileConverter.prototype.base64ToFile = function (base64, filename, mimeType) {
        var buffer = Buffer.from(base64, 'base64');
        return new File([buffer], filename, { type: mimeType });
    };
    FileConverter.prototype.extractBase64FromDataUrl = function (dataUrl) {
        if (dataUrl.startsWith('data:')) {
            var base64Data = dataUrl.split(',')[1];
            if (!base64Data) {
                throw new Error('Invalid data URL format');
            }
            return base64Data;
        }
        return dataUrl;
    };
    return FileConverter;
}());
exports.FileConverter = FileConverter;
