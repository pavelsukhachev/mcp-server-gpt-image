import { z } from 'zod';
export declare const ImageGenerationSchema: z.ZodObject<{
    prompt: z.ZodString;
    size: z.ZodDefault<z.ZodOptional<z.ZodEnum<["1024x1024", "1024x1536", "1536x1024", "auto"]>>>;
    quality: z.ZodDefault<z.ZodOptional<z.ZodEnum<["low", "medium", "high", "auto"]>>>;
    format: z.ZodDefault<z.ZodOptional<z.ZodEnum<["png", "jpeg", "webp"]>>>;
    background: z.ZodDefault<z.ZodOptional<z.ZodEnum<["transparent", "opaque", "auto"]>>>;
    output_compression: z.ZodOptional<z.ZodNumber>;
    moderation: z.ZodDefault<z.ZodOptional<z.ZodEnum<["auto", "low"]>>>;
    n: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    partialImages: z.ZodOptional<z.ZodNumber>;
    stream: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    prompt: string;
    size: "1024x1024" | "1024x1536" | "1536x1024" | "auto";
    quality: "auto" | "low" | "medium" | "high";
    format: "png" | "jpeg" | "webp";
    background: "auto" | "transparent" | "opaque";
    moderation: "auto" | "low";
    n: number;
    stream: boolean;
    output_compression?: number | undefined;
    partialImages?: number | undefined;
}, {
    prompt: string;
    size?: "1024x1024" | "1024x1536" | "1536x1024" | "auto" | undefined;
    quality?: "auto" | "low" | "medium" | "high" | undefined;
    format?: "png" | "jpeg" | "webp" | undefined;
    background?: "auto" | "transparent" | "opaque" | undefined;
    output_compression?: number | undefined;
    moderation?: "auto" | "low" | undefined;
    n?: number | undefined;
    partialImages?: number | undefined;
    stream?: boolean | undefined;
}>;
export type ImageGenerationInput = z.infer<typeof ImageGenerationSchema>;
export declare const ImageEditSchema: z.ZodObject<{
    prompt: z.ZodString;
    images: z.ZodArray<z.ZodString, "many">;
    mask: z.ZodOptional<z.ZodString>;
    size: z.ZodDefault<z.ZodOptional<z.ZodEnum<["1024x1024", "1024x1536", "1536x1024", "auto"]>>>;
    quality: z.ZodDefault<z.ZodOptional<z.ZodEnum<["low", "medium", "high", "auto"]>>>;
    format: z.ZodDefault<z.ZodOptional<z.ZodEnum<["png", "jpeg", "webp"]>>>;
    background: z.ZodDefault<z.ZodOptional<z.ZodEnum<["transparent", "opaque", "auto"]>>>;
    output_compression: z.ZodOptional<z.ZodNumber>;
    moderation: z.ZodDefault<z.ZodOptional<z.ZodEnum<["auto", "low"]>>>;
    n: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    prompt: string;
    size: "1024x1024" | "1024x1536" | "1536x1024" | "auto";
    quality: "auto" | "low" | "medium" | "high";
    format: "png" | "jpeg" | "webp";
    background: "auto" | "transparent" | "opaque";
    moderation: "auto" | "low";
    n: number;
    images: string[];
    output_compression?: number | undefined;
    mask?: string | undefined;
}, {
    prompt: string;
    images: string[];
    size?: "1024x1024" | "1024x1536" | "1536x1024" | "auto" | undefined;
    quality?: "auto" | "low" | "medium" | "high" | undefined;
    format?: "png" | "jpeg" | "webp" | undefined;
    background?: "auto" | "transparent" | "opaque" | undefined;
    output_compression?: number | undefined;
    moderation?: "auto" | "low" | undefined;
    n?: number | undefined;
    mask?: string | undefined;
}>;
export type ImageEditInput = z.infer<typeof ImageEditSchema>;
export interface ImageGenerationResult {
    images: string[];
    revised_prompt?: string;
    id?: string;
}
export interface StreamingImageEvent {
    type: 'partial_image' | 'final_image' | 'error';
    data: {
        image?: string;
        index?: number;
        error?: string;
    };
}
//# sourceMappingURL=types.d.ts.map