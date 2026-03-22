declare module "@mediapipe/tasks-vision" {
  export class FilesetResolver {
    static forVisionTasks(wasmPath: string): Promise<unknown>;
  }

  interface SegmenterOptions {
    baseOptions: {
      modelAssetPath: string;
      delegate?: string;
    };
    runningMode: string;
    outputCategoryMask?: boolean;
  }

  interface CategoryMask {
    getAsFloat32Array(): Float32Array;
  }

  interface SegmentationResult {
    categoryMask?: CategoryMask;
    close(): void;
  }

  export class ImageSegmenter {
    static createFromOptions(
      vision: unknown,
      options: SegmenterOptions,
    ): Promise<ImageSegmenter>;
    segmentForVideo(
      video: HTMLVideoElement,
      timestamp: number,
    ): SegmentationResult;
  }
}
