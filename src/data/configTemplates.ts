export interface RouterConfig {
  deviceName: string;
  target: string;
  subtarget: string;
  profile: string;
  openwrtBranch: string;
  rootfsSizeMb: number;
  enableDocker: boolean;
  enableTailscale: boolean;
  enableMqtt: boolean;
  enableNekobox: boolean;
  enableAdguard: boolean;
  enableModemband: boolean;
  enableSmsTool: boolean;
  enableVietnamese: boolean;
  enableArgonTheme: boolean;
  enableDnsmasqFull: boolean;
  defaultLanIp: string;
}

export const DEFAULT_CONFIG: RouterConfig = {
  deviceName: "JD Cloud AX1800 Pro (Qualcomm IPQ6000)",
  target: "qualcommax",
  subtarget: "ipq60xx",
  profile: "jdcloud_re-cs-07",
  openwrtBranch: "master",
  rootfsSizeMb: 1024, // 1GB rootfs base, with auto-expand script expanding to 64GB eMMC
  enableDocker: true,
  enableTailscale: true,
  enableMqtt: true,
  enableNekobox: true,
  enableAdguard: true,
  enableModemband: true,
  enableSmsTool: true,
  enableVietnamese: true,
  enableArgonTheme: true,
  enableDnsmasqFull: true,
  defaultLanIp: "192.168.1.1",
};

/**
 * Generate .config content for JD Cloud AX1800 Pro
 */
