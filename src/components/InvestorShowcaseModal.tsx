import React, { useState } from 'react';
import { X, Download, Copy, Check, Sparkles, Layers, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';

interface InvestorShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InvestorShowcaseModal: React.FC<InvestorShowcaseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeView, setActiveView] = useState<'production' | 'comparison' | 'copy'>('production');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const websiteCopy = `THE BIOMETRIC STANDARD
Giftovate Band: Clinical-Grade Monitoring, Always On.

Precise, continuous, and unobtrusive. The Giftovate Band captures the physiological data that mobile apps miss. By monitoring Electrodermal Activity (EDA) and Heart Rate Variability (HRV) from the wrist — a stable, high-signal site for sympathetic nervous system activity — the band provides the raw data needed to predict hyperhidrosis triggers before they manifest.

[Join the Pilot Program]

---

KEY FEATURES
Engineered for warriors who demand evidence, not estimates.

• Continuous EDA Tracking
Captures real-time skin conductance from the ventral wrist, identifying spikes in sympathetic sudomotor activity 2–5 minutes before a visible episode begins.

• Physiological Correlation
Syncs Heart Rate Variability (HRV) with thermal and motion data to distinguish between metabolic sweat and nervous system-induced sudomotor activity.

• Invisible Comfort
Engineered as a lightweight, wrist-worn band for 24/7 wear, giving you a complete longitudinal view of your thermal profile without the bulk of traditional clinical devices.

• Seamless HidroAlly Sync
Automatically transmits biometric data to your HidroAlly dashboard, closing the loop between your body's signals and targeted therapeutic intervention.

---

HOW IT WORKS
1. Wear
The band sits comfortably on your wrist, continuously measuring micro-fluctuations in skin conductivity, heart rate, and motion.

2. Analyze
The onboard sensors capture EDA and HRV, while the mobile app correlates this with environmental data (Climate Alert).

3. Predict & Abort
Our AI identifies your unique 'pre-episode' biometric signature, notifying you to activate your targeted iontophoresis session (HydroGlove for hands, HydroVisage for face, or HydroSock for feet) to block sweat ducts before visible sweating manifests.

---

PRODUCTS ECOSYSTEM
• HidroAlly App (Closed-Loop Biofeedback Platform)
• Giftovate Band (24/7 Clinical EDA & HRV Wearable)
• HydroGlove (Portable Tap-Water Iontophoresis Glove)
• HydroVisage (Craniofacial Iontophoresis Mask)
• HydroSock (Plantar Iontophoresis Sock)
• Giftovate Oasis
• EcoCaps

© 2026 Giftovate Therapeutics Ltd. Developing affordable hyperhidrosis solutions in Africa.`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(websiteCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-slate-100 p-5 sm:p-7"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-8 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-medium tracking-wider text-teal-400 uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Commercial Hardware Asset & Website Kit</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              Giftovate Band: Final Production Hardware
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Production asset for giftovate.world, investor decks, and HidroAlly app launch
            </p>
          </div>

          {/* Download Action Button */}
          <a
            href="/assets/images/giftovate_band_production.jpg"
            download="Giftovate_Band_Commercial_Production_Render.jpg"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg hover:shadow-teal-500/20 cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download 8K Image</span>
          </a>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 mt-5 p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium">
          <button
            onClick={() => setActiveView('production')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all cursor-pointer ${
              activeView === 'production'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Production Hardware Render
          </button>
          <button
            onClick={() => setActiveView('comparison')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all cursor-pointer ${
              activeView === 'comparison'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Evolution: Bench Prototype vs. Production
          </button>
          <button
            onClick={() => setActiveView('copy')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all cursor-pointer ${
              activeView === 'copy'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Updated Website Copy (giftovate.world)
          </button>
        </div>

        {/* Tab 1: Production Hardware Render View */}
        {activeView === 'production' && (
          <div className="mt-5 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
              <img
                src="/assets/images/giftovate_band_production.jpg"
                alt="Giftovate Band Final Production Unit"
                className="w-full h-auto object-cover max-h-[520px]"
              />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-3 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80 text-xs font-mono">
                <span className="text-teal-400 font-semibold">Giftovate Band v1.0 Production Unit</span>
                <span className="text-slate-400">16:9 High-Res · Medical 316L & FKM</span>
              </div>
            </div>

            {/* Industrial Specs Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                <div className="font-mono text-teal-400 font-semibold text-[10px] uppercase">Form & Finish</div>
                <div className="font-bold text-white">Matte Graphite Polycarbonate</div>
                <p className="text-slate-400 text-[11px]">Surgical teal anodized accent ring, zero loose wires, IP68 hermetically sealed.</p>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                <div className="font-mono text-teal-400 font-semibold text-[10px] uppercase">Skin Interface</div>
                <div className="font-bold text-white">Dual Ag/AgCl & Optical PPG</div>
                <p className="text-slate-400 text-[11px]">Contoured ventral arch sitting flush against palmar wrist sudomotor nerves.</p>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                <div className="font-mono text-teal-400 font-semibold text-[10px] uppercase">Comfort Architecture</div>
                <div className="font-bold text-white">Fluoroelastomer Ribbed Strap</div>
                <p className="text-slate-400 text-[11px]">Micro-sweat evacuation grooves and flush circular titanium snap clasp.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Evolution Comparison (Prototype v0.1 vs Production Render) */}
        {activeView === 'comparison' && (
          <div className="mt-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Old bench prototype */}
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-400 font-semibold uppercase">Bench Prototype (v0.1)</span>
                  <span className="text-[10px] font-mono text-slate-500">Laboratory Test Unit</span>
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-black aspect-video flex items-center justify-center">
                  <img
                    src="/assets/aistudio/giftovate-band-B5uwL6Df_f97efdf8.jpg"
                    alt="Old Bench Prototype"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs text-slate-400 space-y-1 leading-relaxed">
                  <div>• Exposed debug ribbon connector</div>
                  <div>• Unsealed housing without display</div>
                  <div>• Proof of principle for ventral electrode contact</div>
                </div>
              </div>

              {/* New production render */}
              <div className="p-4 bg-slate-950/80 border border-teal-500/40 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-teal-300 font-semibold uppercase">Final Production Design (v1.0)</span>
                  <span className="text-[10px] font-mono text-teal-400">Commercial Investor Ready</span>
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-black aspect-video flex items-center justify-center">
                  <img
                    src="/assets/images/giftovate_band_production.jpg"
                    alt="Final Production Render"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs text-slate-300 space-y-1 leading-relaxed">
                  <div>• Internalized rigid-flex routing (zero cables)</div>
                  <div>• Micro-OLED biometric HUD with live telemetry</div>
                  <div>• Medical-grade FKM strap with micro-ribbing & titanium pin</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Updated Website Copy */}
        {activeView === 'copy' && (
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Updated Text for giftovate.world & Marketing Pages</h3>
                <p className="text-xs text-slate-400">Reflects targeted iontophoresis (HydroGlove, HydroVisage, HydroSock) and the new production band</p>
              </div>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-lg text-xs font-mono transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Website Text'}</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-2xl overflow-x-auto text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap max-h-[420px]">
              {websiteCopy}
            </pre>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <span className="text-slate-400">
            Giftovate Therapeutics Ltd · Clinical Hyperhidrosis Technologies
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-colors cursor-pointer"
          >
            Close Kit
          </button>
        </div>
      </div>
    </div>
  );
};
