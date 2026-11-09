'use client';

import React from 'react';
import { Vitals } from '@/lib/types';
import { medicalAudio } from '@/lib/sound/medical-audio';

interface VitalsHudProps {
  vitals: Vitals;
  onChange: (vitals: Vitals) => void;
  readOnly?: boolean;
}

export function VitalsHud({ vitals, onChange, readOnly = false }: VitalsHudProps) {
  const [systolicStr, diastolicStr] = (vitals.bloodPressure || '120/80').split('/');
  const systolic = parseInt(systolicStr) || 120;
  const diastolic = parseInt(diastolicStr) || 80;

  const handleSystolicChange = (newSys: number) => {
    medicalAudio.playTactileClick();
    onChange({
      ...vitals,
      bloodPressure: `${newSys}/${diastolic}`,
    });
  };

  const handleDiastolicChange = (newDia: number) => {
    medicalAudio.playTactileClick();
    onChange({
      ...vitals,
      bloodPressure: `${systolic}/${newDia}`,
    });
  };

  const handleHrChange = (newHr: number) => {
    medicalAudio.playTactileClick();
    onChange({
      ...vitals,
      heartRate: newHr,
    });
  };

  const handleTempChange = (newTemp: number) => {
    medicalAudio.playTactileClick();
    onChange({
      ...vitals,
      temperature: Math.round(newTemp * 10) / 10,
    });
  };

  const handleSpo2Change = (newSpo2: number) => {
    medicalAudio.playTactileClick();
    onChange({
      ...vitals,
      spo2: newSpo2,
    });
  };

  // Determine Blood Pressure Category
  let bpCategory = { label: 'Optimal', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60' };
  if (systolic >= 140 || diastolic >= 90) {
    bpCategory = { label: 'Stage 1 Hypertension', color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60' };
  } else if (systolic >= 120 || diastolic >= 80) {
    bpCategory = { label: 'Prehypertension', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60' };
  }

  // Determine SpO2 Category
  let spo2Status = { label: 'Normal Oxygenation', color: 'text-sky-600' };
  if (vitals.spo2 < 92) {
    spo2Status = { label: 'Hypoxemia Alert', color: 'text-rose-600' };
  } else if (vitals.spo2 < 95) {
    spo2Status = { label: 'Borderline Oxygenation', color: 'text-amber-600' };
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-600 text-sm">
            🩺
          </span>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Precision Biometric Telemetry HUD
            </h4>
            <p className="text-[10px] text-slate-400">Direct sensory dials with dynamic safety thresholds</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
          ISO 80601-2-61
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Dial 1: Blood Pressure Dual Gauge */}
        <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Blood Pressure</span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${bpCategory.color}`}>
              {bpCategory.label}
            </span>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              {systolic}
            </span>
            <span className="text-sm font-semibold text-slate-400">/</span>
            <span className="text-xl font-bold font-mono text-slate-700 dark:text-slate-300">
              {diastolic}
            </span>
            <span className="text-[10px] text-slate-400 ml-1">mmHg</span>
          </div>

          {!readOnly && (
            <div className="space-y-2 pt-1">
              <div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Systolic (90 - 180)</span>
                  <span className="font-mono">{systolic}</span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="180"
                  value={systolic}
                  onChange={(e) => handleSystolicChange(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Diastolic (50 - 110)</span>
                  <span className="font-mono">{diastolic}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="110"
                  value={diastolic}
                  onChange={(e) => handleDiastolicChange(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
              </div>
            </div>
          )}
        </div>

        {/* Dial 2: Heart Rate Pulse */}
        <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Heart Rate</span>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-rose-600">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
              Cardiac Cycle
            </span>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
              {vitals.heartRate}
            </span>
            <span className="text-[10px] text-slate-400 ml-1">BPM</span>
          </div>

          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 transition-all duration-300"
              style={{ width: `${Math.min(100, (vitals.heartRate / 140) * 100)}%` }}
            />
          </div>

          {!readOnly && (
            <div className="pt-1">
              <input
                type="range"
                min="45"
                max="160"
                value={vitals.heartRate}
                onChange={(e) => handleHrChange(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-600"
              />
              <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-mono">
                <span>Bradycardia (&lt;60)</span>
                <span>Normal (60-100)</span>
                <span>Tachy (&gt;100)</span>
              </div>
            </div>
          )}
        </div>

        {/* Dial 3: SpO2 Blood Oxygen */}
        <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Oxygen Saturation</span>
            <span className={`text-[10px] font-semibold ${spo2Status.color}`}>
              {vitals.spo2 >= 95 ? '✓ 95-100%' : '⚠️ Suboptimal'}
            </span>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-sky-600 dark:text-sky-400">
              {vitals.spo2}
            </span>
            <span className="text-[10px] text-slate-400 ml-1">% SpO2</span>
          </div>

          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                vitals.spo2 >= 95 ? 'bg-sky-500' : 'bg-rose-500'
              }`}
              style={{ width: `${vitals.spo2}%` }}
            />
          </div>

          {!readOnly && (
            <div className="pt-1">
              <input
                type="range"
                min="85"
                max="100"
                value={vitals.spo2}
                onChange={(e) => handleSpo2Change(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>
          )}
        </div>

        {/* Dial 4: Temperature & BMI */}
        <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Thermal & BMI</span>
            <span className="text-[10px] font-semibold text-emerald-600">
              {vitals.temperature >= 38 ? '🌡️ Febrile' : 'Normothermic'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {vitals.temperature}
              </span>
              <span className="text-[10px] text-slate-400 ml-0.5">°C</span>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold font-mono text-teal-600 dark:text-teal-400">
                {vitals.bmi}
              </span>
              <span className="text-[10px] text-slate-400 ml-0.5">BMI</span>
            </div>
          </div>

          {!readOnly && (
            <div className="pt-1">
              <input
                type="range"
                min="350"
                max="410"
                value={Math.round(vitals.temperature * 10)}
                onChange={(e) => handleTempChange(Number(e.target.value) / 10)}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-mono">
                <span>36.0°C</span>
                <span>Normal: 36.5-37.5°C</span>
                <span>40.0°C</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