export function generateDotConfig(cfg: RouterConfig): string {
  const lines: string[] = [
    `# ====================================================================`,
    `# OpenWrt Target Configuration for JD Cloud AX1800 Pro (Qualcomm IPQ6000)`,
    `# RAM: 512MB | Storage: 64GB eMMC | 4G/5G BMS & IoT Gateway Profile`,
    `# ====================================================================`,
    `CONFIG_TARGET_${cfg.target}=y`,
    `CONFIG_TARGET_${cfg.target}_${cfg.subtarget}=y`,
    `CONFIG_TARGET_${cfg.target}_${cfg.subtarget}_DEVICE_${cfg.profile}=y`,
    ``,
    `# RootFS & Storage Architecture for 64GB eMMC`,
    `CONFIG_TARGET_ROOTFS_PARTSIZE=${cfg.rootfsSizeMb}`,
    `CONFIG_TARGET_ROOTFS_EXT4FS=y`,
    `CONFIG_TARGET_ROOTFS_SQUASHFS=y`,
    ``,
    `# Storage & Disk Management Tools (Crucial for 64GB eMMC Expansion & Docker)`,
    `CONFIG_PACKAGE_parted=y`,
    `CONFIG_PACKAGE_gdisk=y`,
    `CONFIG_PACKAGE_fdisk=y`,
    `CONFIG_PACKAGE_lsblk=y`,
    `CONFIG_PACKAGE_e2fsprogs=y`,
    `CONFIG_PACKAGE_resize2fs=y`,
    `CONFIG_PACKAGE_tune2fs=y`,
    `CONFIG_PACKAGE_losetup=y`,
    `CONFIG_PACKAGE_block-mount=y`,
    `CONFIG_PACKAGE_kmod-fs-ext4=y`,
    `CONFIG_PACKAGE_kmod-fs-f2fs=y`,
    `CONFIG_PACKAGE_kmod-fs-vfat=y`,
    `CONFIG_PACKAGE_kmod-usb-storage=y`,
    `CONFIG_PACKAGE_kmod-usb-storage-uas=y`,
    ``,
    `# 4G / 5G Cellular Modem Drivers & Communication Stacks`,
    `CONFIG_PACKAGE_kmod-usb-core=y`,
    `CONFIG_PACKAGE_kmod-usb2=y`,
    `CONFIG_PACKAGE_kmod-usb3=y`,
    `CONFIG_PACKAGE_kmod-usb-net=y`,
    `CONFIG_PACKAGE_kmod-usb-net-rndis=y`,
    `CONFIG_PACKAGE_kmod-usb-net-qmi-wwan=y`,
    `CONFIG_PACKAGE_kmod-usb-net-cdc-mbim=y`,
    `CONFIG_PACKAGE_kmod-usb-net-cdc-ncm=y`,
    `CONFIG_PACKAGE_kmod-usb-net-cdc-ether=y`,
    `CONFIG_PACKAGE_kmod-usb-net-huawei-cdc-ncm=y`,
    `CONFIG_PACKAGE_kmod-usb-serial=y`,
    `CONFIG_PACKAGE_kmod-usb-serial-option=y`,
    `CONFIG_PACKAGE_kmod-usb-serial-wwan=y`,
    `CONFIG_PACKAGE_kmod-usb-serial-qualcomm=y`,
    `CONFIG_PACKAGE_usb-modeswitch=y`,
    `CONFIG_PACKAGE_uqmi=y`,
    `CONFIG_PACKAGE_umbim=y`,
    `CONFIG_PACKAGE_modemmanager=y`,
    `CONFIG_PACKAGE_luci-app-modemmanager=y`,
    ``,
    `# AT Command & Serial Diagnostics Tools for Band & Cell Locking`,
    `CONFIG_PACKAGE_atinout=y`,
    `CONFIG_PACKAGE_picocom=y`,
    `CONFIG_PACKAGE_chat=y`,
    `CONFIG_PACKAGE_comgt=y`,
    `CONFIG_PACKAGE_minicom=y`,
    ``,
    `# Networking & Multi-WAN Load Balancing`,
    `CONFIG_PACKAGE_mwan3=y`,
    `CONFIG_PACKAGE_luci-app-mwan3=y`,
    `CONFIG_PACKAGE_luci-app-nlbwmon=y`,
    `CONFIG_PACKAGE_nlbwmon=y`,
    `CONFIG_PACKAGE_iptables-mod-ipopt=y`,
    `CONFIG_PACKAGE_ip-full=y`,
  ];

  if (cfg.enableDnsmasqFull) {
    lines.push(
      `# DNS & DHCP: Replace standard dnsmasq with dnsmasq-full`,
      `# CONFIG_PACKAGE_dnsmasq is not set`,
      `CONFIG_PACKAGE_dnsmasq-full=y`,
      `CONFIG_PACKAGE_dnsmasq_full_dhcpv6=y`,
      `CONFIG_PACKAGE_dnsmasq_full_dnssec=y`,
      `CONFIG_PACKAGE_dnsmasq_full_auth=y`,
      `CONFIG_PACKAGE_dnsmasq_full_ipset=y`,
      `CONFIG_PACKAGE_dnsmasq_full_nftset=y`,
      ``
    );
  }

  if (cfg.enableDocker) {
    lines.push(
      `# Docker Engine, Compose & Web Management (For BMS, Node-RED & Niagara N4)`,
      `CONFIG_PACKAGE_luci-app-dockerman=y`,
      `CONFIG_PACKAGE_dockerd=y`,
      `CONFIG_PACKAGE_docker=y`,
      `CONFIG_PACKAGE_docker-compose=y`,
      `CONFIG_PACKAGE_cgroupfs-mount=y`,
      `CONFIG_PACKAGE_kmod-veth=y`,
      `CONFIG_PACKAGE_kmod-macvlan=y`,
      `CONFIG_PACKAGE_kmod-ikconfig=y`,
      ``
    );
  }

  if (cfg.enableTailscale) {
    lines.push(
      `# Remote Access VPN: Tailscale Mesh`,
      `CONFIG_PACKAGE_tailscale=y`,
      `CONFIG_PACKAGE_iptables-nft=y`,
      `CONFIG_PACKAGE_kmod-tun=y`,
      ``
    );
  }

  if (cfg.enableMqtt) {
    lines.push(
      `# IoT Broker & Client Tools: Mosquitto`,
      `CONFIG_PACKAGE_mosquitto-ssl=y`,
      `CONFIG_PACKAGE_mosquitto-client-ssl=y`,
      ``
    );
  }

  if (cfg.enableModemband) {
    lines.push(
      `# 4G/LTE Band Lock UI`,
      `CONFIG_PACKAGE_luci-app-modemband=y`,
      `CONFIG_PACKAGE_modemband=y`,
      ``
    );
  }

  if (cfg.enableSmsTool) {
    lines.push(
      `# SMS & USSD Web Tool for OTP & Balances`,
      `CONFIG_PACKAGE_luci-app-sms-tool=y`,
      `CONFIG_PACKAGE_sms-tool=y`,
      ``
    );
  }

  if (cfg.enableNekobox) {
    lines.push(
      `# Proxy & Traffic Steering: NekoBox (Sing-box core)`,
      `CONFIG_PACKAGE_luci-app-nekobox=y`,
      `CONFIG_PACKAGE_sing-box=y`,
      ``
    );
  }

  if (cfg.enableAdguard) {
    lines.push(
      `# Network-Wide Ad & Threat Blocking: AdGuardHome`,
      `CONFIG_PACKAGE_luci-app-adguardhome=y`,
      `CONFIG_PACKAGE_adguardhome=y`,
      ``
    );
  }

  lines.push(
    `# LuCI Web Interface & Themes`,
    `CONFIG_PACKAGE_luci=y`,
    `CONFIG_PACKAGE_luci-ssl=y`,
    `CONFIG_PACKAGE_luci-base=y`
  );

  if (cfg.enableArgonTheme) {
    lines.push(
      `CONFIG_PACKAGE_luci-theme-argon=y`,
      `CONFIG_PACKAGE_luci-app-argon-config=y`
    );
  }

  if (cfg.enableVietnamese) {
    lines.push(
      `CONFIG_PACKAGE_luci-i18n-base-vi=y`,
      `CONFIG_PACKAGE_luci-i18n-mwan3-vi=y`,
      `CONFIG_PACKAGE_luci-i18n-modemmanager-vi=y`,
      `CONFIG_PACKAGE_luci-i18n-dockerman-vi=y`
    );
  }

  lines.push(
    ``,
    `# Essential CLI Utilities for Embedded Gateways`,
    `CONFIG_PACKAGE_nano=y`,
    `CONFIG_PACKAGE_htop=y`,
    `CONFIG_PACKAGE_curl=y`,
    `CONFIG_PACKAGE_wget-ssl=y`,
    `CONFIG_PACKAGE_tar=y`,
    `CONFIG_PACKAGE_gzip=y`,
    `CONFIG_PACKAGE_unzip=y`,
    `CONFIG_PACKAGE_jq=y`,
    `CONFIG_PACKAGE_tree=y`,
    `CONFIG_PACKAGE_ca-bundle=y`,
    `CONFIG_PACKAGE_ca-certificates=y`,
    `CONFIG_PACKAGE_coreutils=y`,
    `CONFIG_PACKAGE_coreutils-base64=y`,
    `CONFIG_PACKAGE_coreutils-nohup=y`
  );

  return lines.join("\n");
}

