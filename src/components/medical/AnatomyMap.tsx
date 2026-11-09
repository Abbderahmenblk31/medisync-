'use client';

import React, { useState } from 'react';
import { medicalAudio } from '@/lib/sound/medical-audio';

export type BodyZone = 'HEAD' | 'CHEST' | 'ABDOMEN' | 'SPINE' | 'LIMBS' | 'ALL';

interface AnatomyMapProps {
  activeZone: BodyZone;
  onSelectZone: (zone: BodyZone) => void;
  zoneCounts?: Partial<Record<BodyZone, number>>;
}

export function AnatomyMap({
  activeZone,
  onSelectZone,
  zoneCounts = { HEAD: 2, CHEST: 3, ABDOMEN: 1, SPINE: 2, LIMBS: 1 },
}: AnatomyMapProps) {
  const [hoveredZone, setHoveredZone] = useState<BodyZone | null>(null);

  const handleZoneClick = (zone: BodyZone) => {
    medicalAudio.playTactileClick();
    onSelectZone(zone === activeZone ? 'ALL' : zone);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <span>🧍‍♂️</span>
            <span>Interactive Anatomical Triage Map</span>
          </h4>
          <p className="text-[11px] text-slate-400">Click body quadrant to filter clinical complaints</p>
        </div>

        {activeZone !== 'ALL' && (
          <button
            onClick={() => onSelectZone('ALL')}
            className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline"
          >
            Reset (Show All)
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* SVG Interactive Silhouette */}
        <div className="relative flex justify-center py-2 bg-slate-50/50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800/80">
          <svg
            viewBox="0 0 200 320"
            className="w-44 h-64 select-none"
            style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.05))' }}
          >
            {/* Outline Body Base */}
            <g className="transition-all duration-200">
              {/* Head / Cranial Region */}
              <circle
                cx="100"
                cy="40"
                r="24"
                className={`cursor-pointer transition-all ${
                  activeZone === 'HEAD'
                    ? 'fill-rose-500 stroke-rose-600'
                    : hoveredZone === 'HEAD'
                    ? 'fill-rose-400/80 stroke-rose-400'
                    : 'fill-slate-200 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-700'
                }`}
                strokeWidth="2"
                onClick={() => handleZoneClick('HEAD')}
                onMouseEnter={() => setHoveredZone('HEAD')}
                onMouseLeave={() => setHoveredZone(null)}
              />

              {/* Neck */}
              <rect
                x="94"
                y="64"
                width="12"
                height="10"
                className="fill-slate-200 dark:fill-slate-800"
              />

              {/* Chest / Thorax / Cardiac Region */}
              <path
                d="M 65 74 L 135 74 L 128 140 L 72 140 Z"
                className={`cursor-pointer transition-all ${
                  activeZone === 'CHEST'
                    ? 'fill-sky-500 stroke-sky-600'
                    : hoveredZone === 'CHEST'
                    ? 'fill-sky-400/80 stroke-sky-400'
                    : 'fill-slate-200 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-700'
                }`}
                strokeWidth="2"
                onClick={() => handleZoneClick('CHEST')}
                onMouseEnter={() => setHoveredZone('CHEST')}
                onMouseLeave={() => setHoveredZone(null)}
              />

              {/* Abdomen / Visceral Region */}
              <path
                d="M 72 142 L 128 142 L 122 195 L 78 195 Z"
                className={`cursor-pointer transition-all ${
                  activeZone === 'ABDOMEN'
                    ? 'fill-amber-500 stroke-amber-600'
                    : hoveredZone === 'ABDOMEN'
                    ? 'fill-amber-400/80 stroke-amber-400'
                    : 'fill-slate-200 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-700'
                }`}
                strokeWidth="2"
                onClick={() => handleZoneClick('ABDOMEN')}
                onMouseEnter={() => setHoveredZone('ABDOMEN')}
                onMouseLeave={() => setHoveredZone(null)}
              />

              {/* Limbs / Arms */}
              <path
                d="M 62 76 L 42 150 L 52 153 L 70 85 Z"
                className={`cursor-pointer transition-all ${
                  activeZone === 'LIMBS'
                    ? 'fill-teal-500 stroke-teal-600'
                    : hoveredZone === 'LIMBS'
                    ? 'fill-teal-400/80'
                    : 'fill-slate-200 dark:fill-slate-800'
                }`}
                onClick={() => handleZoneClick('LIMBS')}
                onMouseEnter={() => setHoveredZone('LIMBS')}
                onMouseLeave={() => setHoveredZone(null)}
              />
              <path
                d="M 138 76 L 158 150 L 148 153 L 130 85 Z"
                className={`cursor-pointer transition-all ${
                  activeZone === 'LIMBS'
                    ? 'fill-teal-500 stroke-teal-600'
                    : hoveredZone === 'LIMBS'
                    ? 'fill-teal-400/80'
                    : 'fill-slate-200 dark:fill-slate-800'
                }`}
                onClick={() => handleZoneClick('LIMBS')}
                onMouseEnter={() => setHoveredZone('LIMBS')}
                onMouseLeave={() => setHoveredZone(null)}
              />

              {/* Legs / Lower Extremities */}
              <path
                d="M 80 197 L 70 295 L 86 295 L 96 197 Z"
                className={`cursor-pointer transition-all ${
                  activeZone === 'LIMBS'
                    ? 'fill-teal-500 stroke-teal-600'
                    : hoveredZone === 'LIMBS'
                    ? 'fill-teal-400/80'
                    : 'fill-slate-200 dark:fill-slate-800'
                }`}
                onClick={() => handleZoneClick('LIMBS')}
                onMouseEnter={() => setHoveredZone('LIMBS')}
                onMouseLeave={() => setHoveredZone(null)}
              />
              <path
                d="M 104 197 L 114 295 L 130 295 L 120 197 Z"
                className={`cursor-pointer transition-all ${
                  activeZone === 'LIMBS'
                    ? 'fill-teal-500 stroke-teal-600'
                    : hoveredZone === 'LIMBS'
                    ? 'fill-teal-400/80'
                    : 'fill-slate-200 dark:fill-slate-800'
                }`}
                onClick={() => handleZoneClick('LIMBS')}
                onMouseEnter={() => setHoveredZone('LIMBS')}
                onMouseLeave={() => setHoveredZone(null)}
              />

              {/* Spine Indicator (Vertical dotted line) */}
              <line
                x1="100"
                y1="75"
                x2="100"
                y2="190"
                stroke={activeZone === 'SPINE' ? '#8b5cf6' : '#94a3b8'}
                strokeWidth={activeZone === 'SPINE' ? '4' : '2'}
                strokeDasharray="4 2"
                className="cursor-pointer"
                onClick={() => handleZoneClick('SPINE')}
                onMouseEnter={() => setHoveredZone('SPINE')}
                onMouseLeave={() => setHoveredZone(null)}
              />
            </g>
          </svg>

          <div className="absolute top-2 right-2 text-[10px] text-slate-400 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 font-mono">
            {hoveredZone || activeZone}
          </div>
        </div>

        {/* Anatomical Specialty Selector Pills */}
        <div className="space-y-2">
          {[
            {
              id: 'CHEST',
              name: 'Cardiac & Pulmonary',
              icon: '🫀',
              desc: 'Chest pain, ECG review, arrhythmia',
              color: 'sky',
            },
            {
              id: 'HEAD',
              name: 'Cranial & Neurological',
              icon: '🧠',
              desc: 'Migraines, vertigo, ENT, concussion',
              color: 'rose',
            },
            {
              id: 'ABDOMEN',
              name: 'Gastroenterology',
              icon: '🫄',
              desc: 'Abdominal pain, gastritis, hepatic',
              color: 'amber',
            },
            {
              id: 'SPINE',
              name: 'Spinal & Neuromuscular',
              icon: '🦴',
              desc: 'Lumbar discs, sciatica, posture',
              color: 'purple',
            },
            {
              id: 'LIMBS',
              name: 'Orthopedic Extremities',
              icon: '🦵',
              desc: 'Knee sprains, fractures, edema',
              color: 'teal',
            },
          ].map((item) => {
            const isSelected = activeZone === item.id;
            const count = (zoneCounts as any)[item.id] || 0;
            return (
              <button
                key={item.id}
                onClick={() => handleZoneClick(item.id as BodyZone)}
                className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/50 shadow-xs'
                    : 'border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{item.icon}</span>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">
                      {item.name}
                    </div>
                    <div className="text-[10px] text-slate-400">{item.desc}</div>
                  </div>
                </div>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full font-mono ${
                    isSelected
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
