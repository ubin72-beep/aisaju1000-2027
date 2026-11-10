export const TOPUP_PRODUCTS = {
 'topup_1000': {amount:1000,points:1000,name:'천년지기 1,000포인트 충전'},
 'topup_3000': {amount:3000,points:3000,name:'천년지기 3,000포인트 충전'},
 'topup_5000': {amount:5000,points:5000,name:'천년지기 5,000포인트 충전'},
 'topup_10000': {amount:10000,points:10000,name:'천년지기 10,000포인트 충전'},
} as const;
export type TopupProductId = keyof typeof TOPUP_PRODUCTS;
export function getTopupProduct(value:unknown) {
 return typeof value==='string' && Object.prototype.hasOwnProperty.call(TOPUP_PRODUCTS,value)
  ? TOPUP_PRODUCTS[value as TopupProductId] : null;
}
export const CONSULTATION_PRICE_POINTS = 100;
