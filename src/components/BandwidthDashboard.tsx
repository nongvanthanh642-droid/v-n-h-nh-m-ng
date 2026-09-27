import React, { useState, useEffect } from 'react';
import {
  Activity,
  ArrowUpRight,
  ArrowDownLeft,
  Users,
  HardDrive,
  Radio,
  Clock,
  Filter,
  Play,
  Pause,
  RefreshCw,
  Gauge,
  AlertTriangle,
  Zap,
  Shield,
  Smartphone,
  Tv,
  Laptop,
  Video,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface DeviceUsage {
  id: string;
  name: string;
  ip: string;
  mac: string;
  deviceType: 'tv' | 'pc' | 'phone' | 'camera';
  downloadMbps: number;
  uploadMbps: number;
  totalDataGB: number;
  currentApp: string;
  color: string;
}

const INITIAL_DEVICES: DeviceUsage[] = [
  {
    id: 'dev-1',
    name: 'Smart TV Phòng Khách',
    ip: '192.168.1.105',
    mac: '44:85:00:2B:91:AA',
    deviceType: 'tv',
    downloadMbps: 18.6,
    uploadMbps: 1.2,
    totalDataGB: 14.8,
    currentApp: 'YouTube 4K Stream',
    color: '#06b6d4', // cyan-500
  },
  {
    id: 'dev-2',
    name: 'Điện thoại Con (Game)',
    ip: '192.168.1.112',
    mac: 'BC:D0:74:18:22:90',
    deviceType: 'phone',
    downloadMbps: 8.4,
    uploadMbps: 2.5,
    totalDataGB: 6.2,
    currentApp: 'TikTok / Garena Lien Quan',
    color: '#f43f5e', // rose-500
  },
  {
    id: 'dev-3',
    name: 'Máy tính Làm Việc (PC)',
    ip: '192.168.1.150',
    mac: '00:E0:4C:68:01:23',
    deviceType: 'pc',
    downloadMbps: 4.8,
    uploadMbps: 3.8,
    totalDataGB: 4.5,
    currentApp: 'GitHub / NekoBox VPN Proxy',
    color: '#a855f7', // purple-500
  },
  {
    id: 'dev-4',
    name: 'Camera Ngoài Sân (IoT)',
    ip: '192.168.1.201',
    mac: '5C:02:67:89:FE:10',
    deviceType: 'camera',
    downloadMbps: 0.4,
    uploadMbps: 2.1,
    totalDataGB: 18.2,
    currentApp: 'RTSP Stream Continuous',
    color: '#10b981', // emerald-500
  },
];

export function BandwidthDashboard() {
  const [devices, setDevices] = useState<DeviceUsage[]>(INITIAL_DEVICES);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'realtime' | '1h' | '24h'>('realtime');
  const [historyData, setHistoryData] = useState<any[]>(() => {
    const points = [];
    const now = new Date();
    for (let i = 12; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 3000);
      const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`;
      points.push({
        time: timeStr,
        tv: Math.floor(14 + Math.random() * 8),
        phone: Math.floor(4 + Math.random() * 7),
        pc: Math.floor(3 + Math.random() * 5),
        camera: 2.2,
        total: Math.floor(24 + Math.random() * 15),
      });
    }
    return points;
  });

  // Simulated Real-Time Traffic Spikes
  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

      // Introduce occasional traffic spikes
      const isSpike = Math.random() > 0.75;
      const spikeDev = Math.floor(Math.random() * 2); // TV or Phone spike

      const tvSpeed = +(isSpike && spikeDev === 0 ? 28 + Math.random() * 12 : 12 + Math.random() * 10).toFixed(1);
      const phoneSpeed = +(isSpike && spikeDev === 1 ? 16 + Math.random() * 8 : 4 + Math.random() * 6).toFixed(1);
      const pcSpeed = +(3 + Math.random() * 4).toFixed(1);
      const camSpeed = +(1.8 + Math.random() * 0.6).toFixed(1);
      const totalSpeed = +(tvSpeed + phoneSpeed + pcSpeed + camSpeed).toFixed(1);

      setHistoryData(prev => [
        ...prev.slice(1),
        {
          time: timeStr,
          tv: tvSpeed,
          phone: phoneSpeed,
          pc: pcSpeed,
          camera: camSpeed,
          total: totalSpeed,
        },
      ]);

      setDevices(prev =>
        prev.map(dev => {
          if (dev.id === 'dev-1') return { ...dev, downloadMbps: tvSpeed };
          if (dev.id === 'dev-2') return { ...dev, downloadMbps: phoneSpeed };
          if (dev.id === 'dev-3') return { ...dev, downloadMbps: pcSpeed };
          if (dev.id === 'dev-4') return { ...dev, uploadMbps: camSpeed };
          return dev;
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  const totalCurrentDown = devices.reduce((sum, d) => sum + d.downloadMbps, 0).toFixed(1);
  const totalCurrentUp = devices.reduce((sum, d) => sum + d.uploadMbps, 0).toFixed(1);
  const totalDataAll = devices.reduce((sum, d) => sum + d.totalDataGB, 0).toFixed(1);

  // Data for Consumers Bar Chart
  const consumerBarData = devices.map(d => ({
    name: d.name.split(' (')[0],
    ip: d.ip,
    Download: d.downloadMbps,
    Upload: d.uploadMbps,
    total: +(d.downloadMbps + d.uploadMbps).toFixed(1),
  })).sort((a, b) => b.total - a.total);

  // Data for Doughnut Share
  const pieData = devices.map(d => ({
    name: d.name.split(' (')[0],
    value: +(d.downloadMbps + d.uploadMbps).toFixed(1),
    color: d.color,
  }));

  const renderDeviceIcon = (type: string) => {
    switch (type) {
      case 'tv': return <Tv className="w-4 h-4 text-cyan-400" />;
      case 'pc': return <Laptop className="w-4 h-4 text-purple-400" />;
      case 'phone': return <Smartphone className="w-4 h-4 text-rose-400" />;
      case 'camera': return <Video className="w-4 h-4 text-emerald-400" />;
      default: return <Smartphone className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-medium border border-cyan-500/30 mb-1">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Realtime Kernel Traffic Inspector (Conntrack & tc)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Bảng Điều Khiển Băng Thông Thời Gian Thực</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                LIVE 2.5s
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Theo dõi trực quan lưu lượng mạng theo từng thiết bị và IP. Phát hiện tức thì các đợt tăng vọt băng thông (Traffic Spikes) và xác định ngay thiết bị ngốn mạng nhất!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                isLiveStreaming
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
              }`}
            >
              {isLiveStreaming ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Tạm Dừng Cập Nhật</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Tiếp Tục Live</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4 Quick Stat Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/90">
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono uppercase">
              <ArrowDownLeft className="w-3 h-3 text-cyan-400" /> Tốc Độ Tải Xuống (Down)
            </span>
            <div className="text-lg sm:text-xl font-bold font-mono text-cyan-400 mt-0.5">
              {totalCurrentDown} <span className="text-xs font-sans text-slate-400 font-normal">Mbps</span>
            </div>
            <span className="text-[9px] text-slate-500">Băng thông 4G LTE Viettel</span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/90">
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono uppercase">
              <ArrowUpRight className="w-3 h-3 text-indigo-400" /> Tốc Độ Tải Lên (Up)
            </span>
            <div className="text-lg sm:text-xl font-bold font-mono text-indigo-400 mt-0.5">
              {totalCurrentUp} <span className="text-xs font-sans text-slate-400 font-normal">Mbps</span>
            </div>
            <span className="text-[9px] text-slate-500">Camera + Upload Cloud</span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/90">
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono uppercase">
              <HardDrive className="w-3 h-3 text-amber-400" /> Tổng Lưu Lượng 4G
            </span>
            <div className="text-lg sm:text-xl font-bold font-mono text-amber-400 mt-0.5">
              {totalDataAll} <span className="text-xs font-sans text-slate-400 font-normal">GB</span>
            </div>
            <span className="text-[9px] text-slate-500">Đã tiêu thụ trong chu kỳ</span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/90">
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono uppercase">
              <Users className="w-3 h-3 text-emerald-400" /> Thiết Bị Trực Tuyến
            </span>
            <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400 mt-0.5">
              {devices.length} <span className="text-xs font-sans text-slate-400 font-normal">Clients</span>
            </div>
            <span className="text-[9px] text-slate-500">100% Phân bổ an toàn</span>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Real-Time Traffic Spikes Area Chart (7 Cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Biểu Đồ Biến Động Lưu Lượng Thời Gian Thực (Traffic Spikes)</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Phát hiện đỉnh sóng đột ngột khi thiết bị tải nặng hoặc xem video 4K
              </p>
            </div>

            <div className="flex items-center gap-1 text-[10px] font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block mr-1" />
              <span className="text-slate-300">Chu kỳ cập nhật 2.5s</span>
            </div>
          </div>

          {/* Recharts Area Chart */}
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorTv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorPhone" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} unit="M" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Tổng Băng Thông"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                />
                <Area
                  type="monotone"
                  dataKey="tv"
                  name="Smart TV (4K)"
                  stroke="#38bdf8"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#colorTv)"
                />
                <Area
                  type="monotone"
                  dataKey="phone"
                  name="Điện Thoại Con"
                  stroke="#f43f5e"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#colorPhone)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-slate-300 font-medium">Bảo Vệ SQM-CAKE:</span>
              <span className="text-slate-400 text-[11px]">Không xảy ra hiện tượng Bufferbloat (Lag/Tăng Ping)</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
              Ping 18ms
            </span>
          </div>
        </div>

        {/* Right Column: Traffic Distribution Doughnut (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Gauge className="w-4 h-4 text-purple-400" />
              <span>Tỷ Lệ Tiêu Thụ Tức Thời</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Phần trăm băng thông phân bổ giữa các máy
            </p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                  formatter={(val: any) => [`${val} Mbps`, 'Tốc độ']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs">
            {devices.map(d => (
              <div key={d.id} className="flex items-center justify-between p-1.5 rounded bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-300 font-medium text-[11px] truncate max-w-[130px]">{d.name.split(' (')[0]}</span>
                </div>
                <span className="text-slate-200 font-mono text-[11px]">
                  {(d.downloadMbps + d.uploadMbps).toFixed(1)} Mbps
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Top Consumers Ranking Table & Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Top Consumers Bar Chart (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Xếp Hạng Thiết Bị Tiêu Thụ Băng Thông Cao Nhất (Top Consumers)</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              So sánh tải Download vs Upload của từng địa chỉ IP
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={consumerBarData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} unit="M" />
                <YAxis dataKey="name" type="category" stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Download" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                <Bar dataKey="Upload" fill="#818cf8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Realtime Device Inspection Table (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-400" />
                <span>Chi Tiết Thiết Bị & Ứng Dụng Đang Chạy (DPI)</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Nhận diện chính xác dịch vụ đang chiếm băng thông
              </p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              Conntrack OK
            </span>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[270px] pr-1">
            {devices.map(dev => (
              <div
                key={dev.id}
                className="bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {renderDeviceIcon(dev.deviceType)}
                    <div>
                      <span className="text-xs font-bold text-white block">{dev.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{dev.ip} • {dev.mac}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-cyan-400 font-mono block">
                      {dev.downloadMbps} <span className="text-[10px] font-normal text-slate-500">Mbps</span>
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">
                      Tổng: {dev.totalDataGB} GB
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px]">
                  <span className="text-slate-400 flex items-center gap-1 font-mono">
                    <Zap className="w-3 h-3 text-amber-400" /> Đang dùng: <strong className="text-slate-200">{dev.currentApp}</strong>
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 font-mono text-[9px]">
                    SQM Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
