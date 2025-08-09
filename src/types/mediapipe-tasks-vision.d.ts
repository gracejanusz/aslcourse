// Minimal, safe type surface for what we use in HandDetection.tsx

declare module "@mediapipe/tasks-vision" {
    /** A single normalized landmark from MediaPipe (0..1 in x/y, z in scene units). */
    export interface NormalizedLandmark {
      x: number;
      y: number;
      z: number;
    }
  
    export type HandLandmarkerConnections = Array<[number, number]>;
  
    export interface HandLandmarkerResult {
      /** One array per detected hand; each hand has 21 landmarks. */
      landmarks?: NormalizedLandmark[][];
      // Other fields exist but are not required here.
    }
  
    export interface HandLandmarkerOptions {
      baseOptions: {
        modelAssetPath: string;
      };
      runningMode: "VIDEO" | "IMAGE";
      numHands?: number;
    }
  
    /** Opaque type returned by FilesetResolver. We don't inspect it. */
    export type VisionFileset = unknown;
  
    export class FilesetResolver {
      static forVisionTasks(baseUrl: string): Promise<VisionFileset>;
    }
  
    export class HandLandmarker {
      static createFromOptions(
        fileset: VisionFileset,
        options: HandLandmarkerOptions
      ): Promise<HandLandmarker>;
  
      /** Some builds expose this; guarded at runtime in app code. */
      static HAND_CONNECTIONS?: HandLandmarkerConnections;
  
      detectForVideo(
        video: HTMLVideoElement,
        timestampMs: number
      ): HandLandmarkerResult;
  
      close(): void;
    }
  
    export class DrawingUtils {
      constructor(ctx: CanvasRenderingContext2D);
  
      drawLandmarks(
        landmarks: NormalizedLandmark[],
        style?: unknown
      ): void;
  
      drawConnectors(
        landmarks: NormalizedLandmark[],
        connections: HandLandmarkerConnections,
        style?: unknown
      ): void;
    }
  }
  