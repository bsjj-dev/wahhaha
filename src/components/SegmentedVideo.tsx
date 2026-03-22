"use client";

import { useRef, useEffect, useState } from "react";

interface SegmentedVideoProps {
  videoTrack: MediaStreamTrack | null | undefined;
  width: number;
  height: number;
  isSelf?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let segmenterPromise: Promise<any> | null = null;
let segmenterFailed = false;

async function getSegmenter() {
  if (segmenterFailed) return null;
  if (segmenterPromise) return segmenterPromise;

  segmenterPromise = (async () => {
    try {
      const { FilesetResolver, ImageSegmenter } = await import("@mediapipe/tasks-vision");
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
      );
      const segmenter = await ImageSegmenter.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        outputCategoryMask: true,
      });
      return segmenter;
    } catch (e) {
      console.warn("MediaPipe segmenter failed to load:", e);
      segmenterFailed = true;
      return null;
    }
  })();

  return segmenterPromise;
}

export default function SegmentedVideo({ videoTrack, width, height, isSelf }: SegmentedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const segmenterRef = useRef<any>(null);
  const lastTimeRef = useRef<number>(-1);
  const [segmenterReady, setSegmenterReady] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  // Set up video source
  useEffect(() => {
    const video = videoRef.current;
    if (!videoTrack || !video) return;

    const stream = new MediaStream([videoTrack]);
    video.srcObject = stream;

    const onPlaying = () => setVideoReady(true);
    video.addEventListener("playing", onPlaying);

    return () => video.removeEventListener("playing", onPlaying);
  }, [videoTrack]);

  // Load segmenter
  useEffect(() => {
    let mounted = true;
    getSegmenter().then((seg) => {
      if (mounted && seg) {
        segmenterRef.current = seg;
        setSegmenterReady(true);
      }
    });
    return () => { mounted = false; };
  }, []);

  // Process frames
  useEffect(() => {
    if (!videoReady) return;

    const processFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) {
        rafRef.current = requestAnimationFrame(processFrame);
        return;
      }

      // Match canvas internal resolution to the video's native size
      // to avoid any warping. CSS will scale it to fit the container.
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const now = performance.now();
      if (Math.abs(now - lastTimeRef.current) < 33) {
        // Throttle to ~30fps for performance
        rafRef.current = requestAnimationFrame(processFrame);
        return;
      }
      lastTimeRef.current = now;

      // Draw video to canvas (mirrored if self)
      ctx.save();
      if (isSelf) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Apply segmentation mask
      const segmenter = segmenterRef.current;
      if (segmenter) {
        try {
          const result = segmenter.segmentForVideo(video, now);
          const mask = result.categoryMask?.getAsFloat32Array();

          if (mask) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            const cw = canvas.width;
            const ch = canvas.height;

            // The selfie segmenter mask:
            // Values NEAR 1.0 = background
            // Values NEAR 0.0 = person/foreground
            // Mask size matches video dimensions

            for (let y = 0; y < ch; y++) {
              for (let x = 0; x < cw; x++) {
                // For mirrored self-view, flip the mask x coordinate
                const mx = isSelf ? (cw - 1 - x) : x;
                const maskVal = mask[y * cw + mx];
                const pixelIdx = (y * cw + x) * 4;

                // maskVal > 0.7 = definitely background -> transparent
                // maskVal 0.3 to 0.7 = edge -> feathered
                // maskVal < 0.3 = definitely person -> keep opaque
                if (maskVal > 0.7) {
                  pixels[pixelIdx + 3] = 0;
                } else if (maskVal > 0.3) {
                  const alpha = 1.0 - (maskVal - 0.3) / 0.4;
                  pixels[pixelIdx + 3] = Math.round(alpha * 255);
                }
                // else: keep fully opaque
              }
            }

            ctx.putImageData(imageData, 0, 0);
          }
          result.close();
        } catch {
          // Segmentation error — raw video already drawn, that's fine
        }
      }

      rafRef.current = requestAnimationFrame(processFrame);
    };

    rafRef.current = requestAnimationFrame(processFrame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [videoReady, segmenterReady, isSelf]);

  return (
    <div style={{ width, height, position: "relative", overflow: "hidden" }}>
      {/* Hidden video — needs to be in DOM but not visible for decoding */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: "none",
        }}
      />
      {/* Output canvas — renders at native video resolution, CSS scales to container */}
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}
