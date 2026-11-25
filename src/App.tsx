import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BandViewer3D } from './components/BandViewer3D';
import { Header } from './components/Header';
import { BiometricsTab } from './components/BiometricsTab';
import { DesignPartsTab } from './components/DesignPartsTab';
import { LiveTelemetryTab } from './components/LiveTelemetryTab';
import { HotspotInspectorModal } from './components/HotspotInspectorModal';
import { HidroAllyPushBanner } from './components/HidroAllyPushBanner';
import { InvestorShowcaseModal } from './components/InvestorShowcaseModal';
import { HOTSPOTS_DATA } from './data/bandConstants';
import { BiometricReading, SimulationPhase, HotspotData, TelemetryLogEntry, IontoDeviceType, IontoSessionState } from './types/biometrics';
import { Activity, Layers, Radio, Sparkles } from 'lucide-react';

export default function App() {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'biometrics' | 'design' | 'telemetry'>('telemetry');

  // Investor Kit modal state
  const [isInvestorModalOpen, setIsInvestorModalOpen] = useState<boolean>(false);

  // 3D Viewport Controls State
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotData | null>(null);
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [isXRay, setIsXRay] = useState<boolean>(false);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  // Simulation State
  const [phase, setPhase] = useState<SimulationPhase>('resting');
  const [edaThreshold, setEdaThreshold] = useState<number>(6.0);
  const [hrThreshold, setHrThreshold] = useState<number>(95);

  // Interactive Push Alert Banner state
  const [isPushBannerVisible, setIsPushBannerVisible] = useState<boolean>(false);

  // Iontophoresis Session State (Matching Puter Portable Architecture)
  const [iontoSession, setIontoSession] = useState<IontoSessionState>({
    isActive: false,
    device: 'HydroGlove',
    targetCurrentMa: 12,
    currentDeliveredMa: 0,
    sessionLengthMinutes: 20,
    elapsedSeconds: 0,
    padWetnessPct: 85,
    polarity: 'positive',
  });

  // Current Biometric Reading State
  const [reading, setReading] = useState<BiometricReading>({
    timestamp: Date.now(),
    heartRate: 72,
    edaConductance: 2.1,
    skinTemperature: 33.8,
    hrvRmssd: 58,
    phasicPeak: false,
    surgeLevel: 'normal',
  });

  // Telemetry Event Log
  const [logs, setLogs] = useState<TelemetryLogEntry[]>([
    {
      id: 'log-0',
      timestamp: new Date().toLocaleTimeString(),
      type: 'ble',
      message: 'GATT Connection established with Giftovate Band [BLE 5.3 MTU: 247]',
    },
    {
      id: 'log-1',
      timestamp: new Date().toLocaleTimeString(),
      type: 'info',
      message: 'Calibrating ventral Ag/AgCl dry contact electrodes... Impedance nominal (14.2 kΩ)',
    },
  ]);

  const addLog = useCallback((type: 'info' | 'warning' | 'alert' | 'ble', message: string) => {
    setLogs((prev) => [
      {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toLocaleTimeString(),
        type,
        message,
      },
      ...prev.slice(0, 40),
    ]);
  }, []);

  // Set phase helper with corresponding target values and logging
  const handleSetPhase = useCallback((newPhase: SimulationPhase) => {
    setPhase(newPhase);

    if (newPhase === 'resting') {
      setReading((prev) => ({
        ...prev,
        heartRate: 72,
        edaConductance: 2.1,
        skinTemperature: 33.8,
        hrvRmssd: 58,
        surgeLevel: 'normal',
      }));
      setIsPushBannerVisible(false);
      addLog('info', 'Phase shifted: Resting baseline. Sympathetic nervous system tone quiescent.');
    } else if (newPhase === 'pre_surge') {
      setReading((prev) => ({
        ...prev,
        heartRate: 94,
        edaConductance: 8.4,
        skinTemperature: 33.1,
        hrvRmssd: 28,
        surgeLevel: 'critical',
      }));
      setIsPushBannerVisible(true);
      addLog('alert', '⚠️ PRE-EPISODE ALERT: Sudomotor surge spike (8.4 μS). ~180s pre-sweat window! Prompting Iontophoresis.');
      addLog('ble', 'Dispatched silent LRA haptic trigger to wristband.');
    } else if (newPhase === 'active_sweating') {
      setReading((prev) => ({
        ...prev,
        heartRate: 108,
        edaConductance: 14.2,
        skinTemperature: 35.4,
        hrvRmssd: 22,
        surgeLevel: 'critical',
      }));
      setIsPushBannerVisible(true);
      addLog('warning', 'Active sweating episode underway. Eccrine sweat duct saturation reached.');
    }
  }, [addLog]);

  // Handle starting Iontophoresis Session from push banner or tab
  const handleStartIontoSession = (device: IontoDeviceType = iontoSession.device) => {
    setIontoSession((prev) => ({
      ...prev,
      isActive: true,
      device,
      currentDeliveredMa: prev.targetCurrentMa,
      elapsedSeconds: prev.elapsedSeconds > 0 ? prev.elapsedSeconds : 1,
    }));

    addLog('info', `⚡ Iontophoresis Treatment Triggered: ${device} delivering ${iontoSession.targetCurrentMa}.0 mA constant DC current.`);
    addLog('ble', `Wet hydrogel contact verified (${iontoSession.padWetnessPct}%). Ions building in eccrine sweat ducts.`);

    // After 6 seconds of simulated iontophoresis treatment, abort the sympathetic surge
    setTimeout(() => {
      handleSetPhase('resting');
      addLog('info', `✅ Sympathetic surge successfully aborted by ${device}. Eccrine ducts plugged, EDA restored to baseline.`);
    }, 6000);
  };

  const handleToggleIontoActive = (device?: IontoDeviceType) => {
    if (iontoSession.isActive) {
      setIontoSession(prev => ({ ...prev, isActive: false, currentDeliveredMa: 0 }));
      addLog('info', `Iontophoresis session paused on ${iontoSession.device}.`);
    } else {
      handleStartIontoSession(device || iontoSession.device);
    }
  };

  // Iontophoresis session tick timer
  useEffect(() => {
    if (!iontoSession.isActive) return;

    const timer = setInterval(() => {
      setIontoSession((prev) => {
        const totalSec = prev.sessionLengthMinutes * 60;
        if (prev.elapsedSeconds >= totalSec) {
          addLog('info', `🏆 ${prev.device} Iontophoresis session complete! Full therapeutic dose delivered.`);
          return { ...prev, isActive: false, currentDeliveredMa: 0, elapsedSeconds: totalSec };
        }
        return {
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1,
          currentDeliveredMa: prev.targetCurrentMa,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [iontoSession.isActive, addLog]);

  // Simulation tick loop for continuous micro-fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setReading((prev) => {
        let baseHR = 72;
        let baseEDA = 2.1;
        let baseTemp = 33.8;
        let baseRMSSD = 58;

        if (phase === 'pre_surge') {
          baseHR = 94;
          baseEDA = iontoSession.isActive ? 4.8 : 8.4;
          baseTemp = 33.1;
          baseRMSSD = 28;
        } else if (phase === 'active_sweating') {
          baseHR = 108;
          baseEDA = iontoSession.isActive ? 6.2 : 14.2;
          baseTemp = 35.4;
          baseRMSSD = 22;
        }

        const nextHR = Math.round(baseHR + (Math.random() - 0.5) * 3);
        const nextEDA = Math.max(0.5, Math.round((baseEDA + (Math.random() - 0.5) * 0.3) * 10) / 10);
        const nextTemp = Math.round((baseTemp + (Math.random() - 0.5) * 0.1) * 10) / 10;
        const nextRMSSD = Math.round(baseRMSSD + (Math.random() - 0.5) * 4);

        const isSurge = nextEDA >= edaThreshold || nextHR >= hrThreshold;
        const surgeLevel = isSurge ? 'critical' : nextEDA > 4.5 ? 'elevated' : 'normal';

        return {
          timestamp: Date.now(),
          heartRate: nextHR,
          edaConductance: nextEDA,
          skinTemperature: nextTemp,
          hrvRmssd: nextRMSSD,
          phasicPeak: isSurge,
          surgeLevel,
        };
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [phase, edaThreshold, hrThreshold, iontoSession.isActive]);

  const handleTriggerTestSpike = () => {
    handleSetPhase('pre_surge');
  };

  const handleHighlightHotspot = (id: number) => {
    const item = HOTSPOTS_DATA.find((h) => h.id === id) || null;
    setSelectedHotspot(item);
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
      {/* Top Global Header */}
      <Header
        phase={phase}
        isAlertActive={reading.surgeLevel === 'critical'}
        onOpenInvestorKit={() => setIsInvestorModalOpen(true)}
      />

      {/* Main Split Layout: 3D Viewport on Left/Top, Workspace on Right/Bottom */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Column: Interactive Three.js 3D Viewport */}
        <section className="w-full lg:w-1/2 h-[52vh] lg:h-[calc(100vh-65px)] border-b lg:border-b-0 lg:border-r border-slate-800/80 relative">
          <BandViewer3D
            reading={reading}
            selectedHotspotId={selectedHotspot?.id || null}
            onSelectHotspot={setSelectedHotspot}
            isExploded={isExploded}
            onToggleExplode={() => setIsExploded(!isExploded)}
            isXRay={isXRay}
            onToggleXRay={() => setIsXRay(!isXRay)}
            showLabels={showLabels}
            onToggleLabels={() => setShowLabels(!showLabels)}
            isSpinning={isSpinning}
            onToggleSpin={() => setIsSpinning(!isSpinning)}
          />
        </section>

        {/* Right Column: Tabbed Workspace */}
        <section className="w-full lg:w-1/2 flex-1 flex flex-col overflow-y-auto bg-[#07090E]">
          {/* Segmented 3-Tab Navigation Bar */}
          <div className="sticky top-0 z-20 px-4 sm:px-6 pt-4 pb-3 bg-[#07090E]/95 backdrop-blur-md border-b border-slate-800/80">
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
              <button
                onClick={() => setActiveTab('biometrics')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'biometrics'
                    ? 'bg-teal-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Biometrics</span>
              </button>

              <button
                onClick={() => setActiveTab('design')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'design'
                    ? 'bg-teal-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Design & parts</span>
              </button>

              <button
                onClick={() => setActiveTab('telemetry')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'telemetry'
                    ? 'bg-teal-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Live Telemetry</span>
              </button>
            </div>
          </div>

          {/* Active Tab Scrollable Content */}
          <div className="p-4 sm:p-6 pb-12">
            {activeTab === 'biometrics' && <BiometricsTab />}
            {activeTab === 'design' && (
              <DesignPartsTab
                onHighlightHotspot={handleHighlightHotspot}
                selectedHotspotId={selectedHotspot?.id || null}
                onOpenInvestorKit={() => setIsInvestorModalOpen(true)}
              />
            )}
            {activeTab === 'telemetry' && (
              <LiveTelemetryTab
                reading={reading}
                phase={phase}
                onSetPhase={handleSetPhase}
                edaThreshold={edaThreshold}
                onSetEdaThreshold={setEdaThreshold}
                hrThreshold={hrThreshold}
                onSetHrThreshold={setHrThreshold}
                logs={logs}
                onTriggerTestSpike={handleTriggerTestSpike}
                iontoSession={iontoSession}
                onUpdateIontoSession={setIontoSession}
                onToggleIontoActive={handleToggleIontoActive}
              />
            )}
          </div>
        </section>
      </main>

      {/* Floating Hotspot Inspector Modal */}
      <HotspotInspectorModal
        hotspot={selectedHotspot}
        onClose={() => setSelectedHotspot(null)}
      />

      {/* Commercial Production & Investor Kit Modal */}
      <InvestorShowcaseModal
        isOpen={isInvestorModalOpen}
        onClose={() => setIsInvestorModalOpen(false)}
      />

      {/* Interactive Smartphone Push Alert Banner */}
      <HidroAllyPushBanner
        isVisible={isPushBannerVisible}
        eda={reading.edaConductance}
        heartRate={reading.heartRate}
        onDismiss={() => setIsPushBannerVisible(false)}
        onStartIontoSession={handleStartIontoSession}
        iontoSession={iontoSession}
      />
    </div>
  );
}
