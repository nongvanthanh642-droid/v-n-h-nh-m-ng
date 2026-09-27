import React, { useState } from 'react';
import {
  FileCode2,
  GitBranch,
  Settings,
  HardDrive,
  Radio,
  Smartphone,
  Download,
  BookOpen,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';
import { DEFAULT_CONFIG, RouterConfig } from './data/configTemplates';
import { downloadRepoZip } from './utils/zipExporter';
import { Header } from './components/Header';
import { WorkflowViewer } from './components/WorkflowViewer';
import { FeedsViewer } from './components/FeedsViewer';
import { ConfigGenerator } from './components/ConfigGenerator';
import { EmmcGuide } from './components/EmmcGuide';
import { CellularTool } from './components/CellularTool';
import { RouterAppPreview } from './components/RouterAppPreview';
import { BandwidthDashboard } from './components/BandwidthDashboard';
import { SetupGuideModal } from './components/SetupGuideModal';

export default function App() {
  const [config, setConfig] = useState<RouterConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<
    'bandwidth' | 'workflow' | 'feeds' | 'config' | 'emmc' | 'cellular' | 'apk'
  >('bandwidth');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      await downloadRepoZip(config);
    } catch (err) {
      console.error('Failed to generate ZIP archive', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Top Navbar Header */}
      <Header
        config={config}
        onDownloadZip={handleDownloadZip}
        onOpenGuide={() => setIsGuideOpen(true)}
        isDownloading={isDownloading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 overflow-x-auto gap-2">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('bandwidth')}
              className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                activeTab === 'bandwidth'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Realtime Bandwidth & Spikes</span>
              <span className="px-1.5 py-0.2 text-[9px] rounded bg-emerald-500/20 text-emerald-400 font-mono border border-emerald-500/30">LIVE</span>
            </button>

            <button
              onClick={() => setActiveTab('workflow')}
              className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                activeTab === 'workflow'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FileCode2 className="w-4 h-4" />
              <span>GitHub Actions (.yml)</span>
            </button>

            <button
              onClick={() => setActiveTab('feeds')}
              className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                activeTab === 'feeds'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              <span>Custom Feeds & Scripts</span>
            </button>

            <button
              onClick={() => setActiveTab('config')}
              className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                activeTab === 'config'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>.config Seed & Packages</span>
            </button>

            <button
              onClick={() => setActiveTab('emmc')}
              className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                activeTab === 'emmc'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <HardDrive className="w-4 h-4" />
              <span>64GB eMMC & Docker Storage</span>
            </button>

            <button
              onClick={() => setActiveTab('cellular')}
              className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                activeTab === 'cellular'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Cell Lock & AT Commands</span>
            </button>

            <button
              onClick={() => setActiveTab('apk')}
              className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                activeTab === 'apk'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Smartphone className="w-4 h-4 text-indigo-400" />
              <span>App APK (SSH + Web Hybrid)</span>
              <span className="px-1.5 py-0.2 text-[9px] rounded bg-indigo-500/30 text-indigo-200 font-mono">APK</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400">
            <span className="font-mono text-cyan-400">Branch: {config.openwrtBranch}</span>
          </div>
        </div>

        {/* Tab View Panels */}
        {activeTab === 'bandwidth' && <BandwidthDashboard />}
        {activeTab === 'workflow' && <WorkflowViewer config={config} />}
        {activeTab === 'feeds' && <FeedsViewer config={config} />}
        {activeTab === 'config' && (
          <ConfigGenerator config={config} onChangeConfig={setConfig} />
        )}
        {activeTab === 'emmc' && <EmmcGuide />}
        {activeTab === 'cellular' && <CellularTool />}
        {activeTab === 'apk' && <RouterAppPreview />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 py-5 bg-slate-950/80 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            <span>
              Engineered for JD Cloud AX1800 Pro (Qualcomm IPQ6000) • Official OpenWrt Source
            </span>
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>512MB RAM</span>
            <span>•</span>
            <span>64GB eMMC</span>
            <span>•</span>
            <span>BMS / Niagara N4 IoT</span>
          </div>
        </div>
      </footer>

      {/* Setup & Flash Modal */}
      <SetupGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        lanIp={config.defaultLanIp}
      />
    </div>
  );
}
