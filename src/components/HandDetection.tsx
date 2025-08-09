"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  HandLandmarker,
  FilesetResolver,
  DrawingUtils,
  type NormalizedLandmark,
} from "@mediapipe/tasks-vision";

type HandDetectionProps = {
  onPrediction?: (letter: string, confidence: number) => void;
  isActive?: boolean;
  width?: number;
  height?: number;
  className?: string;
  /** Set to false if you don't want a mirror effect */
  mirrored?: boolean;
  /** OPTIONAL: expected label to compare against on the API */
  expected?: string | null;
  /** OPTIONAL: override backend URL (defaults to http://127.0.0.1:8000) */
  apiUrl?: string;
  /** OPTIONAL: how often to call the API (ms). Set 0/undefined to disable polling */
  pollMs?: number;
};

export default function HandDetection({
  onPrediction,
  isActive = true,
  width = 640,
  height = 480,
  className = "",
  mirrored = true,
  expected = null,
  apiUrl = "http://127.0.0.1:8000",
  pollMs = 1000,
}: HandDetectionProps) {
  // DOM refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // runtime refs
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const lastLandmarksRef = useRef<NormalizedLandmark[] | null>(null);

  // ui state
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [mlReady, setMlReady] = useState(false);

  // ---------- ML init (once) ----------
  useEffect(() => {
    let cancelled = false;

    const initML = async () => {
      try {
        // Load WASM and model
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        const handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: "/models/hand_landmarker.task" },
          runningMode: "VIDEO",
          numHands: 1,
        });

        if (!cancelled) {
          landmarkerRef.current = handLandmarker;
          setMlReady(true);
        }
      } catch (e) {
        console.error("❌ HandLandmarker init failed:", e);
        if (!cancelled) setError("Failed to initialize hand tracker.");
      }
    };

    initML();

    return () => {
      cancelled = true;
      // Clean up landmarker if created
      try {
        landmarkerRef.current?.close();
      } catch {
        /* noop */
      }
      landmarkerRef.current = null;
    };
  }, []);

  // ---------- Camera start/stop based on isActive ----------
  useEffect(() => {
    let cancelled = false;

    const startCamera = async () => {
      if (!isActive || cancelled) return;
      setError(null);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: width },
            height: { ideal: height },
          },
          audio: false,
        });

        streamRef.current = stream;

        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          await video.play().catch(() => {});
          if (!cancelled) setReady(true);
        }
      } catch (e) {
        const name = (e as DOMException)?.name;
        if (name === "NotAllowedError") setError("Camera permission denied.");
        else if (name === "NotFoundError") setError("No camera found.");
        else setError("Unable to access the camera.");
      }
    };

    const stopCamera = () => {
      setReady(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };

    if (isActive) void startCamera();
    else stopCamera();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [isActive, width, height]);

  // ---------- Per-frame detection loop ----------
  useEffect(() => {
    if (!isActive) return;

    const loop = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const landmarker = landmarkerRef.current;

      if (!video || !canvas || !landmarker || !mlReady || !ready) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      // Ensure canvas matches the intrinsic video size
      const vw = video.videoWidth || width;
      const vh = video.videoHeight || height;
      if (canvas.width !== vw) canvas.width = vw;
      if (canvas.height !== vh) canvas.height = vh;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      // Clear and draw the current video frame as the background (so we can hide the <video> if desired)
      ctx.save();
      if (mirrored) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Run detection
      const result = landmarker.detectForVideo(video, Date.now());

      // Draw landmarks/connectors
      if (result.landmarks && result.landmarks.length > 0) {
        const drawing = new DrawingUtils(ctx);
        const landmarks = result.landmarks[0];
        lastLandmarksRef.current = landmarks;

        drawing.drawLandmarks(landmarks);
        drawing.drawConnectors(landmarks);
      } else {
        lastLandmarksRef.current = null;
      }

      ctx.restore();

      rafRef.current = requestAnimationFrame(loop);
    };

    runningRef.current = true;
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      runningRef.current = false;
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [isActive, mlReady, ready, mirrored, width, height]);

  // ---------- Optional API polling ----------
  useEffect(() => {
    if (!pollMs || pollMs <= 0) return;

    const timer = setInterval(async () => {
      const pts = lastLandmarksRef.current;
      if (!pts) return;

      try {
        const res = await fetch(`${apiUrl.replace(/\/$/, "")}/api/verify-sign`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            landmarks: pts.map((p) => [p.x, p.y, p.z]),
            expected: expected ?? undefined,
          }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: {
          top_label: string;
          top_confidence: number;
          probs: Record<string, number>;
          match?: boolean | null;
        } = await res.json();

        onPrediction?.(data.top_label, data.top_confidence);
      } catch (e) {
        // Be quiet in UI; log for debugging
        console.debug("verify-sign request failed:", e);
      }
    }, pollMs);

    return () => clearInterval(timer);
  }, [apiUrl, expected, pollMs, onPrediction]);

  return (
    <div
      className={`relative inline-block bg-black ${className}`}
      style={{ width, height }}
    >
      {/* Keep the <video> hidden — we draw the video frame into the canvas */}
      <video
        ref={videoRef}
        width={width}
        height={height}
        autoPlay
        muted
        playsInline
        style={{ display: "none" }}
      />

      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          // We draw mirroring in the 2D context; no CSS mirror needed.
          // Keeping this here in case you prefer CSS-only mirroring:
          // transform: mirrored ? "scaleX(-1)" : undefined,
        }}
      />

      {/* Overlays */}
      {!ready && !error && (
        <div className="absolute inset-0 grid place-items-center text-white/90 text-sm">
          <span>Starting camera…</span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 grid place-items-center bg-black/70 text-white text-sm px-4 text-center">
          {error}
        </div>
      )}
      {!mlReady && !error && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/80 text-xs">
          Loading hand tracker…
        </div>
      )}
    </div>
  );
}
