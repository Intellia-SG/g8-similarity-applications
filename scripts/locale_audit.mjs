// scripts/locale_audit.mjs
// Locale neutrality audit scanning for forbidden currencies, shop terms, and sibling names (TRD §12.18)

import fs from 'fs';
import path from 'path';

console.log('🛡️ Starting Locale Neutrality Audit (G1)...');

// Deny-list seed from TRD §12.18
const DENY_TERMS = [
  'Singapore', 'Singaporean', 'MOE', 'HDB', 'CCA', 'S$', 'SGD', 'Singlish',
  'Zara', 'Milo', 'Nina', 'Kai', 'Arjun', 'Xin Yi', 'Rina', 'Wei Jie', 'Aisyah', 'Rohan', 'Priya', 'Farhan', 'Hui Min', 'Imran',
  'Pip the Parrot', 'Dash the Cheetah', 'Bobo the Monkey', 'Bo the Beaver',
  'Market Scanner', 'Coin Register', 'Change Maker', 'Receipt Detective',
  'dollars', 'cents', '$', '£', '€', '₹', '¥'
];

const SCAN_DIRS = ['src', 'public'];
let violationCount = 0;

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist') {
        scanDir(fullPath);
      }
    } else if (/\.(jsx?|css|html|json)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf-8');

      for (const term of DENY_TERMS) {
        // Whole-word regex matching
        const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, 'g');

        if (regex.test(content)) {
          console.error(`❌ Locale violation in ${fullPath}: found forbidden term "${term}"`);
          violationCount++;
        }
      }
    }
  }
}

for (const d of SCAN_DIRS) {
  scanDir(d);
}

if (violationCount > 0) {
  console.error(`\n❌ LOCALE AUDIT FAILED: ${violationCount} forbidden terms found.\n`);
  process.exit(1);
} else {
  console.log(`🎉 LOCALE AUDIT PASSED: 100% clean of all currency, regional, and sibling references!\n`);
}
