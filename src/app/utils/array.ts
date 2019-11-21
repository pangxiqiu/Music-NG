import {getRandomInt} from './number';

export function inArray(arr: any[], target: any): boolean {
  return arr.indexOf(target) !== -1;
}
export function shuffle<T>(arr: T[]): T[] {
    const res = arr.slice();
    for (let i = 0 ; i < res.length; i ++) {
      // 0到i之间的随机数
      const j = getRandomInt([0, i]);
      [res[i], res[j]] = [res[j], res[i]];
    }
    return res;
}
