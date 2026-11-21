// src/utils/frac.js
// Exact rational arithmetic helper to prevent floating-point inaccuracies

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export class Frac {
  constructor(n, d = 1) {
    if (d === 0) throw new Error('Division by zero');
    if (d < 0) {
      n = -n;
      d = -d;
    }
    const g = gcd(n, d);
    this.n = Math.round(n / g);
    this.d = Math.round(d / g);
  }

  add(other) {
    const o = toFrac(other);
    return new Frac(this.n * o.d + o.n * this.d, this.d * o.d);
  }

  sub(other) {
    const o = toFrac(other);
    return new Frac(this.n * o.d - o.n * this.d, this.d * o.d);
  }

  mul(other) {
    const o = toFrac(other);
    return new Frac(this.n * o.n, this.d * o.d);
  }

  div(other) {
    const o = toFrac(other);
    if (o.n === 0) throw new Error('Divide by zero fraction');
    return new Frac(this.n * o.d, this.d * o.n);
  }

  reciprocal() {
    return new Frac(this.d, this.n);
  }

  eq(other) {
    const o = toFrac(other);
    return this.n === o.n && this.d === o.d;
  }

  gt(other) {
    const o = toFrac(other);
    return this.n * o.d > o.n * this.d;
  }

  gte(other) {
    const o = toFrac(other);
    return this.n * o.d >= o.n * this.d;
  }

  lt(other) {
    const o = toFrac(other);
    return this.n * o.d < o.n * this.d;
  }

  lte(other) {
    const o = toFrac(other);
    return this.n * o.d <= o.n * this.d;
  }

  toNumber() {
    return this.n / this.d;
  }

  isInteger() {
    return this.d === 1;
  }

  // Returns true if the number is an integer or ends in .5 (i.e. this * 2 is integer)
  isClean() {
    return (this.n * 2) % this.d === 0;
  }

  decimalsCount() {
    const val = this.toNumber();
    if (Number.isInteger(val)) return 0;
    const str = val.toString();
    const parts = str.split('.');
    return parts[1] ? parts[1].length : 0;
  }

  toPretty() {
    const val = this.toNumber();
    if (this.isClean()) {
      return Number.isInteger(val) ? String(val) : val.toFixed(1);
    }
    if (this.d === 1) return String(this.n);
    // Return decimal with at most 2 places if terminating, otherwise fraction
    if (this.decimalsCount() <= 2) {
      return String(val);
    }
    return `${this.n}/${this.d}`;
  }
}

export function F(n, d = 1) {
  return new Frac(n, d);
}

export function toFrac(v) {
  if (v instanceof Frac) return v;
  if (typeof v === 'number') {
    if (Number.isInteger(v)) return new Frac(v, 1);
    // Convert decimal up to 4 places
    const factor = 10000;
    return new Frac(Math.round(v * factor), factor);
  }
  return new Frac(0, 1);
}
