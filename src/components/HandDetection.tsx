"use client";

import React, { useEffect, useRef, useState } from "react";

type HandDetectionProps = {
  // kept for compatibility with your page; not used here
  onPrediction?: (letter: string, confidence: number) => void;
  isActive?: boolean;
  width?: number;
  height?: number;
  className?: string;
  /** Set to false if you don't want a mirror effect */
  mirrored?: boolean;
};

export default function HandDetection({
  onPrediction, // eslint-disable-line @typescript-eslint/no-unused-vars
  isActive = true,
  width = 640,
  height = 480,
  className = "",
  mirrored = true,
}: HandDetectionProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Start/stop camera based on isActive
  useEffect(() => {
    let cancelled = false;

    const start = async () => {
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
        if (name === "NotAllowedError") {
          setError("Camera permission denied.");
        } else if (name === "NotFoundError") {
          setError("No camera found.");
        } else {
          setError("Unable to access the camera.");
        }
      }
    };

    const stop = () => {
      setReady(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };

    if (isActive) {
      void start();
    } else {
      stop();
    }

    return () => {
      cancelled = true;
      stop();
    };
  }, [isActive, width, height]);

  return (
    <div
      className={`relative inline-block bg-black ${className}`}
      style={{ width, height }}
    >
      <video
        ref={videoRef}
        width={width}
        height={height}
        autoPlay
        muted
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: mirrored ? "scaleX(-1)" : undefined,
        }}
      />

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
    </div>
  );
}
