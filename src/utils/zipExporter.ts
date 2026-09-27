import JSZip from 'jszip';
import {
  RouterConfig,
  generateDotConfig,
  generateDiyPart1,
  generateDiyPart2,
  generateEmmcExpandScript,
  generateCustomSettingsScript,
  generateWorkflowYaml,
  generateReadme,
} from '../data/configTemplates';

export async function downloadRepoZip(cfg: RouterConfig): Promise<void> {
  const zip = new JSZip();

  // 1. Workflow
  zip.file('.github/workflows/build-openwrt.yml', generateWorkflowYaml(cfg));

  // 2. Custom Feeds and Scripts
  zip.file('diy-part1.sh', generateDiyPart1());
  zip.file('diy-part2.sh', generateDiyPart2(cfg.defaultLanIp));

  // 3. Dot config
  zip.file('.config', generateDotConfig(cfg));

  // 4. Custom uci-default files for 64GB eMMC expansion & settings
  const filesDir = zip.folder('files');
  if (filesDir) {
    const uciDefaults = filesDir.folder('etc')?.folder('uci-defaults');
    if (uciDefaults) {
      uciDefaults.file('99-expand-emmc.sh', generateEmmcExpandScript());
      uciDefaults.file('98-custom-settings.sh', generateCustomSettingsScript(cfg));
    }
  }

  // 5. Documentation
  zip.file('README.md', generateReadme(cfg));

  // Generate blob
  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  // Trigger download
  const filename = `openwrt-jdcloud-ax1800pro-64gb-workflow.zip`;
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
