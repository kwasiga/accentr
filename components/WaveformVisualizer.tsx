"use client";

import { useEffect, useRef } from "react";

type Props = {
  getFrequencyData: () => Uint8Array;
  isActive: boolean;
};

export default function WaveformVisualizer({ getFrequencyData, isActive }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function draw() {
      if (!canvas || !ctx) return;
      const data = getFrequencyData();
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      if (!isActive || data.length === 0) {
        // Idle flat line
        ctx.strokeStyle = "#7c6ff750";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, H / 2);
        ctx.lineTo(W, H / 2);
        ctx.stroke();
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const barCount = 48;
      const step = Math.floor(data.length / barCount);
      const barW = W / barCount - 2;

      for (let i = 0; i < barCount; i++) {
        const value = data[i * step] / 255;
        const barH = Math.max(3, value * H * 0.85);
        const x = i * (barW + 2);
        const y = (H - barH) / 2;

        const alpha = 0.4 + value * 0.6;
        ctx.fillStyle = `rgba(124, 111, 247, ${alpha})`;
        ctx.beginPath();
        ctx.roundRect(x, y, barW, barH, 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [getFrequencyData, isActive]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={64}
      className="w-full max-w-xs rounded-xl"
    />
  );
}
