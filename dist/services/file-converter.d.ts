import { IFileConverter } from '../interfaces/image-generation.interface.js';
export declare class FileConverter implements IFileConverter {
    base64ToFile(base64: string, filename: string, mimeType: string): File;
    extractBase64FromDataUrl(dataUrl: string): string;
}
//# sourceMappingURL=file-converter.d.ts.map