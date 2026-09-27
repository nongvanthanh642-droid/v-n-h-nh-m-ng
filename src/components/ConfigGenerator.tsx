import React, { useState } from 'react';
import { Copy, Check, Sliders, CheckSquare, Square, FileText, Sparkles, RefreshCw } from 'lucide-react';
import { RouterConfig, generateDotConfig } from '../data/configTemplates';

interface ConfigGeneratorProps {
  config: RouterConfig;
  onChangeConfig: (newCfg: RouterConfig) => void;
}

export const ConfigGenerator: React.FC<ConfigGeneratorProps> = ({
  config,
  onChangeConfig,
}) => {
  const [copied, setCopied] = useState(false);
  const dotConfig = generateDotConfig(config);

  const handleCopy = () => {
    navigator.clipboard.writeText(dotConfig);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFeature = (key: keyof RouterConfig) => {
    onChangeConfig({
      ...config,
      [key]: !config[key],
    });
  };

  return (
    <div className="space-y-6">
      {/* Toggles Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Interactive Firmware Package Customizer
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Qualcomm IPQ6000 (JD Cloud AX1800 Pro / re-cs-07)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Docker & IoT */}
          <div
            onClick={() => toggleFeature('enableDocker')}
            className={`cursor-pointer p-3.5 rounded-xl border transition ${
              config.enableDocker
                ? 'bg-cyan-950/40 border-cyan-700/60 text-cyan-200'
                : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                {config.enableDocker ? (
                  <CheckSquare className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500" />
                )}
              </div>
              <div>
                <span className="text-xs font-semibold text-white">Docker CE & Compose</span>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  luci-app-dockerman, dockerd, compose, cgroups (For Niagara N4 & Node-RED).
                </p>
              </div>
            </div>
          </div>

          {/* Band Lock (modemband) */}
          <div
            onClick={() => toggleFeature('enableModemband')}
            className={`cursor-pointer p-3.5 rounded-xl border transition ${
              config.enableModemband
                ? 'bg-cyan-950/40 border-cyan-700/60 text-cyan-200'
                : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                {config.enableModemband ? (
                  <CheckSquare className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500" />
                )}
              </div>
              <div>
                <span className="text-xs font-semibold text-white">4G Band Lock (modemband)</span>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Force 4G LTE Only & lock preferred bands (B1, B3, B7, B8, B28) via Web UI.
                </p>
              </div>
            </div>
          </div>

          {/* SMS Tool */}
          <div
            onClick={() => toggleFeature('enableSmsTool')}
            className={`cursor-pointer p-3.5 rounded-xl border transition ${
              config.enableSmsTool
                ? 'bg-cyan-950/40 border-cyan-700/60 text-cyan-200'
                : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                {config.enableSmsTool ? (
                  <CheckSquare className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500" />
                )}
              </div>
              <div>
                <span className="text-xs font-semibold text-white">SMS & USSD Tool</span>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  luci-app-sms-tool for receiving 2FA OTP codes & sending USSD balance checks.
                </p>
              </div>
            </div>
          </div>

          {/* NekoBox (Sing-box) */}
          <div
            onClick={() => toggleFeature('enableNekobox')}
            className={`cursor-pointer p-3.5 rounded-xl border transition ${
              config.enableNekobox
                ? 'bg-cyan-950/40 border-cyan-700/60 text-cyan-200'
                : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                {config.enableNekobox ? (
                  <CheckSquare className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500" />
                )}
              </div>
              <div>
                <span className="text-xs font-semibold text-white">NekoBox (Sing-box core)</span>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  High-speed SNI bypass, custom routing rules, and cellular gateway proxying.
                </p>
              </div>
            </div>
          </div>

          {/* AdGuard Home */}
          <div
            onClick={() => toggleFeature('enableAdguard')}
            className={`cursor-pointer p-3.5 rounded-xl border transition ${
              config.enableAdguard
                ? 'bg-cyan-950/40 border-cyan-700/60 text-cyan-200'
                : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                {config.enableAdguard ? (
                  <CheckSquare className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500" />
                )}
              </div>
              <div>
                <span className="text-xs font-semibold text-white">AdGuard Home</span>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  luci-app-adguardhome: Network-wide ad-blocking and privacy DNS filter.
                </p>
              </div>
            </div>
          </div>

          {/* Tailscale */}
          <div
            onClick={() => toggleFeature('enableTailscale')}
            className={`cursor-pointer p-3.5 rounded-xl border transition ${
              config.enableTailscale
                ? 'bg-cyan-950/40 border-cyan-700/60 text-cyan-200'
                : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                {config.enableTailscale ? (
                  <CheckSquare className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500" />
                )}
              </div>
              <div>
                <span className="text-xs font-semibold text-white">Tailscale Mesh VPN</span>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Direct remote SSH, LuCI, and BMS gateway access without public IP or port forwarding.
                </p>
              </div>
            </div>
          </div>

          {/* Mosquitto MQTT */}
          <div
            onClick={() => toggleFeature('enableMqtt')}
            className={`cursor-pointer p-3.5 rounded-xl border transition ${
              config.enableMqtt
                ? 'bg-cyan-950/40 border-cyan-700/60 text-cyan-200'
                : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                {config.enableMqtt ? (
                  <CheckSquare className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500" />
                )}
              </div>
              <div>
                <span className="text-xs font-semibold text-white">Mosquitto MQTT Broker & Client</span>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  mosquitto-ssl for local IoT telemetry and BACnet/Modbus to MQTT bridge.
                </p>
              </div>
            </div>
          </div>

          {/* Dnsmasq-full replacement */}
          <div
            onClick={() => toggleFeature('enableDnsmasqFull')}
            className={`cursor-pointer p-3.5 rounded-xl border transition ${
              config.enableDnsmasqFull
                ? 'bg-cyan-950/40 border-cyan-700/60 text-cyan-200'
                : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                {config.enableDnsmasqFull ? (
                  <CheckSquare className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500" />
                )}
              </div>
              <div>
                <span className="text-xs font-semibold text-white">Replace with dnsmasq-full</span>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Removes basic dnsmasq, enables full DNSSEC, ipset, and nftset support.
                </p>
              </div>
            </div>
          </div>

          {/* Vietnamese Language */}
          <div
            onClick={() => toggleFeature('enableVietnamese')}
            className={`cursor-pointer p-3.5 rounded-xl border transition ${
              config.enableVietnamese
                ? 'bg-cyan-950/40 border-cyan-700/60 text-cyan-200'
                : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                {config.enableVietnamese ? (
                  <CheckSquare className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500" />
                )}
              </div>
              <div>
                <span className="text-xs font-semibold text-white">Vietnamese (Tiếng Việt)</span>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  luci-i18n-base-vi, luci-i18n-mwan3-vi, and translations for web interface.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* LAN IP & Partition Settings */}
        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Default Router LAN Gateway IP
            </label>
            <input
              type="text"
              value={config.defaultLanIp}
              onChange={(e) =>
                onChangeConfig({ ...config, defaultLanIp: e.target.value })
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono focus:outline-none focus:border-cyan-500"
              placeholder="192.168.1.1"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Base RootFS Partition Size (MB)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={config.rootfsSizeMb}
                onChange={(e) =>
                  onChangeConfig({
                    ...config,
                    rootfsSizeMb: parseInt(e.target.value) || 1024,
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono focus:outline-none focus:border-cyan-500"
                min={256}
                max={4096}
              />
              <span className="text-slate-400 text-xs whitespace-nowrap">
                (+ 64GB Auto-expand)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Generated .config Code View */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 bg-slate-800/70 border-b border-slate-700/80 gap-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-semibold text-slate-200">
              .config (OpenWrt Configuration Seed)
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-700 text-slate-300">
              {dotConfig.split('\n').filter((l) => l.trim() && !l.startsWith('#')).length} options active
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
                  <span className="text-emerald-400">Copied .config!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy .config</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[500px] overflow-y-auto leading-relaxed">
          <pre className="text-slate-300">
            {dotConfig.split('\n').map((line, idx) => {
              const isComment = line.trim().startsWith('#');
              const isTarget = line.startsWith('CONFIG_TARGET_');

              let lineClass = 'text-slate-300';
              if (isComment) lineClass = 'text-slate-500 italic';
              else if (isTarget) lineClass = 'text-cyan-300 font-semibold';

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
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Contains target qualcommax/ipq60xx, USB modem stacks, cellular drivers, and IoT packages.
          </span>
        </div>
      </div>
    </div>
  );
};
