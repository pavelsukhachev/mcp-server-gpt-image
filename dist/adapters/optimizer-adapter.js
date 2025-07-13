import { ImageOptimizer } from '../utils/image-optimizer.js';
export class OptimizerAdapter {
    async optimizeBatch(images, input) {
        return ImageOptimizer.optimizeBatch(images, input);
    }
    async calculateSizeReduction(originalBase64, optimizedBase64) {
        return ImageOptimizer.calculateSizeReduction(originalBase64, optimizedBase64);
    }
}
//# sourceMappingURL=optimizer-adapter.js.map