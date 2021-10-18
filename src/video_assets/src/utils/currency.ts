import { nativeTokenDecimals } from './tokens';

export const dollarsPerIcp: number = 44.11;

export function parseToDollar(icp: number) {
  return +parseFloat(`${icp * dollarsPerIcp}`).toFixed(2);
}

export function parseToIcp(dollars: number) {
  return +parseFloat(`${dollars / dollarsPerIcp}`).toFixed(nativeTokenDecimals);
}
