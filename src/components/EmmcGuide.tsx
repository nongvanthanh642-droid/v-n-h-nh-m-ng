import React, { useState } from 'react';
import { HardDrive, Check, Copy, AlertTriangle, ShieldCheck, Terminal, Server, FolderTree } from 'lucide-react';
import { generateEmmcExpandScript } from '../data/configTemplates';

export const EmmcGuide: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const emmcScript = generateEmmcExpandScript();

  const handleCopyScript = () => {
    navigator.clipboard.writeText(emmcScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-800/50 rounded-xl p-5 shadow-xl">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-900/60 text-emerald-400 border border-emerald-700/50">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">
              64GB eMMC Storage Strategy for BMS & Niagara N4 / Docker
            </h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Standard OpenWrt builds only allocate a minimal 256MB–1GB rootfs partition. When running
              Docker containers, Node-RED flows, and Tridium Niagara N4 JACE emulators, the disk fills up
              immediately. Our system solves this automatically via an integrated firstboot uci-defaults script.
            </p>
          </div>
        </div>

        {/* 3 Step Storage Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-5">
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-xs">
            <div className="text-emerald-400 font-semibold mb-1 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-800 text-center leading-4 text-[10px] inline-flex items-center justify-center">1</span>
              <span>Fast Sysupgrade (1GB Base)</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              The compiled sysupgrade .bin flashes in under 30 seconds via U-Boot or LuCI without transferring 60GB of empty zeroes over the network.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-xs">
            <div className="text-cyan-400 font-semibold mb-1 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 text-center leading-4 text-[10px] inline-flex items-center justify-center">2</span>
              <span>Firstboot Auto-Expand</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              <code>99-expand-emmc.sh</code> runs automatically: repairs GPT backup headers, expands partition to 100% of eMMC, and runs online <code>resize2fs</code>.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-xs">
            <div className="text-indigo-400 font-semibold mb-1 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-950 border border-indigo-800 text-center leading-4 text-[10px] inline-flex items-center justify-center">3</span>
              <span>Docker & /opt Persistence</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Pre-configures <code>/etc/docker/daemon.json</code> with <code>data-root: /opt/docker</code>, giving Docker the entire ~58GB free space.
            </p>
          </div>
        </div>
      </div>

      {/* Script Source Code */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 bg-slate-800/70 border-b border-slate-700/80 gap-3">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-semibold text-slate-200">
              files/etc/uci-defaults/99-expand-emmc.sh
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
              Auto Firstboot Service
            </span>
          </div>

          <button
            onClick={handleCopyScript}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied Script!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Script</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[460px] overflow-y-auto leading-relaxed">
          <pre className="text-slate-300">
            {emmcScript.split('\n').map((line, idx) => {
              const isComment = line.trim().startsWith('#');
              const isLogger = line.includes('logger');
              const isCmd = line.includes('parted') || line.includes('resize2fs');

              let lineClass = 'text-slate-300';
              if (isComment) lineClass = 'text-slate-500 italic';
              else if (isLogger) lineClass = 'text-cyan-300';
              else if (isCmd) lineClass = 'text-emerald-300 font-semibold';

              return (
                <div key={idx} className="flex hover:bg-slate-800/40 px-2 rounded">
                  <span className="select-none text-slate-600 text-right w-8 mr-4 inline-block opacity-60">
                    {idx + 1}
                  </span>
                  <span className={lineClass}>{line}</span>
                </div>
              );
            })}
          </pre>
        </div>

        <div className="px-4 py-3 bg-slate-950/70 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
          <span className="text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Includes idempotent lock check via <code>/etc/emmc_expanded.done</code> to guarantee safety.
          </span>
        </div>
      </div>

      {/* Manual Verification Commands in SSH */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <h4 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <Server className="w-4 h-4 text-cyan-400" />
          <span>Post-Flash Storage Verification (Via SSH)</span>
        </h4>

        <div className="space-y-3 font-mono text-xs">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-300">
            <span className="text-slate-500 select-none"># 1. Check mounted filesystem capacity (Look for /overlay with ~58GB Available)</span>
            <div className="text-cyan-300 mt-1">df -h / /overlay</div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-300">
            <span className="text-slate-500 select-none"># 2. Inspect eMMC block device partitions</span>
            <div className="text-cyan-300 mt-1">lsblk -f /dev/mmcblk0</div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-300">
            <span className="text-slate-500 select-none"># 3. Verify Docker Root Directory & Engine Storage</span>
            <div className="text-cyan-300 mt-1">docker info | grep -i "Docker Root Dir"</div>
          </div>
        </div>
      </div>
    </div>
  );
};
