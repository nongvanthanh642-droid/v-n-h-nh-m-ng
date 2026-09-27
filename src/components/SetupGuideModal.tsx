import React from 'react';
import { X, CheckCircle2, Terminal, ArrowRight, ShieldCheck, HardDrive, Radio, Layers } from 'lucide-react';

interface SetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lanIp: string;
}

export const SetupGuideModal: React.FC<SetupGuideModalProps> = ({
  isOpen,
  onClose,
  lanIp,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/40">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Step-by-Step CI Compilation & Router Flashing Guide
              </h3>
              <p className="text-xs text-slate-400">
                JD Cloud AX1800 Pro (Qualcomm IPQ6000 • 64GB eMMC)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-xs text-slate-300">
          {/* Step 1 */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-semibold text-sm">
              <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-700 flex items-center justify-center text-xs">
                1
              </span>
              <span>Create GitHub Repository & Push Files</span>
            </div>
            <p className="text-slate-400 pl-8 leading-relaxed">
              Create a new repository on your GitHub account (e.g., <code>openwrt-jdcloud-ax1800pro</code>).
              Extract the downloaded ZIP package or push the files with this exact directory layout:
            </p>
            <div className="ml-8 bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-slate-300">
              ├── .github/<br />
              │&nbsp;&nbsp; └── workflows/<br />
              │&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; └── build-openwrt.yml<br />
              ├── diy-part1.sh<br />
              ├── diy-part2.sh<br />
              ├── .config<br />
              ├── files/<br />
              │&nbsp;&nbsp; └── etc/<br />
              │&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; └── uci-defaults/<br />
              │&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ├── 98-custom-settings.sh<br />
              │&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; └── 99-expand-emmc.sh<br />
              └── README.md
            </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-semibold text-sm">
              <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-700 flex items-center justify-center text-xs">
                2
              </span>
              <span>Trigger GitHub Actions Build</span>
            </div>
            <p className="text-slate-400 pl-8 leading-relaxed">
              1. In your GitHub repository, click the <strong>Actions</strong> tab.<br />
              2. On the left sidebar, click <strong>"Build OpenWrt for JD Cloud AX1800 Pro"</strong>.<br />
              3. Click <strong>"Run workflow"</strong>, ensure branch is <code>master</code>, and click the green <strong>"Run workflow"</strong> button.
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
              <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-700 flex items-center justify-center text-xs">
                3
              </span>
              <span>Download Compiled .bin Artifact</span>
            </div>
            <p className="text-slate-400 pl-8 leading-relaxed">
              When the workflow completes (green checkmark), click into the workflow run. Scroll down to the <strong>Artifacts</strong> section:
            </p>
            <div className="ml-8 bg-slate-950 border border-slate-800 rounded-lg p-3 text-[11px] font-mono text-emerald-300">
              OpenWrt_JDCloud_AX1800Pro_64GB_YYYYMMDD.zip<br />
              └── openwrt-qualcommax-ipq60xx-jdcloud_re-cs-07-squashfs-sysupgrade.bin
            </div>
          </div>

          {/* Step 4 */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-sm">
              <span className="w-6 h-6 rounded-full bg-amber-950 border border-amber-700 flex items-center justify-center text-xs">
                4
              </span>
              <span>Flash to JD Cloud AX1800 Pro</span>
            </div>
            <div className="ml-8 space-y-3">
              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                <span className="font-semibold text-white block mb-1">
                  Method A: Via U-Boot Web Failsafe (Recommended)
                </span>
                <ol className="list-decimal list-inside space-y-1 text-slate-300">
                  <li>Unplug router power cable.</li>
                  <li>Press and hold the physical <strong>RESET</strong> button on the back.</li>
                  <li>Plug in power cable while continuing to hold RESET for 8–10 seconds until LED blinks rapidly.</li>
                  <li>Set your PC Ethernet IP manually to <code>192.168.1.2</code> (Subnet <code>255.255.255.0</code>).</li>
                  <li>Open browser and go to <code>http://192.168.1.1</code>.</li>
                  <li>Upload the <code>*sysupgrade.bin</code> file and wait 3 minutes for it to flash and reboot.</li>
                </ol>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                <span className="font-semibold text-white block mb-1">
                  Method B: Via Existing LuCI Web Interface
                </span>
                <p className="text-slate-300">
                  Go to <strong>System -&gt; Backup / Flash Firmware</strong> -&gt; Flash new firmware image -&gt; Select the <code>*sysupgrade.bin</code> file -&gt; Uncheck "Keep settings" for a clean first boot -&gt; Flash.
                </p>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-semibold text-sm">
              <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-700 flex items-center justify-center text-xs">
                5
              </span>
              <span>Verify 64GB eMMC & Start 4G/Docker Stack</span>
            </div>
            <p className="text-slate-400 pl-8 leading-relaxed">
              Once booted, log into LuCI at <code>http://{lanIp}</code> (Default login: <code>root</code> / no password).
              Open SSH terminal to verify storage:
            </p>
            <div className="ml-8 bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-cyan-300 text-[11px]">
              df -h /overlay
            </div>
            <p className="text-slate-400 pl-8 leading-relaxed mt-1">
              You will see ~58GB available on <code>/overlay</code>! Docker and Niagara N4 will now have ample space.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 border-t border-slate-800 px-6 py-3.5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition"
          >
            Got it, Let's Build!
          </button>
        </div>
      </div>
    </div>
  );
};
