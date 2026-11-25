import React from 'react';
import { HotspotData } from '../types/biometrics';
import { X, Layers, Activity, DollarSign, Wrench, ShieldCheck } from 'lucide-react';

interface HotspotInspectorModalProps {
  hotspot: HotspotData | null;
  onClose: () => void;
}

export const HotspotInspectorModal: React.FC<HotspotInspectorModalProps> = ({
  hotspot,
  onClose,
}) => {
  if (!hotspot) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-200 p-6"
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
        <div className="flex items-start gap-3 pr-8">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 font-mono font-bold text-sm border border-teal-500/40">
            {hotspot.id}
          </div>
          <div>
            <div className="text-xs font-mono tracking-wider text-teal-400 uppercase">
              {hotspot.category} Component
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {hotspot.title}
            </h2>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              {hotspot.subtitle}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm leading-relaxed text-slate-300">
          {hotspot.description}
        </div>

        {/* Clinical Significance */}
        <div className="mt-4 p-3.5 bg-teal-950/30 border border-teal-800/40 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            Clinical Relevance in Hyperhidrosis
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {hotspot.clinicalSignificance}
          </p>
        </div>

        {/* Engineering Specifications Grid */}
        <div className="mt-5">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-2.5">
            <Wrench className="w-3.5 h-3.5 text-teal-400" />
            Technical Specifications
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {hotspot.specs.map((spec, i) => (
              <div key={i} className="p-2.5 bg-slate-950/40 border border-slate-800/60 rounded-lg">
                <div className="text-slate-400 font-medium">{spec.label}</div>
                <div className="font-mono text-white mt-0.5">{spec.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Material & Cost Breakdown */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-950/40 border border-slate-800/60 rounded-lg">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Layers className="w-3.5 h-3.5 text-teal-400" />
              <span>Material & Tolerance</span>
            </div>
            <div className="text-slate-200 font-medium">{hotspot.material}</div>
            <div className="text-slate-400 font-mono mt-0.5">{hotspot.tolerance}</div>
          </div>

          <div className="p-3 bg-slate-950/40 border border-slate-800/60 rounded-lg">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Unit Manufacturing Economics</span>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-slate-400">Prototype run:</span>
              <span className="font-mono font-semibold text-white">${hotspot.costPrototype.toFixed(2)}</span>
            </div>
            <div className="flex items-baseline justify-between mt-0.5">
              <span className="text-slate-400">Target volume:</span>
              <span className="font-mono font-semibold text-emerald-400">${hotspot.costVolume.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Dismiss Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
