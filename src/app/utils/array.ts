import { getRandomInt } from './number';

export function inArray(arrays: any[], target: any): boolean {
    return arrays.indexOf(target) !== -1;
}
/**洗牌算法，数组重新排列 */
export function shuffle<T>(arr: T[]): T[] {
    const result = arr.slice();
    for (let i = 0; i < result.length; i++) {
        const j = getRandomInt([0, i]);
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}
