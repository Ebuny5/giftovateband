import React, { useState } from 'react';
import { BOM_ITEMS } from '../data/bandConstants';
import { BomItem, HotspotData } from '../types/biometrics';
import { Layers, DollarSign, Wrench, ChevronRight, Eye, ShieldCheck, Sparkles, Image as ImageIcon } from 'lucide-react';

interface DesignPartsTabProps {
  onHighlightHotspot: (id: number) => void;
  selectedHotspotId: number | null;
  onOpenInvestorKit: () => void;
}

export const DesignPartsTab: React.FC<DesignPartsTabProps> = ({
  onHighlightHotspot,
  selectedHotspotId,
  onOpenInvestorKit,
}) => {
  const [showPrototypeModal, setShowPrototypeModal] = useState(false);

  const totalProtoCost = BOM_ITEMS.reduce((sum, item) => sum + item.costPrototype, 0);
  const totalVolumeCost = BOM_ITEMS.reduce((sum, item) => sum + item.costVolume, 0);
  const costReductionPct = Math.round(((totalProtoCost - totalVolumeCost) / totalProtoCost) * 100);

  return (
    <div className="space-y-6 text-slate-300">
      {/* Top Banner & Hardware Showcase Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal-400 uppercase tracking-wider">
            <span>Hardware Engineering</span>
            <span className="text-slate-600">·</span>
            <span>Commercial Production Asset</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Mechanical Assembly & Component Stack
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            8-part modular architecture optimized for ventral skin impedance and IP68 hermeticity
          </p>
        </div>

        <button
          onClick={onOpenInvestorKit}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 hover:from-teal-500/30 hover:to-cyan-500/30 text-teal-300 border border-teal-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md hover:scale-102 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>Production Render & Investor Kit</span>
        </button>
      </div>

      {/* Pad Layer Stack Section */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80">
        <div className="flex items-center gap-2.5 text-base font-bold text-white mb-2">
          <Layers className="w-5 h-5 text-teal-400" />
          <h3>Pad & Mechanical Layer Stack</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Exploded vertical sequence showing hermetic seal, rigid-flex routing, and dry electrode contact
        </p>

        <div className="space-y-2.5 text-xs font-mono">
          {/* L1 */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-teal-400 font-bold">L1</span>
              <div>
                <div className="font-sans font-semibold text-white">Matte Graphite Polycarbonate Top Bezel & OLED Display</div>
                <div className="text-[11px] text-slate-400">0.96" PMOLED 850-nit display with 2.5D Corning Gorilla Glass cover</div>
              </div>
            </div>
            <span className="text-slate-500 text-[11px] hidden sm:inline">Exposed Top</span>
          </div>

          {/* L2 */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold">L2</span>
              <div>
                <div className="font-sans font-semibold text-white">Hermetic Silicone Waterproof Gasket (IP68)</div>
                <div className="text-[11px] text-slate-400">Continuous 45 Shore A perimeter compression seal protecting battery and compute</div>
              </div>
            </div>
            <span className="text-cyan-400/80 text-[11px] hidden sm:inline">3m Submersible</span>
          </div>

          {/* L3 */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold">L3</span>
              <div>
                <div className="font-sans font-semibold text-white">Rigid-Flex Circuit Board with Nordic nRF52840 BLE SoC</div>
                <div className="text-[11px] text-slate-400">4-layer polyimide flex interconnect routing 24-bit ADC lines to ventral sensor pod</div>
              </div>
            </div>
            <span className="text-emerald-400/80 text-[11px] hidden sm:inline">Ultra-low Power</span>
          </div>

          {/* L4 */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-bold">L4</span>
              <div>
                <div className="font-sans font-semibold text-white">Dual Ag/AgCl Sintered Contact Electrodes & Optical PPG Lens</div>
                <div className="text-[11px] text-slate-400">Flush medical 316L studs and sapphire optical window with NTC skin thermistor</div>
              </div>
            </div>
            <span className="text-amber-400/80 text-[11px] hidden sm:inline">Dry Contact</span>
          </div>

          {/* Skin Interface */}
          <div className="p-3 bg-teal-950/20 border border-teal-800/40 rounded-xl flex items-center justify-between text-teal-300">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-teal-900/60 text-teal-300 font-bold">—</span>
              <div>
                <div className="font-sans font-semibold text-teal-200">Skin Interface: Ventral Wrist Stratum Corneum</div>
                <div className="text-[11px] text-teal-400/80">Palmar wrist region with dense eccrine gland innervation (500–600 glands/cm²)</div>
              </div>
            </div>
            <span className="text-teal-400 font-sans text-[11px] hidden sm:inline">Sudomotor Target</span>
          </div>
        </div>
      </div>

      {/* 8 Tracked BOM Components Table */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-white">Bill of Materials (BOM) & Unit Economics</h3>
            <p className="text-xs text-slate-400">Click any row to focus and highlight the corresponding component in the 3D viewport</p>
          </div>
          <div className="text-xs font-mono text-slate-400">
            8 Tracked Modules
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Component Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Material / Substrate</th>
                <th className="py-2.5 px-3">Proto Cost</th>
                <th className="py-2.5 px-3">Target Vol. Cost</th>
                <th className="py-2.5 px-3">Supplier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {BOM_ITEMS.map((item) => {
                const isSelected = selectedHotspotId === item.id;
                return (
                  <tr
                    key={item.id}
                    onClick={() => onHighlightHotspot(item.id)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-teal-500/15 text-white font-medium'
                        : 'hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <td className="py-3 px-3 font-mono">
                      <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] ${
                        isSelected ? 'bg-teal-400 text-slate-950 font-bold' : 'bg-slate-800 text-teal-400'
                      }`}>
                        {item.id}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">
                      {item.name}
                      <span className="block text-[10px] font-mono text-slate-400">{item.partNumber}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400">{item.category}</td>
                    <td className="py-3 px-3">{item.material}</td>
                    <td className="py-3 px-3 font-mono font-medium text-slate-200">
                      ${item.costPrototype.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-emerald-400">
                      ${item.costVolume.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-slate-400">{item.supplier}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manufacturing Cost Breakdown Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-1">
          <div className="text-xs text-slate-400 uppercase font-mono">Prototype Run Cost (100 Units)</div>
          <div className="text-2xl font-bold font-mono text-white">${totalProtoCost.toFixed(2)}</div>
          <p className="text-[11px] text-slate-400">Includes CNC tooling, manual Ag/AgCl dip-coating, and rapid flex turns.</p>
        </div>

        <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-1">
          <div className="text-xs text-slate-400 uppercase font-mono">Production Volume Target (&gt;10k)</div>
          <div className="text-2xl font-bold font-mono text-emerald-400">${totalVolumeCost.toFixed(2)}</div>
          <p className="text-[11px] text-slate-400">Hard-tool injection mold, reel-to-reel SMT, automated sintering.</p>
        </div>

        <div className="p-4 bg-teal-950/30 border border-teal-800/40 rounded-2xl space-y-1">
          <div className="text-xs text-teal-300 uppercase font-mono">Scale Cost Reduction</div>
          <div className="text-2xl font-bold font-mono text-teal-300">-{costReductionPct}% Unit Savings</div>
          <p className="text-[11px] text-slate-300">Unlocks consumer accessible pricing (&lt;$99 MSRP) with medical reimbursement qualification.</p>
        </div>
      </div>

      {/* Hardware Prototype Image Modal */}
      {showPrototypeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs font-mono text-teal-400 uppercase">Hardware Bench Testing</div>
                <h3 className="text-lg font-bold text-white">Giftovate Band Prototype v0.1 Reference</h3>
              </div>
              <button
                onClick={() => setShowPrototypeModal(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg text-slate-300 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center max-h-[460px]">
              <img
                src="/assets/aistudio/giftovate-band-B5uwL6Df_f97efdf8.jpg"
                alt="Giftovate Band Prototype v0.1"
                className="w-full h-auto object-contain"
              />
            </div>

            <p className="mt-3 text-xs text-slate-400 leading-relaxed">
              Initial hardware bench prototype showing the ventral sensor pod, circular dry contact electrodes, central optical photodiode cluster, flex debug test ribbon, and fluoroelastomer strap loop with clasp. The 3D model above refines this architecture into an ergonomic, medically certified commercial housing.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
