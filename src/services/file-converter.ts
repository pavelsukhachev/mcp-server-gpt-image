import { IFileConverter } from '../interfaces/image-generation.interface.js';

export class FileConverter implements IFileConverter {
  base64ToFile(base64: string, filename: string, mimeType: string): File {
    const buffer = Buffer.from(base64, 'base64');
    return new File([buffer], filename, { type: mimeType });
  }

  extractBase64FromDataUrl(dataUrl: string): string {
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