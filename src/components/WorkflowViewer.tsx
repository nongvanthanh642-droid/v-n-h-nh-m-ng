import React, { useState } from 'react';
import { Copy, Check, Terminal, ShieldCheck, HardDrive, Cpu, Radio, Sparkles } from 'lucide-react';
import { RouterConfig, generateWorkflowYaml } from '../data/configTemplates';

interface WorkflowViewerProps {
  config: RouterConfig;
}

export const WorkflowViewer: React.FC<WorkflowViewerProps> = ({ config }) => {
  const [copied, setCopied] = useState(false);
  const yamlContent = generateWorkflowYaml(config);

  const handleCopy = () => {
    navigator.clipboard.writeText(yamlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-800/40">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200">Device Target</h4>
            <p className="text-xs text-slate-400 mt-0.5">Qualcomm IPQ6000</p>
            <p className="text-[11px] text-cyan-400 font-mono mt-1">qualcommax/ipq60xx</p>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200">64GB eMMC Auto-Expand</h4>
            <p className="text-xs text-slate-400 mt-0.5">Parted + Resize2fs</p>
            <p className="text-[11px] text-emerald-400 font-mono mt-1">files/etc/uci-defaults/</p>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-indigo-950/80 text-indigo-400 border border-indigo-800/40">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200">Parallel Build</h4>
            <p className="text-xs text-slate-400 mt-0.5">Multi-core compilation</p>
            <p className="text-[11px] text-indigo-400 font-mono mt-1">make -j$(nproc)</p>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-amber-950/80 text-amber-400 border border-amber-800/40">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200">Artifact Output</h4>
            <p className="text-xs text-slate-400 mt-0.5">Sysupgrade .bin & Release</p>
            <p className="text-[11px] text-amber-400 font-mono mt-1">actions/upload-artifact@v4</p>
          </div>
        </div>
      </div>

      {/* Code Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 bg-slate-800/70 border-b border-slate-700/80 gap-3">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-semibold text-slate-200">
              .github/workflows/build-openwrt.yml
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-700 text-slate-300">
              YAML Workflow
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy YAML</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Block with line numbering */}
        <div className="relative overflow-x-auto p-4 font-mono text-xs text-slate-300 max-h-[640px] overflow-y-auto leading-relaxed selection:bg-cyan-500/30">
          <pre className="text-slate-300">
            {yamlContent.split('\n').map((line, idx) => {
              // Highlight comments, keys, and values softly
              const isComment = line.trim().startsWith('#');
              const isStep = line.trim().startsWith('- name:');
              const isUses = line.trim().startsWith('uses:');

              let lineClass = 'text-slate-300';
              if (isComment) lineClass = 'text-slate-500 italic';
              else if (isStep) lineClass = 'text-cyan-300 font-semibold';
              else if (isUses) lineClass = 'text-purple-300';

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

        {/* Card Footer Notes */}
        <div className="px-4 py-3 bg-slate-950/70 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>
              Configured with disk cleanup (~35GB free space), multi-core compilation, and automatic <code>*sysupgrade.bin</code> artifact packaging.
            </span>
          </div>
          <span className="text-slate-500 font-mono text-[11px]">
            Target file: .github/workflows/build-openwrt.yml
          </span>
        </div>
      </div>
    </div>
  );
};
