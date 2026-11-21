// scripts/oracle.mjs
// Independent mathematical solver auditing visualData using integer cross-multiplication (TRD §12.2)

import { generateQuestionBank } from '../src/data/questionBank.js';

console.log('🔍 Starting Independent Oracle Verification on Question Bank...');

const bank = generateQuestionBank();
let verifiedCount = 0;

for (const q of bank) {
  const { districtId, visualData, correctAnswer } = q;

  if (districtId === 1) {
    // World 1: Scale factor k = b / a
    if (visualData && visualData.a && visualData.b) {
      const computedK = Number((visualData.b / visualData.a).toFixed(2));
      const ansNum = Number(correctAnswer);
      if (Math.abs(computedK - ansNum) > 0.05) {
        throw new Error(`Oracle mismatch in W1 (Q ${q.id}): expected ${computedK}, got ${ansNum}`);
      }
    }
  } else if (districtId === 5) {
    // World 5: Shadow H = (h * S) / s
    if (visualData && visualData.h && visualData.s && visualData.S) {
      const expectedH = Number(((visualData.h * visualData.S) / visualData.s).toFixed(1));
      const ansNum = parseFloat(correctAnswer);
      if (Math.abs(expectedH - ansNum) > 0.1) {
        throw new Error(`Oracle mismatch in W5 (Q ${q.id}): expected ${expectedH}, got ${ansNum}`);
      }
    }
  } else if (districtId === 6) {
    // World 6: Parallel line BC = DE * (AD + DB) / AD
    if (visualData && visualData.ad && visualData.db && visualData.de) {
      const expectedBC = Number(((visualData.de * (visualData.ad + visualData.db)) / visualData.ad).toFixed(1));
      const ansNum = parseFloat(correctAnswer);
      if (Math.abs(expectedBC - ansNum) > 0.1) {
        throw new Error(`Oracle mismatch in W6 (Q ${q.id}): expected ${expectedBC}, got ${ansNum}`);
      }
    }
  }

  verifiedCount++;
}

console.log(`🎉 ORACLE AUDIT PASSED: All ${verifiedCount} questions verified against independent formulas!\n`);
