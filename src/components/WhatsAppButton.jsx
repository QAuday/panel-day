import { STORE_WHATSAPP_NUMBER } from '../config/store'
import './WhatsAppButton.css'

const DIGITS_ONLY = STORE_WHATSAPP_NUMBER.replace(/\D/g, '')
// Hides itself until a real number replaces the placeholder in config/store.js.
const IS_CONFIGURED = !STORE_WHATSAPP_NUMBER.includes('X') && DIGITS_ONLY.length >= 10

function WhatsAppButton() {
  if (!IS_CONFIGURED) return null

  const message = encodeURIComponent('Hi! I have a question about Panel Day.')

  return (
    <a
      className="whatsapp-button"
      href={`https://wa.me/${DIGITS_ONLY}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12.004 2.003c-5.514 0-9.997 4.483-9.997 9.997 0 1.762.463 3.484 1.34 5.001L2 22l5.117-1.341a9.958 9.958 0 004.887 1.294h.004c5.514 0 9.997-4.483 9.997-9.997 0-2.669-1.04-5.176-2.928-7.064a9.935 9.935 0 00-7.073-2.89zm5.855 15.803a8.203 8.203 0 01-5.855 2.428h-.003a8.223 8.223 0 01-4.195-1.148l-.301-.179-3.03.795.81-2.955-.196-.303a8.194 8.194 0 01-1.256-4.371c0-4.532 3.688-8.219 8.222-8.219a8.171 8.171 0 015.816 2.41 8.171 8.171 0 012.409 5.815 8.223 8.223 0 01-2.421 5.727z" />
      </svg>
    </a>
  )
}

export default WhatsAppButton