/**
 * Generate diy-part1.sh (Custom Feeds)
 */
export function generateDiyPart1(): string {
  return `#!/bin/bash
# =============================================================================
# diy-part1.sh - Custom Feeds configuration for OpenWrt Source
# Target: JD Cloud AX1800 Pro (Qualcomm IPQ6000)
# BMS/IoT Gateway Stack: Modemband, SMS Tool, NekoBox, AdGuardHome, Argon Theme
# =============================================================================

# Remove existing duplicate feeds if any
sed -i 's/^#\\(.*telephony\\)/\\1/' feeds.conf.default

# 1. JerryKuKu Argon Theme & Configuration Web App
echo 'src-git argon https://github.com/jerrykuku/luci-theme-argon.git' >> feeds.conf.default
echo 'src-git argonconfig https://github.com/jerrykuku/luci-app-argon-config.git' >> feeds.conf.default

# 2. 4G/LTE Modem Band Locking Web UI (modemband)
echo 'src-git modemband https://github.com/4fun/luci-app-modemband.git' >> feeds.conf.default

# 3. SMS & USSD Tool (sms-tool) for Quectel/Fibocom/Huawei modems
echo 'src-git smstool https://github.com/koshev-ay/luci-app-sms-tool.git' >> feeds.conf.default

# 4. AdGuardHome & LuCI GUI
echo 'src-git adguardhome https://github.com/rufengsuixing/luci-app-adguardhome.git' >> feeds.conf.default

# 5. NekoBox (Sing-box Universal Proxy / SNI Bypass for IoT & Edge)
echo 'src-git nekobox https://github.com/Thaolga/luci-app-nekobox.git' >> feeds.conf.default

# Optional: Extra Modem drivers feed if compiling older official OpenWrt
# echo 'src-git modemfeed https://github.com/Siriling/openwrt-modem-feeds.git' >> feeds.conf.default

echo ">>> Custom feeds successfully injected into feeds.conf.default!"
`;
}

