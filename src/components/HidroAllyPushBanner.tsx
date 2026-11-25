import React, { useState } from 'react';
import { ShieldAlert, Sparkles, X, CheckCircle2, Zap } from 'lucide-react';
import { IontoDeviceType, IontoSessionState } from '../types/biometrics';

interface HidroAllyPushBannerProps {
  isVisible: boolean;
  eda: number;
  heartRate: number;
  onDismiss: () => void;
  onStartIontoSession: (device: IontoDeviceType) => void;
  iontoSession: IontoSessionState;
}

export const HidroAllyPushBanner: React.FC<HidroAllyPushBannerProps> = ({
  isVisible,
  eda,
  heartRate,
  onDismiss,
  onStartIontoSession,
  iontoSession,
}) => {
  const [selectedDevice, setSelectedDevice] = useState<IontoDeviceType>('HydroGlove');

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 sm:right-6 z-50 max-w-md w-full mx-auto animate-bounce-short">
      <div className="relative p-4 bg-slate-900/95 border-2 border-amber-500/80 rounded-2xl shadow-2xl backdrop-blur-xl text-slate-100 overflow-hidden">
        {/* Glowing top line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-teal-400 animate-pulse" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-700 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xs font-mono">HA</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                <span>HidroAlly Companion</span>
                <span className="text-slate-500 font-normal">·</span>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">BLE Push Alert</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">Sympathetic Sudomotor Outflow</div>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Alert Body */}
        <div className="mt-3">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
            <ShieldAlert className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
            <span>⚠️ Sudomotor Surge Detected!</span>
          </div>
          <p className="mt-1 text-xs text-slate-300 leading-relaxed">
            Ventral EDA surged to <span className="font-mono font-bold text-white">{eda.toFixed(1)} μS</span> at <span className="font-mono font-bold text-white">{heartRate} BPM</span>. Eccrine gland sweat rupture estimated in <span className="font-semibold text-teal-300">~180 seconds</span>.
          </p>
        </div>

        {/* Target Device Selector */}
        {!iontoSession.isActive && (
          <div className="mt-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Select Target Iontophoresis Device:</span>
              <span className="text-teal-400">Tap-Water Anhidrosis</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-medium">
              <button
                type="button"
                onClick={() => setSelectedDevice('HydroGlove')}
                className={`py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                  selectedDevice === 'HydroGlove'
                    ? 'bg-teal-500/20 border-teal-400 text-teal-300 font-bold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-[11px]">HydroGlove</div>
                <div className="text-[9px] font-mono text-slate-400">Palmar / Hands</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDevice('HydroVisage')}
                className={`py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                  selectedDevice === 'HydroVisage'
                    ? 'bg-teal-500/20 border-teal-400 text-teal-300 font-bold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-[11px]">HydroVisage</div>
                <div className="text-[9px] font-mono text-slate-400">Facial Mask</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDevice('HydroSock')}
                className={`py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                  selectedDevice === 'HydroSock'
                    ? 'bg-teal-500/20 border-teal-400 text-teal-300 font-bold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-[11px]">HydroSock</div>
                <div className="text-[9px] font-mono text-slate-400">Plantar / Feet</div>
              </button>
            </div>
          </div>
        )}

        {/* Active Session Status or Action Buttons */}
        <div className="mt-3.5 flex items-center gap-2">
          {iontoSession.isActive ? (
            <div className="flex-1 flex items-center justify-between py-2 px-3 bg-teal-500/20 border border-teal-500/50 rounded-xl text-xs font-semibold text-teal-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 animate-spin" />
                <span>
                  {iontoSession.device} Active: {iontoSession.currentDeliveredMa.toFixed(1)} mA
                </span>
              </div>
              <span className="text-[10px] font-mono text-teal-400">
                {Math.floor(iontoSession.elapsedSeconds / 60)}:{(iontoSession.elapsedSeconds % 60).toString().padStart(2, '0')}
              </span>
            </div>
          ) : (
            <button
              onClick={() => onStartIontoSession(selectedDevice)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-teal-500/25 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Activate {selectedDevice} Session</span>
            </button>
          )}

          <button
            onClick={onDismiss}
            className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors cursor-pointer"
          >
            Snooze
          </button>
        </div>
      </div>
    </div>
  );
};
