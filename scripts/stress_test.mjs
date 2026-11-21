// scripts/stress_test.mjs
// Question bank stress test (>= 300 runs = 30,000 questions) per TRD §12.1

import { generateQuestionBank } from '../src/data/questionBank.js';

console.log('🧪 Starting SimilarQuest Question Bank Stress Test (300 runs)...');

const RUNS = 300;
let totalQuestionsChecked = 0;
const FORBIDDEN_WORDS = ['area', 'volume', 'square metre', 'cubic'];

for (let r = 1; r <= RUNS; r++) {
  const bank = generateQuestionBank();

  if (bank.length !== 100) {
    throw new Error(`Run ${r}: Expected 100 questions, got ${bank.length}`);
  }

  const worldCounts = Array(10).fill(0);

  for (const q of bank) {
    totalQuestionsChecked++;
    worldCounts[q.districtId]++;

    // 1. Schema check
    if (!q.id || q.districtId === undefined || !q.questionText || !q.options || !q.correctAnswer || !q.explanation) {
      throw new Error(`Run ${r}, Q ${q.id}: Incomplete question schema.`);
    }

    // 2. No NaN or undefined in strings
    const allText = `${q.questionText} ${q.options.join(' ')} ${q.correctAnswer} ${q.explanation}`;
    if (allText.includes('NaN') || allText.includes('undefined')) {
      throw new Error(`Run ${r}, Q ${q.id}: Found NaN or undefined in question content.`);
    }

    // 3. Exactly 4 distinct options with correctAnswer among them
    if (q.options.length !== 4) {
      throw new Error(`Run ${r}, Q ${q.id}: Expected exactly 4 options, got ${q.options.length}`);
    }
    const uniqueOpts = new Set(q.options.map((o) => String(o).trim()));
    if (uniqueOpts.size !== 4) {
      throw new Error(`Run ${r}, Q ${q.id}: Options are not unique: ${JSON.stringify(q.options)}`);
    }
    if (!uniqueOpts.has(String(q.correctAnswer).trim())) {
      throw new Error(`Run ${r}, Q ${q.id}: Correct answer "${q.correctAnswer}" not in options.`);
    }

    // 4. No forbidden area or volume keywords
    const lowerText = allText.toLowerCase();
    for (const word of FORBIDDEN_WORDS) {
      if (lowerText.includes(word)) {
        throw new Error(`Run ${r}, Q ${q.id}: Contains forbidden word "${word}"`);
      }
    }
  }

  // 10 questions per world check
  for (let w = 0; w < 10; w++) {
    if (worldCounts[w] !== 10) {
      throw new Error(`Run ${r}, World ${w}: Expected 10 questions, got ${worldCounts[w]}`);
    }
  }

  if (r % 75 === 0) {
    console.log(`  ✓ Completed ${r}/${RUNS} runs (${totalQuestionsChecked} questions verified)`);
  }
}

console.log(`\n🎉 STRESS TEST PASSED: ${RUNS} runs, ${totalQuestionsChecked} questions verified! Zero defects.\n`);
