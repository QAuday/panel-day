export const SHIPPING_FEE = 40
export const FREE_SHIPPING_THRESHOLD = 500

export function calculateShippingFee(itemsSubtotal) {
  return itemsSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
}
