import React, { useState } from 'react';
import { Copy, Check, Terminal, ExternalLink, Globe, Shield, MessageSquare, Radio, Sparkles } from 'lucide-react';
import { RouterConfig, generateDiyPart1, generateDiyPart2 } from '../data/configTemplates';

interface FeedsViewerProps {
  config: RouterConfig;
}

export const FeedsViewer: React.FC<FeedsViewerProps> = ({ config }) => {
  const [activeTab, setActiveTab] = useState<'part1' | 'part2'>('part1');
  const [copiedPart1, setCopiedPart1] = useState(false);
  const [copiedPart2, setCopiedPart2] = useState(false);

  const diyPart1Content = generateDiyPart1();
  const diyPart2Content = generateDiyPart2(config.defaultLanIp);

  const handleCopyPart1 = () => {
    navigator.clipboard.writeText(diyPart1Content);
    setCopiedPart1(true);
    setTimeout(() => setCopiedPart1(false), 2000);
  };

  const handleCopyPart2 = () => {
    navigator.clipboard.writeText(diyPart2Content);
    setCopiedPart2(true);
    setTimeout(() => setCopiedPart2(false), 2000);
  };

  const thirdPartyPackages = [
    {
      name: 'luci-app-modemband',
      icon: Radio,
      tag: '4G LTE Band Lock',
      url: 'https://github.com/4fun/luci-app-modemband',
      description: 'Web UI to lock 4G bands (B1, B3, B7, B8, B28, etc.) and force LTE-Only mode directly in LuCI.',
    },
    {
      name: 'luci-app-sms-tool',
      icon: MessageSquare,
      tag: 'SMS & USSD OTP',
      url: 'https://github.com/koshev-ay/luci-app-sms-tool',
      description: 'Send and receive SMS messages, check carrier balance, and dial USSD codes for IoT SIM cards.',
    },
    {
      name: 'luci-app-nekobox',
      icon: Globe,
      tag: 'Sing-box Proxy / SNI',
      url: 'https://github.com/Thaolga/luci-app-nekobox',
      description: 'Sing-box core proxy client for high-performance traffic steering, bypass, and IoT remote bridging.',
    },
    {
      name: 'luci-app-adguardhome',
      icon: Shield,
      tag: 'DNS Ad-blocker',
      url: 'https://github.com/rufengsuixing/luci-app-adguardhome',
      description: 'Integrates official AdGuard Home DNS sinkhole directly into OpenWrt with LuCI control panel.',
    },
    {
      name: 'luci-theme-argon',
      icon: Sparkles,
      tag: 'Modern UI Theme',
      url: 'https://github.com/jerrykuku/luci-theme-argon',
      description: 'Sleek, responsive dark-mode theme with custom login background and configuration app.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Third Party Package Cards */}
      <div>
        <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <span>Integrated Third-Party Feeds & Repositories</span>
          <span className="text-xs font-normal text-slate-400">
            (Injected into feeds.conf.default)
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {thirdPartyPackages.map((pkg, i) => {
            const Icon = pkg.icon;
            return (
              <div
                key={i}
                className="bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 rounded-xl p-3.5 flex flex-col justify-between transition group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-lg bg-slate-700/80 text-cyan-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono font-semibold text-white">
                        {pkg.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                      {pkg.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                    {pkg.description}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-700/50 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-mono truncate max-w-[200px]">
                    {pkg.url.replace('https://github.com/', '')}
                  </span>
                  <a
                    href={pkg.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                  >
                    <span>Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Script Viewers */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 bg-slate-800/70 border-b border-slate-700/80 gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('part1')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                activeTab === 'part1'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              diy-part1.sh (Feeds Injection)
            </button>
            <button
              onClick={() => setActiveTab('part2')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                activeTab === 'part2'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              diy-part2.sh (Dnsmasq-full & Patches)
            </button>
          </div>

          <div>
            {activeTab === 'part1' ? (
              <button
                onClick={handleCopyPart1}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition active:scale-95"
              >
                {copiedPart1 ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy diy-part1.sh</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleCopyPart2}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition active:scale-95"
              >
                {copiedPart2 ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy diy-part2.sh</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Script Content */}
        <div className="p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[480px] overflow-y-auto leading-relaxed">
          <pre className="text-slate-300">
            {(activeTab === 'part1' ? diyPart1Content : diyPart2Content)
              .split('\n')
              .map((line, idx) => {
                const isComment = line.trim().startsWith('#');
                const isEcho = line.trim().startsWith('echo');
                const isSed = line.trim().startsWith('sed');

                let lineClass = 'text-slate-300';
                if (isComment) lineClass = 'text-slate-500 italic';
                else if (isEcho) lineClass = 'text-cyan-300';
                else if (isSed) lineClass = 'text-amber-300';

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

        {/* Script Explanation */}
        <div className="px-4 py-3 bg-slate-950/70 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>
              {activeTab === 'part1'
                ? 'Adds NekoBox, Modemband, SMS-tool, AdGuardHome & Argon to feeds.conf.default before ./scripts/feeds update -a'
                : 'Swaps default dnsmasq with dnsmasq-full and makes files/etc/uci-defaults/99-expand-emmc.sh executable'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