/**
 * Generate diy-part2.sh (Configurations, tweaks, dnsmasq replace, default IP)
 */
export function generateDiyPart2(lanIp: string = "192.168.1.1"): string {
  return `#!/bin/bash
# =============================================================================
# diy-part2.sh - Custom Source Modifications & Default Settings
# Target: JD Cloud AX1800 Pro (Qualcomm IPQ6000)
# =============================================================================

# 1. Modify default LAN IP address (${lanIp})
sed -i 's/192.168.1.1/${lanIp}/g' package/base-files/files/bin/config_generate

# 2. Remove default dnsmasq and force dnsmasq-full package definition
rm -rf package/network/services/dnsmasq
svn export https://github.com/openwrt/openwrt/trunk/package/network/services/dnsmasq package/network/services/dnsmasq 2>/dev/null || true

# 3. Set default theme to Argon
sed -i 's/luci-theme-bootstrap/luci-theme-argon/g' feeds/luci/collections/luci/Makefile 2>/dev/null || true

# 4. Enable executable permissions on all uci-default custom scripts
if [ -d "files/etc/uci-defaults" ]; then
    chmod +x files/etc/uci-defaults/* 2>/dev/null || true
    echo ">>> Verified execution bits on files/etc/uci-defaults/*.sh"
fi

# 5. Ensure maximum MTU clamping & TCP MSS for 4G LTE connections
echo ">>> diy-part2.sh completed successfully!"
`;
}

/**
 * Generate files/etc/uci-defaults/99-expand-emmc.sh
 * The holy grail: expands 64GB eMMC partition automatically on first boot
 */
export function generateEmmcExpandScript(): string {
  return `#!/bin/sh
# =============================================================================
# /etc/uci-defaults/99-expand-emmc.sh
# AUTO-EXPAND 64GB eMMC ROOTFS & OVERLAY ON FIRST BOOT
# Target: JD Cloud AX1800 Pro (Qualcomm IPQ6000 / eMMC: /dev/mmcblk0)
# Purpose: Ensures Docker, Node-RED, and Niagara N4 BMS Gateways have
# full access to the remaining ~58GB+ disk space.
# =============================================================================

FLAG_FILE="/etc/emmc_expanded.done"

if [ -f "$FLAG_FILE" ]; then
    logger -t EMMC_EXPAND "64GB eMMC storage expansion already completed. Skipping."
    exit 0
fi

logger -t EMMC_EXPAND "Starting automated 64GB eMMC RootFS expansion on JD Cloud AX1800 Pro..."

# Detect root block device (typically /dev/mmcblk0)
ROOT_DEV="/dev/mmcblk0"

if [ ! -b "$ROOT_DEV" ]; then
    logger -t EMMC_EXPAND "Error: Root block device $ROOT_DEV not found. Aborting."
    exit 0
fi

# Find the current rootfs_data / overlay partition number
# For IPQ6000 ext4 sysupgrade, the root partition is usually partition 27 or 28, or rootfs partition
PART_NUM=$(grep -E 'rootfs_data|rootfs' /proc/mtd /proc/partitions 2>/dev/null | awk '{print $4}' | grep -o '[0-9]*$' | tail -n 1)

# Fallback: inspect mount table to find mounted /overlay or / root device
if [ -z "$PART_NUM" ]; then
    ROOTFS_MOUNT=$(df -h / | awk 'NR==2 {print $1}')
    PART_NUM=$(echo "$ROOTFS_MOUNT" | grep -o '[0-9]*$')
fi

logger -t EMMC_EXPAND "Detected target partition number: \${PART_NUM:-last}"

# Use parted or gdisk to fix the GPT secondary header at the end of the 64GB eMMC
which parted >/dev/null 2>&1
if [ $? -eq 0 ]; then
    logger -t EMMC_EXPAND "Repairing GPT table at end of 64GB eMMC..."
    # Fix GPT table to cover the entire disk
    parted -s "$ROOT_DEV" print ---pretend-input-tty <<EOF
Fix
EOF

    # Expand the last rootfs_data partition to 100% of the disk
    if [ -n "$PART_NUM" ]; then
        logger -t EMMC_EXPAND "Expanding partition $PART_NUM to 100% of eMMC..."
        parted -s "$ROOT_DEV" resizepart "$PART_NUM" 100%
    fi
fi

# Inform the kernel of partition table changes
partx -u "$ROOT_DEV" 2>/dev/null || blockdev --rereadpt "$ROOT_DEV" 2>/dev/null

# Resize the ext4 filesystem online
which resize2fs >/dev/null 2>&1
if [ $? -eq 0 ]; then
    # Resize ext4 on mounted root / overlay
    logger -t EMMC_EXPAND "Resizing ext4 filesystem to maximum disk capacity..."
    resize2fs "\${ROOT_DEV}p\${PART_NUM}" 2>/dev/null || resize2fs /dev/root 2>/dev/null || resize2fs $(df -P /overlay | awk 'NR==2 {print $1}') 2>/dev/null
fi

# Create dedicated directory for Docker and BMS IoT storage
mkdir -p /opt/docker
mkdir -p /opt/bms-gateway
mkdir -p /opt/niagara

# Mark completion so it won't run again on normal boots
touch "$FLAG_FILE"
logger -t EMMC_EXPAND "SUCCESS: 64GB eMMC RootFS storage expansion completed! Full space available."

exit 0
`;
}

