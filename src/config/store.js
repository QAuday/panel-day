// Flip to true once you're ready to actually accept orders.
export const STORE_LIVE = true

// Shown on the manual (COD/UPI) order confirmation page.
export const STORE_UPI_ID = 'yourupi@bank'
export const STORE_WHATSAPP_NUMBER = '+91XXXXXXXXXX'

// Flat shipping fee in rupees, charged below the free-shipping threshold.
export const STORE_SHIPPING_FEE = 40
export const STORE_FREE_SHIPPING_THRESHOLD = 500

export function getShippingFee(subtotal) {
  return subtotal >= STORE_FREE_SHIPPING_THRESHOLD ? 0 : STORE_SHIPPING_FEE
}
