"use client";
import { ActivityDifficulty } from "@prisma/client";
import { useEffect, useRef } from "react";

interface LiquidDifficultyIndicatorProps {
  difficulty: ActivityDifficulty;
  size?: number;
}

export function LiquidDifficultyIndicator({
  difficulty,
  size = 24, // Even smaller default size
}: LiquidDifficultyIndicatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Define difficulty levels with colors and fill percentages
  const difficultyConfig = {
    [ActivityDifficulty.EASY]: {
      color: "#4ade80", // green-400
      fillPercentage: 0.25,
      waveHeight: 0.02,
    },
    [ActivityDifficulty.MODERATE]: {
      color: "#fbbf24", // amber-400
      fillPercentage: 0.5,
      waveHeight: 0.03,
    },
    [ActivityDifficulty.HARD]: {
      color: "#f97316", // orange-500
      fillPercentage: 0.75,
      waveHeight: 0.04,
    },
    [ActivityDifficulty.EXTREME]: {
      color: "#ef4444", // red-500
      fillPercentage: 0.95,
      waveHeight: 0.05,
    },
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const config = difficultyConfig[difficulty];
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    // Draw the indicator with a static wave
    const drawWave = () => {
      // Clear canvas
      ctx.clearRect(0, 0, size, size);

      // Draw circle background with black border
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
      ctx.strokeStyle = "#000000"; // Black border
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw liquid fill with static wave effect
      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size / 2 - 2; // Slightly smaller to account for border

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip();

      const fillHeight = size * (1 - config.fillPercentage);

      ctx.beginPath();
      ctx.moveTo(0, fillHeight);

      // Fixed wave pattern (no animation)
      const waveTime = 2.5; // Fixed value for static wave

      for (let x = 0; x <= size; x += 3) {
        // More points for smoother wave
        const y =
          fillHeight + Math.sin(x * 0.15 + waveTime) * config.waveHeight * size;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(size, size);
      ctx.lineTo(0, size);
      ctx.closePath();

      ctx.fillStyle = config.color;
      ctx.fill();

      ctx.restore();
    };

    drawWave();
  }, [difficulty, size]);

  return <canvas ref={canvasRef} className="liquid-difficulty-indicator" />;
}