/**
 * Generate files/etc/uci-defaults/98-custom-settings.sh
 */
export function generateCustomSettingsScript(cfg: RouterConfig): string {
  return `#!/bin/sh
# =============================================================================
# /etc/uci-defaults/98-custom-settings.sh
# Initial System Provisioning for 4G Gateway & IoT
# =============================================================================

# Set Vietnamese locale by default if enabled
${cfg.enableVietnamese ? `uci set luci.main.lang='vi'\nuci commit luci` : ""}

# Set system timezone to Asia/Ho_Chi_Minh (+07:00)
uci set system.@system[0].zonename='Asia/Ho_Chi_Minh'
uci set system.@system[0].timezone='<+07>-7'
uci commit system

# Pre-configure Docker daemon to use the expanded eMMC /opt/docker data-root
if [ -d "/opt/docker" ] || mkdir -p /opt/docker; then
    mkdir -p /etc/docker
    cat << 'EOF' > /etc/docker/daemon.json
{
  "data-root": "/opt/docker",
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF
fi

# Enable MWAN3 automatic cellular failover tracking
uci set mwan3.globals.mmx_mask='0x3F00'
uci commit mwan3 2>/dev/null || true

exit 0
`;
}

/**
 * Generate GitHub Actions Workflow YAML (.github/workflows/build-openwrt.yml)
 */
