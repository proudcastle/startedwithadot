"use client";

import { useRef, useEffect, useCallback } from "react";

const BASE_RADIUS = 20;
const PULSE_AMOUNT = 2;
const CYCLE_MS = 3000;

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const sizeRef = useRef({ width: 0, height: 0 });

  const scaleCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();
    sizeRef.current = { width: rect.width, height: rect.height };
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.scale(dpr, dpr);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    scaleCanvas();

    function draw(timestamp: number) {
      const { width, height } = sizeRef.current;
      const radius =
        BASE_RADIUS +
        PULSE_AMOUNT * Math.sin((timestamp / CYCLE_MS) * 2 * Math.PI);

      const dpr = window.devicePixelRatio || 1;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.fillStyle = "#000000";
      ctx!.fillRect(0, 0, width, height);
      ctx!.beginPath();
      ctx!.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
      ctx!.fillStyle = "#ffffff";
      ctx!.fill();

      frameRef.current = requestAnimationFrame(draw);
    }

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [scaleCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas?.parentElement) return;

    const observer = new ResizeObserver(() => {
      scaleCanvas();
    });
    observer.observe(canvas.parentElement);
    return () => observer.disconnect();
  }, [scaleCanvas]);

  return (
    <div className="w-full" style={{ minHeight: "60vh" }}>
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        role="img"
        aria-label="A pulsing white dot on a black background"
      />
    </div>
  );
}
