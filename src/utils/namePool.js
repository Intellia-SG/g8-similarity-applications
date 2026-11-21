// src/utils/namePool.js
// Pool of common English first names for survey contexts (TRD §4.4)

export const NAME_POOL = [
  'Ava', 'Noah', 'Emma', 'Liam', 'Olivia',
  'Ethan', 'Sophia', 'Jack', 'Grace', 'Ben',
  'Chloe', 'Sam', 'Ella', 'Max', 'Lily',
  'Tom', 'Ruby', 'Jake', 'Anna', 'Dan'
];

export function getRandomName() {
  return NAME_POOL[Math.floor(Math.random() * NAME_POOL.length)];
}