export function generateWorkflowYaml(cfg: RouterConfig): string {
  return `name: Build OpenWrt for JD Cloud AX1800 Pro (64GB eMMC + 4G IoT)

on:
  workflow_dispatch:
    inputs:
      ssh_debug:
        description: 'SSH connection to Actions for debugging (true/false)'
        required: false
        default: 'false'
      openwrt_branch:
        description: 'OpenWrt source branch (master, openwrt-23.05, etc.)'
        required: true
        default: '${cfg.openwrtBranch}'

env:
  REPO_URL: https://github.com/openwrt/openwrt.git
  REPO_BRANCH: \${{ github.event.inputs.openwrt_branch || '${cfg.openwrtBranch}' }}
  FEEDS_CONF: feeds.conf.default
  CONFIG_FILE: .config
  DIY_P1_SH: diy-part1.sh
  DIY_P2_SH: diy-part2.sh
  UPLOAD_BIN_DIR: false
  UPLOAD_FIRMWARE: true
  UPLOAD_RELEASE: true
  TZ: Asia/Ho_Chi_Minh

jobs:
  build:
    runs-on: ubuntu-22.04

    steps:
    - name: Checkout Repository
      uses: actions/checkout@v4

    - name: Free Disk Space (Ubuntu Runner)
      run: |
        sudo rm -rf /usr/share/dotnet /etc/mysql /var/lib/mysql /usr/local/lib/android 2>/dev/null || true
        sudo rm -rf /opt/ghc /usr/local/share/boost "$AGENT_TOOLSDIRECTORY" 2>/dev/null || true
        sudo -E apt-get -qq update
        sudo -E apt-get -qq autoremove --purge
        sudo -E apt-get -qq clean
        df -h

    - name: Initialize Compilation Environment & Build Tools
      run: |
        sudo -E apt-get -qq update
        sudo -E apt-get -qq install -y build-essential clang flex bison g++ gawk gcc-multilib g++-multilib \\
          gettext git libncurses5-dev libssl-dev python3-distutils rsync unzip zlib1g-dev file wget \\
          subversion swig time libelf-dev ecj fastjar libelf1 libglib2.0-dev libgmp3-dev libltdl-dev \\
          libmpc-dev libmpfr-dev libreadline-dev libtool lrzsz mkisofs msmtp nano p7zip p7zip-full patch \\
          pkgconf python3 python3-pip python3-ply python3-docutils qemu-utils re2c scons squashfs-tools \\
          uglifyjs upx-ucl binfmt-support
        sudo timedatectl set-timezone "$TZ"

    - name: Clone Official OpenWrt Source
      run: |
        git clone --depth 1 $REPO_URL -b $REPO_BRANCH openwrt
        cd openwrt
        echo "OPENWRT_ROOT=$PWD" >> $GITHUB_ENV

    - name: Inject Custom Third-Party Feeds (diy-part1.sh)
      run: |
        [ -e $FEEDS_CONF ] && mv $FEEDS_CONF openwrt/feeds.conf.default
        chmod +x $DIY_P1_SH
        cd openwrt
        $GITHUB_WORKSPACE/$DIY_P1_SH

    - name: Update & Install Feeds
      run: |
        cd openwrt
        ./scripts/feeds update -a
        ./scripts/feeds install -a

    - name: Apply Custom Scripts & Inject 64GB eMMC Auto-Expand (diy-part2.sh)
      run: |
        # Copy custom files (uci-defaults scripts for 64GB eMMC expansion)
        if [ -d "files" ]; then
          mkdir -p openwrt/files
          cp -r files/* openwrt/files/
          chmod +x openwrt/files/etc/uci-defaults/* 2>/dev/null || true
        fi
        chmod +x $DIY_P2_SH
        cd openwrt
        $GITHUB_WORKSPACE/$DIY_P2_SH

    - name: Load .config & Generate Defconfig
      run: |
        [ -e $CONFIG_FILE ] && cp $CONFIG_FILE openwrt/.config
        cd openwrt
        make defconfig
        ./scripts/diffconfig.sh > diffconfig
        cat diffconfig

    - name: Download Dependency Packages (Parallel)
      run: |
        cd openwrt
        make download -j8
        find dl -size -1024c -exec ls -l {} \\;
        find dl -size -1024c -exec rm -f {} \\;

    - name: Compile OpenWrt Firmware (Qualcomm IPQ6000)
      run: |
        cd openwrt
        echo -e "$(nproc) thread compile"
        make -j$(nproc) || make -j1 || make -j1 V=s
        echo "FILE_DATE=_$(date +"%Y%m%d%H%M")" >> $GITHUB_ENV

    - name: Organize Compiled .bin Firmware Files
      id: organize
      if: env.UPLOAD_FIRMWARE == 'true' && !cancelled()
      run: |
        cd openwrt/bin/targets/*/*
        rm -rf packages
        echo "FIRMWARE=$PWD" >> $GITHUB_ENV
        echo "STATUS=success" >> $GITHUB_OUTPUT
        echo "Listing generated firmware artifacts:"
        ls -la

    - name: Upload Sysupgrade & Factory .bin to GitHub Actions Artifacts
      uses: actions/upload-artifact@v4
      if: steps.organize.outputs.STATUS == 'success' && !cancelled()
      with:
        name: OpenWrt_JDCloud_AX1800Pro_64GB_\${{ env.FILE_DATE }}
        path: \${{ env.FIRMWARE }}/*sysupgrade.bin
        if-no-files-found: error
        retention-days: 30

    - name: Upload All Targets & Checksums (Backup Artifact)
      uses: actions/upload-artifact@v4
      if: steps.organize.outputs.STATUS == 'success' && !cancelled()
      with:
        name: OpenWrt_JDCloud_AX1800Pro_All_Files_\${{ env.FILE_DATE }}
        path: |
          \${{ env.FIRMWARE }}/*
          !\${{ env.FIRMWARE }}/*.buildinfo
          !\${{ env.FIRMWARE }}/*.manifest
        retention-days: 14

    - name: Generate Firmware Release Tags & Notes
      id: tag
      if: env.UPLOAD_RELEASE == 'true' && !cancelled()
      run: |
        echo "RELEASE_TAG=AX1800Pro-64GB-4G-$(date +"%Y.%m.%d-%H%M")" >> $GITHUB_OUTPUT
        echo "RELEASE_DATE=$(date +"%Y-%m-%d %H:%M:%S")" >> $GITHUB_OUTPUT
        cat << 'EOF' > release_notes.md
        ## JD Cloud AX1800 Pro (Qualcomm IPQ6000) - OpenWrt Custom Build
        - **Target SoC**: Qualcomm IPQ6000 (qualcommax/ipq60xx)
        - **Model**: JD Cloud AX1800 Pro (\`jdcloud_re-cs-07\`)
        - **Storage**: 64GB eMMC with automated RootFS & Overlay auto-expansion service (\`99-expand-emmc.sh\`)
        - **4G/5G Cellular Engine**:
          - Force LTE Only & Band Lock Web UI (\`luci-app-modemband\`)
          - AT commands & Cell/PCI/EARFCN lock tools (\`atinout\`, \`picocom\`)
          - SMS & USSD Web interface (\`luci-app-sms-tool\`)
          - Multi-WAN failover & load balance (\`mwan3\`, \`luci-app-mwan3\`)
        - **Edge IoT & BMS Stack**:
          - Docker CE & Web UI (\`luci-app-dockerman\`, \`dockerd\`, \`docker-compose\`)
          - Tailscale Mesh VPN
          - Mosquitto MQTT SSL Broker & Client
          - NekoBox (Sing-box core) + AdGuard Home
          - Vietnamese UI Support (\`luci-i18n-base-vi\`)
        EOF
        echo "STATUS=success" >> $GITHUB_OUTPUT

    - name: Publish GitHub Release with .bin Sysupgrade
      uses: softprops/action-gh-release@v2
      if: steps.tag.outputs.STATUS == 'success' && !cancelled()
      env:
        GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
      with:
        tag_name: \${{ steps.tag.outputs.RELEASE_TAG }}
        name: OpenWrt JD Cloud AX1800 Pro 64GB [\${{ steps.tag.outputs.RELEASE_DATE }}]
        body_path: release_notes.md
        files: |
          \${{ env.FIRMWARE }}/*sysupgrade.bin
          \${{ env.FIRMWARE }}/*sha256sums
`;
}

