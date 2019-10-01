import { permute, computeSubKeys } from './subKeys';
import { E, S, P, IP, IP2 } from './config';
const key = '0001001100110100010101110111100110011011101111001101111111110001'.split('').map(it => +it);
initialStringSplit('vovalohpidrsasasasa');

function initialStringSplit(initialString: string) {
  const arr = initialString.match(/.{1,8}/g);

  const encrptyedResult = arr.map(it => encrypt(key,it));
  const result = encrptyedResult.map(it => decrypt(key, it));
  console.log('result',result.join(''))
}

function encrypt(key: number[], message: string): number[] {
  const subKeys = computeSubKeys(key);
  const binaryMessage = [].concat(...message.split('').map(it => 
    it.charCodeAt(0).toString(2).padStart(8, '0').split('').map(it => +it)));
  return processMessage(binaryMessage, subKeys);
}

function decrypt(key: number[], encoded: number[]): string {
  const subKeys = computeSubKeys(key).reverse();
  const decryptedBinary = processMessage(encoded, subKeys);
  const eightSpace = decryptedBinary.join('').match(/.{1,8}/g);
  const binCode = []
  for (let i = 0; i < eightSpace.length; i++) {
    binCode.push(String.fromCharCode(parseInt(eightSpace[i], 2)));
  }
  
  return binCode.join('');
}

function processMessage(bitArray: number[], subKeys: number[][]) {
  const permutedMessage = permute(bitArray, IP);
  const l = [];
  const r = [];

  l[0] = permutedMessage.slice(0,32);
  r[0] = permutedMessage.slice(32,64);
  for (let i = 1; i < 17; i++) {

  
    l[i] = r[i-1];
    const fs = f(r[i-1], subKeys[i-1]);
    r[i] = xor(l[i-1], fs);
  }
 
  const e = [...r[16],...l[16]];
  return permute(e, IP2);
}

function f(bitArray: number[], subKey: number[]): number[] {
  const er = permute(bitArray,E);
  const xorEr = xor(er, subKey);

  const sr = [].concat(...S.map((it, index) => {
    const b = xorEr.slice(index * 6, (index + 1) * 6);

    const row = 2 * b[0] + b[5];
    const col = 8 * b[1] + 4 * b[2] + 2 * b[3] + b[4];

    const m = it[row * 16 + col]   // apply table S

    return m.toString(2).padStart(4, '0').split('').map(item => +item);
  }))

  return permute(sr, P);
}

function xor(bitArrayL: number[], bitArrayR: number[]) {
  return bitArrayL.map((it, index) => it ^ bitArrayR[index]);
}