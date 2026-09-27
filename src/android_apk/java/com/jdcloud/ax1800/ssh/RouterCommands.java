package com.jdcloud.ax1800.ssh;

/**
 * Danh sách toàn bộ lệnh Shell chuẩn OpenWrt / ImmortalWrt
 * Tương thích trực tiếp với các tính năng đã build cho JD Cloud AX1800 Pro
 */
public class RouterCommands {

    // ==========================================
    // 1. MODEM 4G LTE & KHÓA TRẠM BTS (CELL LOCK)
    // ==========================================
    
    /**
     * Khóa sóng cột BTS theo mã PCI và tần số EARFCN chống nhảy trạm
     * Dùng công cụ atinout bắn lệnh AT qua cổng modem ttyUSB2
     */
    public static String lockBtsCell(int earfcn, int pci) {
        return "echo -e 'AT+QNWLOCK=\"common/4g\",1," + earfcn + "," + pci + "\\r\\n' | atinout - /dev/ttyUSB2 -";
    }

    /**
     * Mở khóa trạm BTS (để modem tự động chọn trạm mạnh nhất)
     */
    public static String unlockBtsCell() {
        return "echo -e 'AT+QNWLOCK=\"common/4g\",0\\r\\n' | atinout - /dev/ttyUSB2 -";
    }

    /**
     * Kiểm tra thông số sóng trạm hiện tại: RSRP, RSRQ, SINR, PCI, CellID
     */
    public static String getSignalInfo() {
        return "echo -e 'AT+QENG=\"servingcell\"\\r\\n' | atinout - /dev/ttyUSB2 -";
    }

    /**
     * Đọc tin nhắn SMS mới nhất (để lấy mã OTP ngân hàng / nhà mạng)
     */
    public static String readSmsOtp() {
        return "sms-tool -d /dev/ttyUSB2 recv | head -n 20";
    }

    // ==========================================
    // 2. MA TRẬN ĐỊNH TUYẾN NEKOBOX (SING-BOX)
    // ==========================================

    /**
     * Bật/tắt phân luồng theo Game (bẻ luồng qua Node Singapore ping 22ms)
     */
    public static String setGameRouting(boolean enable) {
        if (enable) {
            return "uci set neko.routing.game_proxy='1' && uci commit neko && /etc/init.d/neko reload";
        } else {
            return "uci set neko.routing.game_proxy='0' && uci commit neko && /etc/init.d/neko reload";
        }
    }

    /**
     * Bật/tắt phân luồng AI (ChatGPT, Claude AI đi qua Node Mỹ)
     */
    public static String setAiRouting(boolean enable) {
        if (enable) {
            return "uci set neko.routing.ai_us_node='1' && uci commit neko && /etc/init.d/neko reload";
        } else {
            return "uci set neko.routing.ai_us_node='0' && uci commit neko && /etc/init.d/neko reload";
        }
    }

    /**
     * Chép đè file cấu hình config.json của NekoBox và khởi động lại core
     */
    public static String reloadNekoConfig() {
        return "cp -f /etc/neko/config/sub.json /etc/neko/config/config.json && /etc/init.d/neko restart";
    }

    // ==========================================
    // 3. QUẢN LÝ BĂNG THÔNG, CHẶN APP & MÁY CON
    // ==========================================

    /**
     * Chặn ứng dụng TikTok trên toàn mạng hoặc máy con
     */
    public static String blockTikTok(boolean block) {
        if (block) {
            return "iptables -I FORWARD -m string --string \"tiktok\" --algo bm -j DROP";
        } else {
            return "iptables -D FORWARD -m string --string \"tiktok\" --algo bm -j DROP 2>/dev/null || true";
        }
    }

    /**
     * Cắt Internet tức thì một thiết bị theo địa chỉ MAC
     */
    public static String blockDeviceByMac(String macAddress) {
        return "iptables -I FORWARD -m mac --mac-source " + macAddress + " -j DROP";
    }

    /**
     * Mở lại mạng cho thiết bị
     */
    public static String unblockDeviceByMac(String macAddress) {
        return "iptables -D FORWARD -m mac --mac-source " + macAddress + " -j DROP 2>/dev/null || true";
    }

    /**
     * Bóp băng thông máy con (giới hạn 3Mbps tải xuống, 1Mbps tải lên)
     */
    public static String throttleDevice(String ipAddress, int downSpeedMbps) {
        return "tc qdisc add dev br-lan root handle 1: htb default 12 2>/dev/null || true; " +
               "tc class add dev br-lan parent 1: classid 1:1 htb rate " + downSpeedMbps + "mbit ceil " + downSpeedMbps + "mbit";
    }

    // ==========================================
    // 4. KIỂM TRA HỆ THỐNG ROUTER
    // ==========================================

    /**
     * Kiểm tra trạng thái bộ nhớ 64GB eMMC
     */
    public static String checkEmmcSpace() {
        return "df -h / /overlay";
    }

    /**
     * Khởi động lại router
     */
    public static String rebootRouter() {
        return "sync && reboot";
    }
}