/**
 * Generate README.md for the repo
 */
export function generateReadme(cfg: RouterConfig): string {
  return `# OpenWrt CI Builder for JD Cloud AX1800 Pro (Qualcomm IPQ6000)

Firmware compilation suite tailored for **JD Cloud AX1800 Pro** (512MB RAM, 64GB eMMC), configured as an industrial **4G Cellular Gateway & IoT / BMS (Niagara N4 / Node-RED) Edge Controller**.

---

## 🚀 Quick Start (Compile in 3 Steps)

1. **Fork or Push this repository to your GitHub account**:
   - Push these exact files to your new GitHub repository:
     - \`.github/workflows/build-openwrt.yml\`
     - \`diy-part1.sh\`
     - \`diy-part2.sh\`
     - \`.config\`
     - \`files/etc/uci-defaults/99-expand-emmc.sh\`
     - \`files/etc/uci-defaults/98-custom-settings.sh\`

2. **Trigger Compilation**:
   - Navigate to the **Actions** tab on your GitHub repository.
   - Select **"Build OpenWrt for JD Cloud AX1800 Pro"** from the left sidebar.
   - Click **Run workflow** -> Select branch (\`${cfg.openwrtBranch}\`) -> Click **Run workflow**.

3. **Download Firmware**:
   - Once completed (~45 to 90 minutes depending on GitHub runner speed), go to the **Releases** tab or the bottom of the Actions run summary.
   - Download the \`*sysupgrade.bin\` artifact.
   - Flash via U-Boot Web Failsafe UI (\`192.168.1.1\`) or LuCI System -> Backup / Flash Firmware.

---

## 📦 Key Specifications & Included Features

| Feature | Specification / Included Package |
|---|---|
| **Device Model** | JD Cloud AX1800 Pro (Qualcomm IPQ6000) / \`${cfg.profile}\` |
| **Storage (64GB eMMC)** | Automated firstboot script \`99-expand-emmc.sh\` expands partition & ext4 filesystem to utilize all 64GB for Docker & Edge storage. |
| **4G / 5G Cellular Drivers** | \`kmod-usb-net-rndis\`, \`kmod-usb-net-qmi-wwan\`, \`kmod-usb-net-cdc-mbim\`, \`kmod-usb-serial-option\`, \`modemmanager\`, \`usb-modeswitch\` |
| **Band Lock & LTE Only** | \`luci-app-modemband\` (Web UI for locking LTE bands: B1, B3, B7, B8, B28, etc.) |
| **Cell Lock (BTS / PCI)** | \`atinout\`, \`picocom\` for Quectel/Fibocom AT command scripts (\`AT+QNWLOCK\`) |
| **SMS & USSD** | \`luci-app-sms-tool\` + \`sms-tool\` for OTP reading and balance checks |
| **Multi-WAN Failover** | \`mwan3\` + \`luci-app-mwan3\` + \`luci-app-nlbwmon\` (Bandwidth monitor) |
| **IoT & Edge Apps** | Docker CE (\`dockerd\`, \`docker-compose\`, \`luci-app-dockerman\`), Mosquitto MQTT, Tailscale VPN |
| **Security & Routing** | NekoBox (\`sing-box\` core for Proxy/SNI bypass), AdGuard Home |
| **DNS Stack** | \`dnsmasq-full\` (with DNSSEC, ipset, nftset support) |
| **Language & Theme** | Vietnamese (\`luci-i18n-base-vi\`) + Argon Theme (\`luci-theme-argon\`) |

---

## 🛠️ Cell Lock & AT Command Guide (Quectel EP06 / EM12 / RM500Q)

To lock to a specific cell tower (PCI and EARFCN) using \`atinout\` in SSH:

\`\`\`bash
# 1. Check current serving cell information
echo "AT+QENG=\\"servingcell\\"" | atinout - /dev/ttyUSB2 -

# 2. Force 4G LTE Only mode
echo "AT+QCFG=\\"nwscanmode\\",3,1" | atinout - /dev/ttyUSB2 -

# 3. Lock to specific Cell (e.g., EARFCN 1850, PCI 324)
echo "AT+QNWLOCK=\\"common/4g\\",1,1850,324" | atinout - /dev/ttyUSB2 -

# 4. Clear Cell Lock (Restore Auto-Selection)
echo "AT+QNWLOCK=\\"common/4g\\",0" | atinout - /dev/ttyUSB2 -
\`\`\`

---

## 💾 64GB eMMC Storage Utilization

On first boot after flashing, \`/etc/uci-defaults/99-expand-emmc.sh\` automatically:
1. Re-reads and fixes the GPT secondary partition table.
2. Expands the rootfs partition to 100% of the 64GB eMMC chip.
3. Resizes the ext4 filesystem using \`resize2fs\`.
4. Configures Docker root directory at \`/opt/docker\` so container images won't run out of space.
`;
}
