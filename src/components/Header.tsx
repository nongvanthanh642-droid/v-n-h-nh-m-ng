import React from 'react';
import { Cpu, HardDrive, Radio, Download, BookOpen, Layers } from 'lucide-react';
import { RouterConfig } from '../data/configTemplates';

interface HeaderProps {
  config: RouterConfig;
  onDownloadZip: () => void;
  onOpenGuide: () => void;
  isDownloading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  onDownloadZip,
  onOpenGuide,
  isDownloading,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold">
              <Radio className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  OpenWrt CI Studio
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                  Qualcomm IPQ6000
                </span>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                  64GB eMMC Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                JD Cloud AX1800 Pro • 4G Cellular Gateway & BMS/IoT Edge Stack
              </p>
            </div>
          </div>

          {/* Quick Hardware Badges */}
          <div className="hidden lg:flex items-center space-x-4 text-xs text-slate-300">
            <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>IPQ6000 (4x A53)</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>512MB DDR3L</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
              <span>64GB eMMC Flash</span>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={onOpenGuide}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700 transition"
              title="How to run GitHub Actions & Flash Firmware"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Flash Guide</span>
            </button>

            <button
              onClick={onDownloadZip}
              disabled={isDownloading}
              className="inline-flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-lg shadow-md shadow-cyan-500/20 active:scale-95 transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Packing Repo...' : 'Download Repo (.zip)'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
