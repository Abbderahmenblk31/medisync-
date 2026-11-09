'use client';

import React, { useEffect, useRef, useState } from 'react';
import { medicalAudio } from '@/lib/sound/medical-audio';

interface EcgProps {
  bpm?: number;
  label?: string;
  leadName?: string;
  isPulsingAudio?: boolean;
}

export function EcgliveMonitor({
  bpm = 74,
  label = 'Sinus Rhythm Lead II',
  leadName = 'LEAD II - V5',
  isPulsingAudio = false,
}: EcgProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentBpm, setCurrentBpm] = useState(bpm);
  const [audioEnabled, setAudioEnabled] = useState(isPulsingAudio);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let x = 0;
    const height = canvas.height;
    const width = canvas.width;
    const midY = height / 2;

    // Grid background
    const drawGrid = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.03)';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(14, 165, 233, 0.08)';
      ctx.lineWidth = 0.5;

      const gridSize = 16;
      for (let gx = 0; gx < width; gx += gridSize) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }
      for (let gy = 0; gy < height; gy += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }
    };

    drawGrid();

    // Standard P-Q-R-S-T wave calculation
    const getEcgY = (phase: number) => {
      // phase: 0 to 1
      if (phase < 0.15) return 0; // baseline
      if (phase >= 0.15 && phase < 0.22) {
        // P wave (atrial depolarization)
        return -Math.sin(((phase - 0.15) / 0.07) * Math.PI) * 12;
      }
      if (phase >= 0.22 && phase < 0.3) return 0; // PR segment
      if (phase >= 0.3 && phase < 0.33) {
        // Q wave (septal depolarization)
        return ((phase - 0.3) / 0.03) * 8;
      }
      if (phase >= 0.33 && phase < 0.38) {
        // R wave (ventricular depolarization peak!)
        const t = (phase - 0.33) / 0.05;
        if (t < 0.5) {
          return 8 - (t / 0.5) * 60; // shoot up to -52
        } else {
          return -52 + ((t - 0.5) / 0.5) * 70; // shoot down to +18
        }
      }
      if (phase >= 0.38 && phase < 0.42) {
        // S wave (recovery)
        return 18 - ((phase - 0.38) / 0.04) * 18;
      }
      if (phase >= 0.42 && phase < 0.52) return 0; // ST segment
      if (phase >= 0.52 && phase < 0.68) {
        // T wave (ventricular repolarization)
        return -Math.sin(((phase - 0.52) / 0.16) * Math.PI) * 18;
      }
      return 0; // baseline resting
    };

    let beatProgress = 0;
    const speed = 1.8;
    const beatPeriod = 220; // period width in pixels per beat cycle
    let lastBeatTrigger = 0;

    let prevX = 0;
    let prevY = midY;

    const render = () => {
      x = (x + speed) % width;
      beatProgress = (x % beatPeriod) / beatPeriod;

      // Erase a cursor band ahead of the drawing sweep
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      // in dark mode, clear with dark color
      const isDark = document.documentElement.classList.contains('dark');
      ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
      ctx.fillRect((x + 2) % width, 0, 14, height);

      // Trigger heartbeat audio right at the R-wave peak
      if (beatProgress > 0.33 && beatProgress < 0.36) {
        const now = Date.now();
        if (now - lastBeatTrigger > 500) {
          lastBeatTrigger = now;
          if (audioEnabled) {
            medicalAudio.playHeartbeat(currentBpm);
          }
        }
      }

      const ecgDelta = getEcgY(beatProgress);
      const currentY = midY + ecgDelta;

      if (x > prevX) {
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, currentY);
        ctx.strokeStyle = isDark ? '#38bdf8' : '#0284c7'; // surgical sky cyan
        ctx.lineWidth = 2;
        ctx.shadowColor = isDark ? '#38bdf8' : '#0284c7';
        ctx.shadowBlur = 4;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      prevX = x;
      prevY = currentY;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentBpm, audioEnabled]);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-hidden shadow-xs">
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/40">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
          </span>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {label}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">{leadName} • 25mm/s • 10mm/mV</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-1 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/60 px-3 py-1 rounded-xl">
            <span className="text-xs text-sky-600 dark:text-sky-400 font-semibold">HR</span>
            <span className="font-mono text-lg font-bold text-sky-700 dark:text-sky-300">
              {currentBpm}
            </span>
            <span className="text-[10px] text-sky-600 dark:text-sky-400">BPM</span>
          </div>

          <button
            onClick={() => {
              setAudioEnabled(!audioEnabled);
              medicalAudio.playTactileClick();
            }}
            title={audioEnabled ? 'Mute Heartbeat Acoustic' : 'Enable Heartbeat Acoustic'}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              audioEnabled
                ? 'bg-sky-500 text-white border-sky-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            {audioEnabled ? '🔊 Sound On' : '🔇 Muted'}
          </button>
        </div>
      </div>

      <div className="relative h-28 bg-slate-50/30 dark:bg-slate-950/50">
        <canvas
          ref={canvasRef}
          width={640}
          height={112}
          className="w-full h-full block"
        />

        <div className="absolute bottom-2 left-4 text-[10px] font-mono text-slate-400 flex items-center gap-4 pointer-events-none">
          <span>QRS: 84ms</span>
          <span>QTc: 412ms</span>
          <span>PR: 142ms</span>
          <span className="text-emerald-500 font-semibold">ST-Segment: Normal</span>
        </div>
      </div>
    </div>
  );
}
