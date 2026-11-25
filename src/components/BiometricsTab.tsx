import React from 'react';
import { Activity, Zap, Heart, Brain, Waves, ArrowRight, ShieldCheck, Thermometer, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export const BiometricsTab: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-300">
      {/* Overview Banner */}
      <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono font-medium tracking-wider text-teal-400 uppercase">
            <span>Autonomic Neuromonitoring</span>
            <span className="text-slate-600">·</span>
            <span>Targeted Iontophoresis Pairing</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1.5 tracking-tight">
            The Biometric Standard: Continuous EDA & HRV Monitoring
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed max-w-2xl">
            Hyperhidrosis is driven by hyperactivity of the postganglionic sympathetic sudomotor cholinergic pathway. The Giftovate Band directly quantifies this nerve outflow from the ventral wrist before physical sweat breaks out, triggering proactive iontophoresis before duct saturation.
          </p>
        </div>
      </div>

      {/* Clinical Comparison: Why Iontophoresis vs Peltier Thermoelectric Cooling */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-teal-500/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-teal-400 fill-current" />
            <h3 className="text-base font-bold text-white">
              Clinical Architecture: Why Iontophoresis Replaced Peltier Cooling
            </h3>
          </div>
          <span className="text-xs font-mono text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
            Mechanism Analysis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mt-3">
          {/* Why Peltier Cooling Failed */}
          <div className="p-4 bg-rose-950/20 border border-rose-900/40 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Why Thermoelectric (Peltier) Cooling Fails</span>
            </div>
            <ul className="space-y-1.5 text-slate-300 leading-relaxed list-disc list-inside">
              <li><strong className="text-rose-200">No Duct Blockage:</strong> Cooling only eases sweating while active. It does not alter eccrine gland behavior; once removed, sweating erupts immediately.</li>
              <li><strong className="text-rose-200">Heavy Power Drain:</strong> Consumes 2–6 W per module, exhausting portable wearable batteries within 30–60 minutes.</li>
              <li><strong className="text-rose-200">Condensation & Heat:</strong> The hot side requires large heat sinks, while the cold side causes condensation that leaves the skin damp anyway.</li>
            </ul>
          </div>

          {/* Why Portable Iontophoresis Succeeds */}
          <div className="p-4 bg-teal-950/30 border border-teal-700/40 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-teal-300 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>Why Tap-Water Iontophoresis Succeeds</span>
            </div>
            <ul className="space-y-1.5 text-slate-300 leading-relaxed list-disc list-inside">
              <li><strong className="text-teal-200">Physiological Duct Blockage:</strong> Steady 8–20 mA current drives minerals into eccrine sweat ducts, creating an ionic plug that halts sweat for days.</li>
              <li><strong className="text-teal-200">High Clinical Efficacy:</strong> 90%+ sweat reduction achieved after 6–10 sessions, sustained with 1–2 weekly maintenance sessions.</li>
              <li><strong className="text-teal-200">Targeted Portability:</strong> Swaps bulky water trays for snap-on wet sponge/hydrogel pads in wearable form factors (HydroGlove, HydroVisage, HydroSock).</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Why Wrist EDA Matters */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80">
        <div className="flex items-center gap-2.5 text-base font-bold text-white mb-3">
          <Waves className="w-5 h-5 text-teal-400" />
          <h3>Why Ventral Wrist EDA Matters: The 3-Minute Pre-Sweat Window</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mt-4">
          <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-teal-400 font-semibold">T - 300s to T - 180s</span>
              <Brain className="w-4 h-4 text-teal-400" />
            </div>
            <div className="font-bold text-slate-100 text-sm">Sudomotor Burst Initiation</div>
            <p className="text-slate-400 leading-relaxed">
              Sympathetic preganglionic fibers discharge bursts of acetylcholine (ACh) onto muscarinic receptors surrounding dermal eccrine sweat glands.
            </p>
          </div>

          <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2 border-l-2 border-l-teal-500">
            <div className="flex items-center justify-between">
              <span className="font-mono text-amber-400 font-semibold">T - 180s to T - 60s</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="font-bold text-slate-100 text-sm">Phasic Conductance Spike (SCR)</div>
            <p className="text-slate-400 leading-relaxed">
              Electrolyte fluid fills the sweat ducts beneath intact stratum corneum, creating low-resistance electrical pathways detected as a sharp microSiemens (μS) spike.
            </p>
          </div>

          <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-teal-400 font-semibold">T = 0s</span>
              <Activity className="w-4 h-4 text-teal-400" />
            </div>
            <div className="font-bold text-slate-100 text-sm">Iontophoresis Abort Window</div>
            <p className="text-slate-400 leading-relaxed">
              Putting on the HydroGlove or HydroVisage at the prompt delivers steady current before visible perspiration breaks out, stopping the sweat episode before it begins.
            </p>
          </div>
        </div>
      </div>

      {/* Physiological Correlation Table */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-white">Physiological State Correlation Matrix</h3>
            <p className="text-xs text-slate-400">Differential autonomic markers comparing psychogenic hyperhidrosis vs. exercise</p>
          </div>
          <span className="text-xs font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
            Validated N=140
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">Physiological State</th>
                <th className="py-2.5 px-3">Heart Rate (BPM)</th>
                <th className="py-2.5 px-3">HRV RMSSD (ms)</th>
                <th className="py-2.5 px-3">EDA Conductance (μS)</th>
                <th className="py-2.5 px-3">Skin Temp (°C)</th>
                <th className="py-2.5 px-3">Recommended Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-3 font-sans font-semibold text-white">Resting Baseline</td>
                <td className="py-3 px-3 text-slate-300">65 – 76 BPM</td>
                <td className="py-3 px-3 text-emerald-400">&gt; 55 ms (Vagal dominant)</td>
                <td className="py-3 px-3 text-teal-300">1.5 – 3.2 μS</td>
                <td className="py-3 px-3 text-slate-300">33.5 – 34.2 °C</td>
                <td className="py-3 px-3 font-sans text-slate-400">No treatment needed</td>
              </tr>
              <tr className="hover:bg-slate-800/30 bg-amber-500/5">
                <td className="py-3 px-3 font-sans font-semibold text-amber-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Sympathetic Surge (Pre-Sweat)
                </td>
                <td className="py-3 px-3 text-amber-300">88 – 98 BPM (Tachycardia)</td>
                <td className="py-3 px-3 text-rose-400">18 – 32 ms (Vagal withdrawal)</td>
                <td className="py-3 px-3 text-amber-300 font-bold">6.5 – 12.0 μS (Phasic Spike)</td>
                <td className="py-3 px-3 text-cyan-300">32.8 – 33.4 °C (Cold clammy)</td>
                <td className="py-3 px-3 font-sans text-amber-300 font-medium">Activate HydroGlove / HydroVisage</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-3 font-sans font-semibold text-white">Physical Exertion / Heat</td>
                <td className="py-3 px-3 text-slate-300">110 – 150 BPM</td>
                <td className="py-3 px-3 text-slate-400">15 – 25 ms</td>
                <td className="py-3 px-3 text-slate-300">8.0 – 16.0 μS</td>
                <td className="py-3 px-3 text-rose-400 font-bold">&gt; 35.8 °C (Vasodilation)</td>
                <td className="py-3 px-3 font-sans text-slate-400">Thermoregulatory dissipation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* System Pipeline */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80">
        <div className="flex items-center gap-2 text-base font-bold text-white mb-2">
          <Brain className="w-5 h-5 text-teal-400" />
          <h3>System Pipeline: Band → Python BLE Bridge → HidroAlly Iontophoresis App</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Sub-second sudomotor latency triggers prompt before sweat droplets reach epidermal ridges
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
            <div className="font-mono text-[10px] text-teal-400 uppercase">Stage 01</div>
            <div className="font-semibold text-white">Ventral Electrodes</div>
            <p className="text-slate-400 text-[11px]">
              Ag/AgCl contact studs sample epidermal micro-conductance at 32 Hz with 24-bit resolution.
            </p>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
            <div className="font-mono text-[10px] text-teal-400 uppercase">Stage 02</div>
            <div className="font-semibold text-white">nRF52840 DSP & BLE</div>
            <p className="text-slate-400 text-[11px]">
              Band isolates phasic spikes from tonic baseline and broadcasts BLE packets.
            </p>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
            <div className="font-mono text-[10px] text-teal-400 uppercase">Stage 03</div>
            <div className="font-semibold text-white">Python Bleak Bridge</div>
            <p className="text-slate-400 text-[11px]">
              Async Python client receives GATT notifications, monitors delta-EDA thresholds, and streams JSON.
            </p>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
            <div className="font-mono text-[10px] text-teal-400 uppercase">Stage 04</div>
            <div className="font-semibold text-white">Targeted Iontophoresis</div>
            <p className="text-slate-400 text-[11px]">
              HidroAlly prompts session with HydroGlove (hands), HydroVisage (face), or HydroSock (feet).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
