// src/utils/shuffle.js
// Array shuffling and question session generator

export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateSessionQuestions(bank) {
  // Sort questions by world/district, keeping questions grouped in 10s
  return [...bank].sort((a, b) => a.id - b.id);
}
