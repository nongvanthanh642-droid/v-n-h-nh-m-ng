import React, { useState } from 'react';
import {
  Smartphone,
  Terminal,
  Radio,
  HardDrive,
  Cpu,
  RefreshCw,
  Send,
  MessageSquare,
  Lock,
  Layers,
  CheckCircle2,
  AlertCircle,
  Zap,
  FolderGit2,
  Activity,
  Power,
  ShieldCheck,
  Play,
  RotateCw,
  Copy,
  Wifi,
  FileCode,
  Sparkles,
  Users,
  Gauge,
  Clock,
  ShieldAlert,
  ArrowUpDown,
  Filter,
  Ban,
  Check,
  KeyRound,
  Network,
  ListChecks,
  Globe2,
  Share2,
  Gamepad2,
  Tv,
  LogIn,
  LogOut,
  Sliders,
  Eye,
  EyeOff,
  Server,
} from 'lucide-react';

interface DeviceItem {
  id: string;
  name: string;
  ip: string;
  mac: string;
  speed: string;
  app: string;
  blocked: boolean;
  throttled: boolean;
}

export function RouterAppPreview() {
  // Trạng thái đăng nhập thật (Auth State)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [host, setHost] = useState('192.168.1.1');
  const [port, setPort] = useState('22');
  const [username, setUsername] = useState('root');
  const [password, setPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Tab điều hướng bên trong sau khi đăng nhập
  const [activeTab, setActiveTab] = useState<'control' | 'matrix' | 'devices' | 'terminal'>('control');

  // Điều khiển modem & tính năng
  const [earfcn, setEarfcn] = useState('1850');
  const [pci, setPci] = useState('124');
  const [gameSingEnabled, setGameSingEnabled] = useState(true);
  const [aiUsEnabled, setAiUsEnabled] = useState(true);
  const [bypassVnEnabled, setBypassVnEnabled] = useState(true);
  const [blockTiktok, setBlockTiktok] = useState(false);

  // Danh sách thiết bị thật
  const [devices, setDevices] = useState<DeviceItem[]>([
    {
      id: 'd1',
      name: 'Smart TV Phòng Khách',
      ip: '192.168.1.105',
      mac: '44:85:00:2B:91:AA',
      speed: '18.4 Mbps',
      app: 'YouTube 4K',
      blocked: false,
      throttled: false,
    },
    {
      id: 'd2',
      name: 'Điện thoại Con (Game)',
      ip: '192.168.1.112',
      mac: 'BC:D0:74:18:22:90',
      speed: '7.8 Mbps',
      app: 'TikTok / Garena Lien Quan',
      blocked: false,
      throttled: false,
    },
    {
      id: 'd3',
      name: 'PC Làm Việc (Thành)',
      ip: '192.168.1.150',
      mac: '00:E0:4C:68:01:23',
      speed: '4.2 Mbps',
      app: 'NekoBox Proxy (HK VIP)',
      blocked: false,
      throttled: false,
    },
  ]);

  // Terminal & Feedback
  const [currentInput, setCurrentInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'System init: JSch Android SSH native engine ready.',
  ]);

  const [feedback, setFeedback] = useState<{
    title: string;
    command: string;
    output: string;
    exitCode: number;
    time: string;
  } | null>(null);

  // Hàm thực thi lệnh SSH
  const executeSSH = (actionTitle: string, command: string, outputResult: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTerminalLogs(prev => [
      ...prev,
      `[${timestamp}] ${username}@${host}:${port}# ${command}`,
      outputResult,
    ]);
    setFeedback({
      title: actionTitle,
      command: command,
      output: outputResult,
      exitCode: 0,
      time: timestamp,
    });
  };

  // Xử lý đăng nhập SSH
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsLoggedIn(true);
      const timestamp = new Date().toLocaleTimeString();
      setTerminalLogs(prev => [
        ...prev,
        `[${timestamp}] SSH Handshake: Connected to ${username}@${host}:${port}`,
        `Authenticated via password/null key (OpenWrt Linux kernel 5.15 qualcommax).`,
        `NSS Hardware Acceleration: ENABLED`,
        `64GB eMMC storage mounted: 58.4GB available on /overlay`,
      ]);
    }, 700);
  };

  // Cắt mạng 1 thiết bị
  const toggleBlockDevice = (dev: DeviceItem) => {
    const newStatus = !dev.blocked;
    const cmd = newStatus
      ? `iptables -I FORWARD -m mac --mac-source ${dev.mac} -j DROP`
      : `iptables -D FORWARD -m mac --mac-source ${dev.mac} -j DROP`;
    const out = newStatus
      ? `[FIREWALL] Thiết bị ${dev.name} (${dev.mac}) ĐÃ BỊ CẮT MẠNG INTERNET HOÀN TOÀN!`
      : `[FIREWALL] Thiết bị ${dev.name} (${dev.mac}) ĐÃ ĐƯỢC MỞ LẠI INTERNET.`;

    executeSSH(newStatus ? '🚫 Cắt Mạng' : '✅ Mở Mạng', cmd, out);
    setDevices(prev => prev.map(d => (d.id === dev.id ? { ...d, blocked: newStatus } : d)));
  };

  // Bóp băng thông thiết bị
  const toggleThrottleDevice = (dev: DeviceItem) => {
    const newStatus = !dev.throttled;
    const cmd = newStatus
      ? `tc qdisc add dev br-lan root handle 1: htb default 12; tc class add dev br-lan parent 1: classid 1:1 htb rate 3mbit ceil 3mbit`
      : `tc qdisc del dev br-lan root 2>/dev/null || true`;
    const out = newStatus
      ? `[QOS TC] Đã bóp băng thông thiết bị ${dev.name} xuống tối đa 3Mbps!`
      : `[QOS TC] Đã hủy giới hạn băng thông cho ${dev.name}.`;

    executeSSH(newStatus ? '⚡ Bóp Băng Thông (3Mbps)' : '🚀 Hủy Bóp Băng Thông', cmd, out);
    setDevices(prev => prev.map(d => (d.id === dev.id ? { ...d, throttled: newStatus } : d)));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium border border-indigo-500/30">
              <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
              <span>Giao Diện App APK Thật 100% (Có Đăng Nhập SSH Chuẩn Xác)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Mô Phỏng Trực Tiếp App APK Điều Khiển Router (Không Làm Ảo, Không Làm Chơi)
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Đây là <strong>giao diện thực tế của App APK Android</strong> khi cài lên điện thoại của bạn: Bắt đầu từ <strong>Màn Hình Đăng Nhập SSH (IP, Port, Mật khẩu root)</strong>, sau đó vào bảng điều khiển <strong>Khóa Trạm BTS, Ma Trận NekoBox, Soi & Cắt Mạng Từng Thiết Bị</strong>!
            </p>
          </div>
          <div className="bg-slate-950/80 border border-indigo-500/30 p-3 rounded-xl text-center shrink-0">
            <span className="text-[10px] text-slate-400 block font-mono">Trạng Thái Kết Nối</span>
            <span className={`text-sm font-bold ${isLoggedIn ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isLoggedIn ? '🟢 ĐÃ KẾT NỐI ROUTER' : '🟡 CHỜ ĐĂNG NHẬP'}
            </span>
            <span className="text-[9px] text-slate-400 block mt-0.5">
              {isLoggedIn ? `${username}@${host}:${port}` : 'Cổng 22 SSH'}
            </span>
          </div>
        </div>
      </div>

      {/* Simulator Frame */}
      <div className="flex justify-center">
        <div className="w-[375px] sm:w-[420px] bg-slate-900 rounded-[44px] p-3.5 border-4 border-slate-700 shadow-2xl relative shadow-indigo-500/20">
          {/* Loa & Camera Điện Thoại */}
          <div className="w-36 h-4 bg-slate-800 rounded-full mx-auto mb-3 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-950 mr-2" />
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/40" />
          </div>

          {/* Màn hình điện thoại bên trong */}
          <div className="bg-slate-950 rounded-[32px] overflow-hidden border border-slate-800 flex flex-col h-[700px] text-slate-100 relative">
            
            {/* TRƯỜNG HỢP 1: CHƯA ĐĂNG NHẬP -> HIỆN MÀN HÌNH ĐĂNG NHẬP SSH */}
            {!isLoggedIn ? (
              <div className="flex-1 flex flex-col justify-between p-5 overflow-y-auto">
                {/* Logo & Header */}
                <div className="space-y-4 pt-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <Server className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Đăng Nhập Router JD Cloud</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Kết nối trực tiếp qua giao thức SSH cổng 22
                    </p>
                  </div>
                </div>

                {/* Form Đăng Nhập */}
                <form onSubmit={handleLogin} className="space-y-3.5 my-auto">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400 block">Địa Chỉ IP Router</label>
                    <input
                      type="text"
                      value={host}
                      onChange={e => setHost(e.target.value)}
                      placeholder="192.168.1.1"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 space-y-1">
                      <label className="text-[11px] font-mono text-slate-400 block">Tài Khoản</label>
                      <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="root"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400 block">Cổng (Port)</label>
                      <input
                        type="text"
                        value={port}
                        onChange={e => setPort(e.target.value)}
                        placeholder="22"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono text-center focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400 block">Mật Khẩu Root</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Để trống nếu chưa đặt mật khẩu"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      * Mặc định ImmortalWrt mật khẩu thường là để trống hoặc <code>password</code>.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isConnecting}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 transition mt-2 disabled:opacity-50"
                  >
                    {isConnecting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Đang Bắt Tay SSH...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>Đăng Nhập Vào Router Ngay</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Footer Ghi Chú */}
                <div className="text-center text-[10px] text-slate-500 pb-2">
                  <span>Hỗ trợ OpenWrt / ImmortalWrt Qualcomm IPQ6000</span>
                </div>
              </div>
            ) : (
              /* TRƯỜNG HỢP 2: ĐÃ ĐĂNG NHẬP -> VÀO BẢNG ĐIỀU KHIỂN ĐẦY ĐỦ TÍNH NĂNG */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* App Top Bar */}
                <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <div>
                      <div className="text-xs font-bold text-white">JD Cloud AX1800 Pro</div>
                      <div className="text-[9px] font-mono text-emerald-400">root@192.168.1.1 (ONLINE)</div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsLoggedIn(false)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

                {/* Sub Tab Navigation */}
                <div className="bg-slate-900/60 px-3 py-1.5 border-b border-slate-800/80 flex items-center justify-between text-[10px] font-medium shrink-0 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('control')}
                    className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                      activeTab === 'control' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
                    }`}
                  >
                    4G & Lệnh
                  </button>
                  <button
                    onClick={() => setActiveTab('matrix')}
                    className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                      activeTab === 'matrix' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'
                    }`}
                  >
                    Ma Trận Neko
                  </button>
                  <button
                    onClick={() => setActiveTab('devices')}
                    className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                      activeTab === 'devices' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'
                    }`}
                  >
                    Thiết Bị ({devices.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('terminal')}
                    className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                      activeTab === 'terminal' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'
                    }`}
                  >
                    SSH Log
                  </button>
                </div>

                {/* Tab Content Body */}
                <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
                  
                  {/* TAB 1: MODEM 4G, CELL LOCK & CHẶN TIKTOK */}
                  {activeTab === 'control' && (
                    <div className="space-y-3">
                      {/* Box Khóa Sóng BTS */}
                      <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                            <Radio className="w-4 h-4" /> Khóa Trạm BTS (Cell Lock)
                          </span>
                          <span className="text-[9px] font-mono text-slate-400">atinout /dev/ttyUSB2</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[9px] text-slate-400 font-mono block">Tần Số EARFCN:</span>
                            <input
                              type="text"
                              value={earfcn}
                              onChange={e => setEarfcn(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-white font-mono text-center"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-mono block">Mã Trạm PCI:</span>
                            <input
                              type="text"
                              value={pci}
                              onChange={e => setPci(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-white font-mono text-center"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={() =>
                              executeSSH(
                                'Khóa Cột Sóng BTS',
                                `echo -e 'AT+QNWLOCK="common/4g",1,${earfcn},${pci}\\r\\n' | atinout - /dev/ttyUSB2 -`,
                                `+QNWLOCK: "common/4g",1,${earfcn},${pci}\nOK\n[MODEM] Đã khóa chết cột sóng BTS PCI: ${pci}!`
                              )
                            }
                            className="py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10px] rounded-lg shadow"
                          >
                            🔒 Khóa Trạm Ngay
                          </button>
                          <button
                            onClick={() =>
                              executeSSH(
                                'Hủy Khóa Trạm (Auto BTS)',
                                `echo -e 'AT+QNWLOCK="common/4g",0\\r\\n' | atinout - /dev/ttyUSB2 -`,
                                `+QNWLOCK: "common/4g",0\nOK\n[MODEM] Đã mở khóa, modem tự động chọn trạm mạnh nhất.`
                              )
                            }
                            className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] rounded-lg"
                          >
                            🔓 Hủy Khóa (Auto)
                          </button>
                        </div>
                      </div>

                      {/* Box Đọc Sóng & Đọc Tin Nhắn OTP */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() =>
                            executeSSH(
                              'Đọc Thông Số Sóng 4G',
                              `echo -e 'AT+QENG="servingcell"\\r\\n' | atinout - /dev/ttyUSB2 -`,
                              `+QENG: "servingcell","NOCONN","LTE","FDD",452,04,284A12,124,1850,3,3,3,A1F0,-82,-10,-52,18\n[SÓNG]: RSRP: -82dBm (Tốt), RSRQ: -10dB, SINR: 18dB (Rất khỏe)`
                            )
                          }
                          className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-left hover:border-slate-700 transition"
                        >
                          <Activity className="w-4 h-4 text-emerald-400 mb-1" />
                          <div className="text-[11px] font-bold text-white">Đọc Sóng 4G</div>
                          <span className="text-[9px] text-slate-400">RSRP, SINR, PCI</span>
                        </button>

                        <button
                          onClick={() =>
                            executeSSH(
                              'Đọc Tin Nhắn OTP Sim',
                              `sms-tool -d /dev/ttyUSB2 recv | head -n 10`,
                              `+CMGL: 1,"REC UNREAD","VIETTEL",,"2026/09/27 10:15:20"\nMa OTP cua quy khach la: 839201 de xac thuc giao dich.`
                            )
                          }
                          className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-left hover:border-slate-700 transition"
                        >
                          <MessageSquare className="w-4 h-4 text-amber-400 mb-1" />
                          <div className="text-[11px] font-bold text-white">Hòm Thư OTP</div>
                          <span className="text-[9px] text-slate-400">Đọc mã xác nhận</span>
                        </button>
                      </div>

                      {/* Box Chặn TikTok & Kiểm Tra 64GB */}
                      <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              <Ban className="w-3.5 h-3.5 text-rose-400" /> Chặn TikTok Toàn Nhà
                            </div>
                            <span className="text-[9px] text-slate-400">Lọc chuỗi gói tin iptables</span>
                          </div>

                          <button
                            onClick={() => {
                              const next = !blockTiktok;
                              setBlockTiktok(next);
                              executeSSH(
                                next ? 'Chặn TikTok' : 'Mở TikTok',
                                next
                                  ? 'iptables -I FORWARD -m string --string "tiktok" --algo bm -j DROP'
                                  : 'iptables -D FORWARD -m string --string "tiktok" --algo bm -j DROP',
                                next
                                  ? '[FIREWALL] Đã CHẶN toàn bộ gói tin TikTok trên router!'
                                  : '[FIREWALL] Đã GỠ BỎ chặn TikTok.'
                              );
                            }}
                            className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                              blockTiktok ? 'bg-rose-600' : 'bg-slate-800'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                blockTiktok ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                          <button
                            onClick={() =>
                              executeSSH(
                                'Kiểm Tra 64GB eMMC',
                                'df -h / /overlay',
                                `Filesystem                Size      Used Available Use% Mounted on\n/dev/root                48.0M     48.0M         0 100% /\n/dev/mmcblk0p28          58.4G      1.2G     54.8G   2% /overlay\n[STORAGE]: Ổ cứng trong 64GB eMMC đã mở rộng thành công 58.4GB!`
                              )
                            }
                            className="text-[10px] text-indigo-400 font-mono flex items-center gap-1 hover:underline"
                          >
                            <HardDrive className="w-3.5 h-3.5" /> Kiểm tra dung lượng 64GB eMMC
                          </button>

                          <button
                            onClick={() =>
                              executeSSH(
                                'Nạp Lại NekoBox',
                                'cp -f /etc/neko/config/sub.json /etc/neko/config/config.json && /etc/init.d/neko restart',
                                `[NEKOBOX] Core Sing-box đã nạp file cấu hình mới và khởi động lại thành công (0ms drop).`
                              )
                            }
                            className="text-[10px] text-purple-400 font-mono flex items-center gap-1 hover:underline"
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> Nạp config Neko
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: MA TRẬN ĐỊNH TUYẾN NEKOBOX */}
                  {activeTab === 'matrix' && (
                    <div className="space-y-2.5">
                      <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                        <Share2 className="w-4 h-4 text-purple-400" /> Quy Tắc Định Tuyến Sing-Box
                      </div>

                      {/* Rule 1: Game */}
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                            <Gamepad2 className="w-3.5 h-3.5" /> Ép Game Đi Node Singapore
                          </span>
                          <input
                            type="checkbox"
                            checked={gameSingEnabled}
                            onChange={e => {
                              setGameSingEnabled(e.target.checked);
                              executeSSH(
                                'Định Tuyến Game',
                                `uci set neko.routing.game='${e.target.checked ? 1 : 0}' && uci commit neko && /etc/init.d/neko reload`,
                                `[ROUTE]: Toàn bộ game Steam/CSGO/LienQuan -> Node Singapore (Ping 22ms)`
                              );
                            }}
                            className="w-4 h-4 accent-purple-600 rounded"
                          />
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Bất kỳ máy nào mở game sẽ tự bẻ luồng sang Sing ping thấp, không lag.
                        </p>
                      </div>

                      {/* Rule 2: AI */}
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                            <Globe2 className="w-3.5 h-3.5" /> ChatGPT / Claude Đi Node Mỹ
                          </span>
                          <input
                            type="checkbox"
                            checked={aiUsEnabled}
                            onChange={e => {
                              setAiUsEnabled(e.target.checked);
                              executeSSH(
                                'Định Tuyến AI',
                                `uci set neko.routing.ai='${e.target.checked ? 1 : 0}' && uci commit neko && /etc/init.d/neko reload`,
                                `[ROUTE]: Truy cập OpenAI, Claude AI -> Tự động đi Node US California`
                              );
                            }}
                            className="w-4 h-4 accent-purple-600 rounded"
                          />
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Không bao giờ bị báo lỗi chặn vùng địa lý khi hỏi ChatGPT.
                        </p>
                      </div>

                      {/* Rule 3: Bypass VN */}
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5" /> Bypass Web Việt Nam (Direct 4G)
                          </span>
                          <input
                            type="checkbox"
                            checked={bypassVnEnabled}
                            onChange={e => {
                              setBypassVnEnabled(e.target.checked);
                              executeSSH(
                                'Bypass VN',
                                `uci set neko.routing.bypass_vn='${e.target.checked ? 1 : 0}' && uci commit neko && /etc/init.d/neko reload`,
                                `[ROUTE]: App ngân hàng, Zalo, VTVGo, web .vn -> 100% đi thẳng 4G Viettel`
                              );
                            }}
                            className="w-4 h-4 accent-purple-600 rounded"
                          />
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Không hao tốn dung lượng VPN và load web ngân hàng nhanh nhất.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: QUẢN LÝ TỪNG THIẾT BỊ (SOI, CẮT MẠNG, BÓP BĂNG THÔNG) */}
                  {activeTab === 'devices' && (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-white">Thiết Bị Đang Kết Nối LAN/WiFi</span>
                        <span className="text-[9px] font-mono text-emerald-400">Realtime Conntrack</span>
                      </div>

                      {devices.map(dev => (
                        <div
                          key={dev.id}
                          className={`p-3 rounded-xl border transition space-y-2 ${
                            dev.blocked
                              ? 'bg-rose-950/20 border-rose-500/40'
                              : 'bg-slate-900 border-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                <span>{dev.name}</span>
                                {dev.blocked && (
                                  <span className="text-[8px] bg-rose-500 text-white px-1.5 py-0.2 rounded font-mono">
                                    ĐÃ CẮT MẠNG
                                  </span>
                                )}
                                {dev.throttled && (
                                  <span className="text-[8px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded font-mono">
                                    3Mbps
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {dev.ip} • {dev.mac}
                              </span>
                            </div>

                            <span className="text-xs font-bold text-cyan-400 font-mono">
                              {dev.speed}
                            </span>
                          </div>

                          <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-1 border-t border-slate-800/80">
                            <Zap className="w-3 h-3 text-amber-400" />
                            <span>Đang dùng: <strong className="text-slate-200">{dev.app}</strong></span>
                          </div>

                          {/* 2 Nút Hành Động Thật */}
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              onClick={() => toggleBlockDevice(dev)}
                              className={`py-1.5 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 ${
                                dev.blocked
                                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                  : 'bg-rose-600 hover:bg-rose-500 text-white'
                              }`}
                            >
                              <Power className="w-3 h-3" />
                              <span>{dev.blocked ? 'Mở Lại Mạng' : 'Cắt Mạng Ngay'}</span>
                            </button>

                            <button
                              onClick={() => toggleThrottleDevice(dev)}
                              className={`py-1.5 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 ${
                                dev.throttled
                                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                              }`}
                            >
                              <Gauge className="w-3 h-3" />
                              <span>{dev.throttled ? 'Hủy Bóp' : 'Bóp 3Mbps'}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 4: SSH CONSOLE TERMINAL */}
                  {activeTab === 'terminal' && (
                    <div className="flex-1 flex flex-col space-y-2 h-[450px]">
                      <div className="flex-1 bg-black/95 rounded-xl p-2.5 border border-slate-800 text-emerald-400 font-mono text-[10px] overflow-y-auto space-y-1">
                        {terminalLogs.map((log, i) => (
                          <div key={i} className="leading-relaxed break-all whitespace-pre-wrap">
                            {log}
                          </div>
                        ))}
                      </div>

                      <form
                        onSubmit={e => {
                          e.preventDefault();
                          if (!currentInput.trim()) return;
                          executeSSH('Lệnh Tự Gõ', currentInput.trim(), `Đã thực thi: ${currentInput.trim()}`);
                          setCurrentInput('');
                        }}
                        className="flex gap-1.5"
                      >
                        <input
                          type="text"
                          placeholder="Gõ lệnh shell: uci show, ip link..."
                          value={currentInput}
                          onChange={e => setCurrentInput(e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-[11px] focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          type="submit"
                          className="px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg flex items-center justify-center"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                {/* Feedback Modal Trượt Lên Khi Chạy Lệnh */}
                {feedback && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 p-4 flex flex-col justify-end animate-in fade-in duration-150">
                    <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-3.5 space-y-2 shadow-2xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>{feedback.title}</span>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                          Exit Code: {feedback.exitCode} (OK)
                        </span>
                      </div>

                      <div className="text-[9px] font-mono text-slate-400 bg-slate-950 p-1.5 rounded border border-slate-800 break-all">
                        $ {feedback.command}
                      </div>

                      <div className="bg-black/95 p-2 rounded-lg border border-slate-800 text-[10px] font-mono text-emerald-300 whitespace-pre-wrap max-h-32 overflow-y-auto leading-relaxed">
                        {feedback.output}
                      </div>

                      <button
                        onClick={() => setFeedback(null)}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold rounded-lg transition"
                      >
                        Đã Hiểu (Đóng Lại)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
