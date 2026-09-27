import React, { useState } from 'react';
import { Radio, Terminal, Copy, Check, Lock, Unlock, Cpu, Signal, MessageSquare, AlertCircle } from 'lucide-react';

interface BandOption {
  band: number;
  freq: string;
  name: string;
  bit: number;
}

const LTE_BANDS: BandOption[] = [
  { band: 1, freq: '2100 MHz', name: 'B1 (FDD)', bit: 0 },
  { band: 3, freq: '1800 MHz', name: 'B3 (FDD)', bit: 2 },
  { band: 7, freq: '2600 MHz', name: 'B7 (FDD)', bit: 6 },
  { band: 8, freq: '900 MHz', name: 'B8 (FDD)', bit: 7 },
  { band: 20, freq: '800 MHz', name: 'B20 (FDD)', bit: 19 },
  { band: 28, freq: '700 MHz', name: 'B28 (FDD)', bit: 27 },
  { band: 38, freq: '2600 MHz (TDD)', name: 'B38 (TDD)', bit: 37 },
  { band: 40, freq: '2300 MHz (TDD)', name: 'B40 (TDD)', bit: 39 },
  { band: 41, freq: '2500 MHz (TDD)', name: 'B41 (TDD)', bit: 40 },
];

export const CellularTool: React.FC = () => {
  const [modemModel, setModemModel] = useState<'quectel' | 'fibocom'>('quectel');
  const [serialPort, setSerialPort] = useState('/dev/ttyUSB2');
  const [selectedBands, setSelectedBands] = useState<number[]>([1, 3, 7, 8, 28]);
  const [networkMode, setNetworkMode] = useState<'lte_only' | 'auto'>('lte_only');
  const [earfcn, setEarfcn] = useState('1850');
  const [pci, setPci] = useState('324');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleBand = (bandNum: number) => {
    if (selectedBands.includes(bandNum)) {
      if (selectedBands.length > 1) {
        setSelectedBands(selectedBands.filter((b) => b !== bandNum));
      }
    } else {
      setSelectedBands([...selectedBands, bandNum].sort((a, b) => a - b));
    }
  };

  // Calculate hex bitmask for Quectel
  const calculateQuectelHex = (): string => {
    let mask = 0n;
    for (const b of selectedBands) {
      const option = LTE_BANDS.find((x) => x.band === b);
      if (option) {
        mask |= 1n << BigInt(option.bit);
      }
    }
    return mask.toString(16).toLowerCase();
  };

  const quectelHexMask = calculateQuectelHex();

  // AT Commands
  const checkServingCellCmd = `echo 'AT+QENG="servingcell"' | atinout - ${serialPort} -`;
  const forceLteCmd =
    networkMode === 'lte_only'
      ? `echo 'AT+QCFG="nwscanmode",3,1' | atinout - ${serialPort} -`
      : `echo 'AT+QCFG="nwscanmode",0,1' | atinout - ${serialPort} -`;

  const lockBandCmd = `echo 'AT+QCFG="band",0,${quectelHexMask},0,0' | atinout - ${serialPort} -`;
  const cellLockCmd = `echo 'AT+QNWLOCK="common/4g",1,${earfcn},${pci}' | atinout - ${serialPort} -`;
  const cellUnlockCmd = `echo 'AT+QNWLOCK="common/4g",0' | atinout - ${serialPort} -`;

  const ussdCmd = `sms-tool -d ${serialPort} ussd "*101#"`;
  const readSmsCmd = `sms-tool -d ${serialPort} recv`;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/40">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Cellular 4G/LTE Gateway & Cell-Lock Engine
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Band Locking, Tower Cell Lock (EARFCN/PCI), and AT Command Orchestration
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Modem:</span>
              <select
                value={modemModel}
                onChange={(e) => setModemModel(e.target.value as any)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs font-medium focus:outline-none focus:border-cyan-500"
              >
                <option value="quectel">Quectel (EP06 / EM12 / RM500Q)</option>
                <option value="fibocom">Fibocom (FM350 / L850)</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-400">AT Port:</span>
              <input
                type="text"
                value={serialPort}
                onChange={(e) => setSerialPort(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-xs w-28 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Band Selection Matrix */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Select Active LTE Bands to Lock (Quectel Mask: 0x{quectelHexMask})</span>
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setNetworkMode('lte_only')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-lg border transition ${
                  networkMode === 'lte_only'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                Force 4G Only
              </button>
              <button
                onClick={() => setNetworkMode('auto')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-lg border transition ${
                  networkMode === 'auto'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                Auto (4G/3G)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {LTE_BANDS.map((item) => {
              const isSelected = selectedBands.includes(item.band);
              return (
                <button
                  key={item.band}
                  onClick={() => toggleBand(item.band)}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-600/80 text-cyan-200 shadow-md shadow-cyan-950/30'
                      : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-xs text-white">Band {item.band}</span>
                    <span className="text-[10px] font-mono opacity-70">bit {item.bit}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1">{item.freq}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cell Lock (BTS Tower Lock) Inputs */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <div className="flex items-center space-x-2 mb-3">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-200">
              Cell Tower Lock (EARFCN + PCI Locking via AT+QNWLOCK)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Target EARFCN (Carrier Frequency Channel)
              </label>
              <input
                type="text"
                value={earfcn}
                onChange={(e) => setEarfcn(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                placeholder="e.g. 1850 for B3"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Target PCI (Physical Cell ID)
              </label>
              <input
                type="text"
                value={pci}
                onChange={(e) => setPci(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                placeholder="e.g. 324"
              />
            </div>

            <div className="flex items-end">
              <div className="text-[11px] text-slate-400 bg-slate-800/60 p-2 rounded-lg border border-slate-700/60 w-full">
                Use <code>AT+QENG="servingcell"</code> to read your current tower's EARFCN & PCI.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated AT Command Arsenal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Command 1: Serving Cell Query */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                1. Check Current Serving Cell & Signal Stats
              </span>
              <button
                onClick={() => handleCopy(checkServingCellCmd, 'serving')}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                {copiedKey === 'serving' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
              Returns current Band, EARFCN, PCI, RSRP, RSRQ, and SINR from the modem.
            </p>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto">
            {checkServingCellCmd}
          </div>
        </div>

        {/* Command 2: Force 4G Only */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                2. Force 4G LTE Only Mode
              </span>
              <button
                onClick={() => handleCopy(forceLteCmd, 'mode')}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                {copiedKey === 'mode' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
              Disables 2G/3G fallback, keeping the router strictly on high-speed LTE.
            </p>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto">
            {forceLteCmd}
          </div>
        </div>

        {/* Command 3: Apply Band Lock */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                3. Lock Selected 4G Bands ({selectedBands.map((b) => 'B' + b).join(', ')})
              </span>
              <button
                onClick={() => handleCopy(lockBandCmd, 'band')}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                {copiedKey === 'band' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
              Locks modem RF to your selected bands, preventing drops to congested carriers.
            </p>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto">
            {lockBandCmd}
          </div>
        </div>

        {/* Command 4: Lock Specific Cell (BTS) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                4. Lock to Specific BTS Tower (EARFCN {earfcn} + PCI {pci})
              </span>
              <button
                onClick={() => handleCopy(cellLockCmd, 'cell')}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                {copiedKey === 'cell' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
              Forces connection exclusively to your designated mast for lowest ping and jitter.
            </p>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto">
            {cellLockCmd}
          </div>
        </div>
      </div>

      {/* SMS & USSD Commands */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <h4 className="text-xs font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <span>SMS & USSD CLI Utilities (via sms-tool & atinout)</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs font-mono">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
            <div className="flex justify-between items-center text-slate-400 mb-1">
              <span>Send USSD Balance Check (*101#)</span>
              <button
                onClick={() => handleCopy(ussdCmd, 'ussd')}
                className="hover:text-white"
              >
                {copiedKey === 'ussd' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <div className="text-cyan-300">{ussdCmd}</div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
            <div className="flex justify-between items-center text-slate-400 mb-1">
              <span>Read Incoming OTP & SMS Messages</span>
              <button
                onClick={() => handleCopy(readSmsCmd, 'recv')}
                className="hover:text-white"
              >
                {copiedKey === 'recv' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <div className="text-cyan-300">{readSmsCmd}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
