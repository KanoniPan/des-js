import { PC1, SHIFTS, PC2 } from './config'

export function computeSubKeys(key: number[]): number[][] {
  // permute 'key' using table PC1
  const permutedKey = permute(key ,PC1)

  // split 'kp' in half and process the resulting series of 'c' and 'd'
  const c = [];
  const d = [];

// compute C1 and D1
  c[0] = lcs(permutedKey.slice(0,28), SHIFTS[0], 28);
  d[0] = lcs(permutedKey.slice(28,56), SHIFTS[0], 28);


  for (let i = 1; i < 16; i++) {
    c[i] = lcs(c[i-1], SHIFTS[i],28)
    d[i] = lcs(d[i-1], SHIFTS[i],28)
  }

  const keys = c.map((it, index) => [...it, ...d[index]]);
  return keys.map(it => permute(it, PC2));
}

export function permute(bitArray: number[], table: number[]) {
  return table.map(item => bitArray[item - 1]);
}

function lcs(bitArray: number[], bitCount: number, length: number) {

  const result = bitArray.slice();
  for (let i = 0; i < bitCount; i++) {
    const firstBit = result[0];
    for (let j = 1; j < length; j++) {
      result[j - 1] = result[j]
    }

    result[length - 1] = firstBit
  }
  return result;
}

