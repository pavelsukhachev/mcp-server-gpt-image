export class FileConverter {
    base64ToFile(base64, filename, mimeType) {
        const buffer = Buffer.from(base64, 'base64');
        return new File([buffer], filename, { type: mimeType });
    }
    extractBase64FromDataUrl(dataUrl) {
        if (dataUrl.startsWith('data:')) {
            const base64Data = dataUrl.split(',')[1];
            if (!base64Data) {
                throw new Error('Invalid data URL format');
            }
            return base64Data;
        }
        return dataUrl;
    }
}
//# sourceMappingURL=file-converter.js.map