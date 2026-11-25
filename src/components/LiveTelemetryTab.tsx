import React, { useState, useEffect, useRef } from 'react';
import { BiometricReading, SimulationPhase, TelemetryLogEntry, IontoDeviceType, IontoSessionState } from '../types/biometrics';
import { PYTHON_BLE_CODE } from '../data/bandConstants';
import { Activity, Heart, Zap, Terminal, Sliders, Play, Pause, Copy, Check, ShieldAlert, Sparkles, RefreshCw, Radio, Droplets, Info } from 'lucide-react';

interface LiveTelemetryTabProps {
  reading: BiometricReading;
  phase: SimulationPhase;
  onSetPhase: (phase: SimulationPhase) => void;
  edaThreshold: number;
  onSetEdaThreshold: (val: number) => void;
  hrThreshold: number;
  onSetHrThreshold: (val: number) => void;
  logs: TelemetryLogEntry[];
  onTriggerTestSpike: () => void;
  iontoSession: IontoSessionState;
  onUpdateIontoSession: (updater: (prev: IontoSessionState) => IontoSessionState) => void;
  onToggleIontoActive: (device?: IontoDeviceType) => void;
}

export const LiveTelemetryTab: React.FC<LiveTelemetryTabProps> = ({
  reading,
  phase,
  onSetPhase,
  edaThreshold,
  onSetEdaThreshold,
  hrThreshold,
  onSetHrThreshold,
  logs,
  onTriggerTestSpike,
  iontoSession,
  onUpdateIontoSession,
  onToggleIontoActive,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [showPythonDrawer, setShowPythonDrawer] = useState(false);

  // Canvases for ECG and EDA waveforms
  const ecgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const edaCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const ecgHistoryRef = useRef<number[]>([]);
  const edaHistoryRef = useRef<number[]>([]);

  // Initialize and run real-time ECG / EDA waveform rendering
  useEffect(() => {
    if (ecgHistoryRef.current.length === 0) {
      ecgHistoryRef.current = new Array(120).fill(0);
    }
    if (edaHistoryRef.current.length === 0) {
      edaHistoryRef.current = new Array(120).fill(reading.edaConductance);
    }

    let animId: number;
    let tick = 0;

    const renderWaveforms = () => {
      animId = requestAnimationFrame(renderWaveforms);
      tick++;

      // 1. ECG Canvas update
      const ecgCanvas = ecgCanvasRef.current;
      if (ecgCanvas) {
        const ctx = ecgCanvas.getContext('2d');
        if (ctx) {
          const w = ecgCanvas.width;
          const h = ecgCanvas.height;

          const period = Math.max(15, Math.round(3600 / reading.heartRate));
          const phaseInPeriod = tick % period;
          let val = 0;

          if (phaseInPeriod === Math.floor(period * 0.15)) val = 0.2;
          else if (phaseInPeriod === Math.floor(period * 0.22)) val = -0.3;
          else if (phaseInPeriod === Math.floor(period * 0.25)) val = 1.0;
          else if (phaseInPeriod === Math.floor(period * 0.28)) val = -0.45;
          else if (phaseInPeriod === Math.floor(period * 0.42)) val = 0.28;
          else val = (Math.random() - 0.5) * 0.05;

          ecgHistoryRef.current.push(val);
          if (ecgHistoryRef.current.length > 120) {
            ecgHistoryRef.current.shift();
          }

          ctx.fillStyle = '#060a12';
          ctx.fillRect(0, 0, w, h);

          // Grid lines
          ctx.strokeStyle = 'rgba(14, 165, 233, 0.08)';
          ctx.lineWidth = 1;
          for (let x = 0; x < w; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
          }
          for (let y = 0; y < h; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
          }

          ctx.strokeStyle = reading.surgeLevel === 'critical' ? '#EF4444' : '#0EA5E9';
          ctx.lineWidth = 2;
          ctx.shadowColor = reading.surgeLevel === 'critical' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(14, 165, 233, 0.5)';
          ctx.shadowBlur = 6;
          ctx.beginPath();

          const step = w / 119;
          const midY = h / 2;

          ecgHistoryRef.current.forEach((v, idx) => {
            const px = idx * step;
            const py = midY - v * (h * 0.4);
            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }

      // 2. EDA Canvas update
      const edaCanvas = edaCanvasRef.current;
      if (edaCanvas && tick % 2 === 0) {
        const ctx = edaCanvas.getContext('2d');
        if (ctx) {
          const w = edaCanvas.width;
          const h = edaCanvas.height;

          const microJitter = (Math.random() - 0.5) * 0.04;
          edaHistoryRef.current.push(reading.edaConductance + microJitter);
          if (edaHistoryRef.current.length > 120) {
            edaHistoryRef.current.shift();
          }

          ctx.fillStyle = '#060a12';
          ctx.fillRect(0, 0, w, h);

          ctx.strokeStyle = 'rgba(20, 184, 166, 0.08)';
          ctx.lineWidth = 1;
          for (let y = 0; y < h; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
          }

          const thresholdY = h - (edaThreshold / 18.0) * (h * 0.85);
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(0, thresholdY);
          ctx.lineTo(w, thresholdY);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.font = '10px monospace';
          ctx.fillStyle = '#F59E0B';
          ctx.fillText(`IONTO TRIGGER THRESHOLD: ${edaThreshold.toFixed(1)} μS`, 8, thresholdY - 4);

          ctx.strokeStyle = reading.edaConductance >= edaThreshold ? '#F59E0B' : '#14B8A6';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = 'rgba(20, 184, 166, 0.6)';
          ctx.shadowBlur = 8;
          ctx.beginPath();

          const step = w / 119;
          edaHistoryRef.current.forEach((val, idx) => {
            const px = idx * step;
            const py = h - (val / 18.0) * (h * 0.85);
            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }
    };

    renderWaveforms();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [reading, edaThreshold]);

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(PYTHON_BLE_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const elapsedMin = Math.floor(iontoSession.elapsedSeconds / 60);
  const elapsedSec = iontoSession.elapsedSeconds % 60;
  const totalSec = iontoSession.sessionLengthMinutes * 60;
  const progressPct = Math.min(100, Math.round((iontoSession.elapsedSeconds / totalSec) * 100));

  return (
    <div className="space-y-6 text-slate-300">
      {/* 3-Phase Interactive Simulator Phase Switcher */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-teal-400 uppercase tracking-wider">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>3-Phase Sudomotor Episode Simulator</span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              Select Physiological State & Trigger Warning Cascade
            </h3>
          </div>
          <button
            onClick={onTriggerTestSpike}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulate Quick Surge Spike</span>
          </button>
        </div>

        {/* 3 Phase Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Phase 1: Resting */}
          <button
            onClick={() => onSetPhase('resting')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              phase === 'resting'
                ? 'bg-teal-950/40 border-teal-500 text-white ring-1 ring-teal-400'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-teal-400 font-bold">
                Phase 1
              </span>
              {phase === 'resting' && <span className="w-2 h-2 rounded-full bg-teal-400" />}
            </div>
            <div className="font-bold text-slate-100 text-sm mt-1">Resting Baseline</div>
            <div className="font-mono text-xs text-slate-300 mt-1">72 BPM · 2.1 μS</div>
            <div className="text-[11px] text-slate-400 mt-1">Normal sympathetic baseline. No alerts.</div>
          </button>

          {/* Phase 2: Pre-Sweat Surge */}
          <button
            onClick={() => onSetPhase('pre_surge')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
              phase === 'pre_surge'
                ? 'bg-amber-950/40 border-amber-500 text-white ring-2 ring-amber-400'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            {phase === 'pre_surge' && (
              <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                Phase 2 · Surge
              </span>
              {phase === 'pre_surge' && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
            </div>
            <div className="font-bold text-amber-300 text-sm mt-1">Pre-Sweat Surge</div>
            <div className="font-mono text-xs text-amber-200 mt-1">94 BPM · 8.4 μS</div>
            <div className="text-[11px] text-amber-400/90 mt-1">PRE-EPISODE WARNING: Band haptic + HidroAlly Iontophoresis alert.</div>
          </button>

          {/* Phase 3: Active Sweating */}
          <button
            onClick={() => onSetPhase('active_sweating')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              phase === 'active_sweating'
                ? 'bg-rose-950/40 border-rose-500 text-white ring-1 ring-rose-400'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold">
                Phase 3 · Active
              </span>
              {phase === 'active_sweating' && <span className="w-2 h-2 rounded-full bg-rose-400" />}
            </div>
            <div className="font-bold text-slate-100 text-sm mt-1">Active Sweating</div>
            <div className="font-mono text-xs text-rose-300 mt-1">108 BPM · 14.2 μS</div>
            <div className="text-[11px] text-slate-400 mt-1">Visible perspiration episode on skin surface.</div>
          </button>
        </div>
      </div>

      {/* Primary Readouts Cockpit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Heart Rate */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>HEART RATE</span>
            <Heart className={`w-4 h-4 ${reading.surgeLevel === 'critical' ? 'text-red-500 animate-ping' : 'text-rose-400'}`} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-mono font-bold text-white tabular-nums">
              {reading.heartRate}
            </span>
            <span className="text-xs font-mono text-slate-400">BPM</span>
          </div>
          <div className="mt-1 text-xs text-slate-400 font-mono">
            HRV RMSSD: <span className="text-teal-400 font-semibold">{reading.hrvRmssd} ms</span>
          </div>
        </div>

        {/* EDA Conductance */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>VENTRAL EDA</span>
            <Zap className="w-4 h-4 text-teal-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-mono font-bold text-white tabular-nums">
              {reading.edaConductance.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-slate-400">μS</span>
          </div>
          <div className="mt-1 text-xs text-slate-400 font-mono">
            Tonic Baseline: <span className="text-slate-300">2.0 μS</span> · <span className={reading.edaConductance > edaThreshold ? 'text-amber-400 font-bold' : 'text-teal-400'}>Δ +{(reading.edaConductance - 2.0).toFixed(1)} μS</span>
          </div>
        </div>

        {/* Skin Temperature */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>SKIN TEMP</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-mono font-bold text-white tabular-nums">
              {reading.skinTemperature.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-slate-400">°C</span>
          </div>
          <div className="mt-1 text-xs text-slate-400 font-mono">
            Differential: <span className="text-slate-300">Sudomotor Outflow</span>
          </div>
        </div>

        {/* Surge Risk Status */}
        <div className={`p-4 rounded-2xl border ${
          reading.surgeLevel === 'critical'
            ? 'bg-rose-950/40 border-rose-500/60 text-rose-200'
            : reading.surgeLevel === 'elevated'
            ? 'bg-amber-950/30 border-amber-500/50 text-amber-200'
            : 'bg-teal-950/20 border-teal-500/40 text-teal-200'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono">
            <span>SURGE CLASSIFICATION</span>
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="mt-2 text-xl font-bold tracking-tight">
            {reading.surgeLevel === 'critical'
              ? 'SPIKE WARNING'
              : reading.surgeLevel === 'elevated'
              ? 'ELEVATED SURGE'
              : 'BASELINE NOMINAL'}
          </div>
          <div className="mt-1 text-xs opacity-90 font-mono">
            {reading.surgeLevel === 'critical'
              ? 'Iontophoresis session prompt dispatched'
              : 'Autonomic tone stable'}
          </div>
        </div>
      </div>

      {/* Puter-Style Iontophoresis Session Simulator Cockpit */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/30 border border-teal-500/30 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-teal-400 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Targeted Iontophoresis Device Ecosystem (Puter Architecture)</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Portable Tap-Water Iontophoresis Session Controller
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold ${
              iontoSession.isActive
                ? 'bg-teal-400 text-slate-950 animate-pulse'
                : 'bg-slate-800 text-slate-400'
            }`}>
              {iontoSession.isActive ? `Session · ${iontoSession.currentDeliveredMa.toFixed(1)} mA` : 'Idle'}
            </span>
          </div>
        </div>

        {/* Device Switcher (HydroGlove, HydroVisage, HydroSock) */}
        <div>
          <div className="text-xs text-slate-400 font-mono mb-2">Connected Treatment Device:</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={() => onUpdateIontoSession(prev => ({ ...prev, device: 'HydroGlove' }))}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                iontoSession.device === 'HydroGlove'
                  ? 'bg-teal-500/15 border-teal-400 text-white shadow-sm'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-sm">
                <span>HydroGlove</span>
                <span className="text-[10px] font-mono text-teal-400">Palmar</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Wet palm & fingertip hydrogel pads (L4)</div>
            </button>

            <button
              onClick={() => onUpdateIontoSession(prev => ({ ...prev, device: 'HydroVisage' }))}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                iontoSession.device === 'HydroVisage'
                  ? 'bg-teal-500/15 border-teal-400 text-white shadow-sm'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-sm">
                <span>HydroVisage</span>
                <span className="text-[10px] font-mono text-teal-400">Craniofacial</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Targeted forehead & perioral face mask</div>
            </button>

            <button
              onClick={() => onUpdateIontoSession(prev => ({ ...prev, device: 'HydroSock' }))}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                iontoSession.device === 'HydroSock'
                  ? 'bg-teal-500/15 border-teal-400 text-white shadow-sm'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-sm">
                <span>HydroSock</span>
                <span className="text-[10px] font-mono text-teal-400">Plantar</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Sole & toe contact conductive knit sock</div>
            </button>
          </div>
        </div>

        {/* Live Treating HUD Box (Identical to Puter Design) */}
        <div className="p-4 bg-[#050912] border border-slate-800 rounded-xl space-y-3 font-mono">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${iontoSession.isActive ? 'bg-teal-400 animate-pulse' : 'bg-slate-600'}`} />
              <span>{iontoSession.isActive ? 'Treating' : 'Ready'}</span>
            </span>
            <span>This {iontoSession.device} (+) · Pair (-)</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white tracking-tight">
              {iontoSession.isActive ? iontoSession.currentDeliveredMa.toFixed(1) : '0.0'}
            </span>
            <span className="text-sm text-teal-400">mA</span>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>{elapsedMin}:{elapsedSec.toString().padStart(2, '0')}</span>
              <span>{iontoSession.sessionLengthMinutes}:00</span>
            </div>
          </div>
        </div>

        {/* Controls: Target Current, Session Length, Pad Wetness */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
          {/* Target Current Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-mono">
              <span className="text-slate-300">Target Current:</span>
              <span className="text-teal-400 font-bold">{iontoSession.targetCurrentMa} mA</span>
            </div>
            <input
              type="range"
              min="8"
              max="20"
              step="1"
              value={iontoSession.targetCurrentMa}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                onUpdateIontoSession(prev => ({
                  ...prev,
                  targetCurrentMa: val,
                  currentDeliveredMa: prev.isActive ? val : prev.currentDeliveredMa,
                }));
              }}
              className="w-full accent-teal-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>8 mA (Mild)</span>
              <span>20 mA (Clinical)</span>
            </div>
          </div>

          {/* Session Length Segmented Selector */}
          <div className="space-y-1.5">
            <div className="font-mono text-slate-300">Session Length:</div>
            <div className="grid grid-cols-4 gap-1">
              {[10, 15, 20, 25].map((len) => (
                <button
                  key={len}
                  onClick={() => onUpdateIontoSession(prev => ({ ...prev, sessionLengthMinutes: len }))}
                  className={`py-1.5 rounded-lg font-mono text-center transition-all cursor-pointer ${
                    iontoSession.sessionLengthMinutes === len
                      ? 'bg-slate-800 text-teal-300 font-bold border border-teal-500/40'
                      : 'bg-slate-950/80 text-slate-400 hover:text-white'
                  }`}
                >
                  {len}m
                </button>
              ))}
            </div>
          </div>

          {/* Pad Wetness Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-mono">
              <span className="text-slate-300">Pad Wetness (Contact):</span>
              <span className="text-teal-400 font-bold">{iontoSession.padWetnessPct}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={iontoSession.padWetnessPct}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                onUpdateIontoSession(prev => ({ ...prev, padWetnessPct: val }));
              }}
              className="w-full accent-teal-400 cursor-pointer"
            />
            <div className="text-[10px] text-slate-500 font-mono">
              {iontoSession.padWetnessPct < 40
                ? '⚠️ Under 40%: controller pauses to prevent hot spots.'
                : 'Optimal contact impedance (<500 Ω).'}
            </div>
          </div>
        </div>

        {/* Action Button: Start / Pause Session */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => onToggleIontoActive()}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs transition-all shadow-lg cursor-pointer ${
              iontoSession.isActive
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-teal-500/20'
            }`}
          >
            {iontoSession.isActive ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause {iontoSession.device} Iontophoresis Session</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start {iontoSession.device} Iontophoresis Session ({iontoSession.targetCurrentMa} mA)</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              onUpdateIontoSession(prev => ({
                ...prev,
                isActive: false,
                elapsedSeconds: 0,
                currentDeliveredMa: 0,
              }));
            }}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
            title="Reset Session Progress"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Clinical Note Card explaining WHY Iontophoresis instead of Peltier Cooling */}
        <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs space-y-2">
          <div className="flex items-center gap-2 font-semibold text-teal-300">
            <Info className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Why Iontophoresis Replaced Peltier Cooling</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            <strong className="text-slate-200">The Peltier Cooling Limitation:</strong> Thermoelectric cooling only temporarily cools the skin while running, consumes excessive battery power (2–6 W), causes cold-side condensation, and fails to alter eccrine sweat gland pathology—once removed, sweating resumes immediately.<br />
            <strong className="text-teal-300">The Iontophoresis Solution:</strong> By pairing the Giftovate Band's 3-minute pre-sweat warning with portable wet-pad devices (HydroGlove for hands, HydroVisage for face, HydroSock for feet), a mild 8–20 mA current delivers minerals into sweat ducts, creating an ionic plug that safely blocks hyperhidrosis for days.
          </p>
        </div>
      </div>

      {/* Dual Waveform Canvases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ECG / PPG Waveform */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>OPTICAL PPG PULSE WAVE (32 HZ)</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Arterial Pulse</span>
          </div>
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#060A12]">
            <canvas ref={ecgCanvasRef} width={480} height={130} className="w-full h-[130px]" />
          </div>
        </div>

        {/* EDA Waveform */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>VENTRAL SKIN CONDUCTANCE (EDA μS)</span>
            </div>
            <span className="text-[11px] font-mono text-amber-400">Threshold: {edaThreshold.toFixed(1)} μS</span>
          </div>
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#060A12]">
            <canvas ref={edaCanvasRef} width={480} height={130} className="w-full h-[130px]" />
          </div>
        </div>
      </div>

      {/* Interactive Threshold Sliders */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-teal-400 uppercase tracking-wider">
          <Sliders className="w-3.5 h-3.5" />
          <span>Configurable Alert Thresholds</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          {/* EDA Threshold */}
          <div className="space-y-2">
            <div className="flex justify-between font-mono">
              <span className="text-slate-300">Target EDA Alert Sensitivity:</span>
              <span className="text-teal-400 font-bold">{edaThreshold.toFixed(1)} μS</span>
            </div>
            <input
              type="range"
              min="3.0"
              max="12.0"
              step="0.5"
              value={edaThreshold}
              onChange={(e) => onSetEdaThreshold(parseFloat(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>3.0 μS (Ultra-sensitive)</span>
              <span>12.0 μS (Extreme sweat only)</span>
            </div>
          </div>

          {/* Heart Rate Threshold */}
          <div className="space-y-2">
            <div className="flex justify-between font-mono">
              <span className="text-slate-300">Tachycardia Correlation Threshold:</span>
              <span className="text-rose-400 font-bold">{hrThreshold} BPM</span>
            </div>
            <input
              type="range"
              min="80"
              max="130"
              step="5"
              value={hrThreshold}
              onChange={(e) => onSetHrThreshold(parseInt(e.target.value, 10))}
              className="w-full accent-rose-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>80 BPM</span>
              <span>130 BPM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Event Log */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-teal-400" />
            <span>LIVE TELEMETRY EVENT STREAM</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Auto-scrolling FIFO</span>
        </div>

        <div className="h-36 overflow-y-auto font-mono text-xs space-y-1.5 p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
          {logs.length === 0 ? (
            <div className="text-slate-500">Awaiting incoming telemetry packets...</div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex items-start gap-2">
                <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                <span className={`shrink-0 font-bold uppercase text-[10px] px-1.5 py-0.2 rounded ${
                  log.type === 'alert'
                    ? 'bg-rose-500/20 text-rose-400'
                    : log.type === 'warning'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-teal-500/20 text-teal-300'
                }`}>
                  {log.type}
                </span>
                <span className="text-slate-300">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Python Code Integration Drawer Toggle */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-sm font-bold text-white">Python Backend & BLE Driver Integration</div>
              <div className="text-xs text-slate-400">Asyncio Bleak client script for streaming telemetry to HidroAlly API</div>
            </div>
          </div>
          <button
            onClick={() => setShowPythonDrawer(!showPythonDrawer)}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer"
          >
            {showPythonDrawer ? 'Hide Code Drawer' : 'Inspect ble_eda_monitor.py'}
          </button>
        </div>

        {showPythonDrawer && (
          <div className="mt-4 relative animate-fade-in">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-t border-l border-r border-slate-800 rounded-t-xl text-xs font-mono text-slate-400">
              <span>ble_eda_monitor.py · Python 3.10+</span>
              <button
                onClick={copyCodeToClipboard}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied!' : 'Copy Script'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-b-xl overflow-x-auto text-xs font-mono text-emerald-400 leading-relaxed max-h-80">
              <code>{PYTHON_BLE_CODE}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
