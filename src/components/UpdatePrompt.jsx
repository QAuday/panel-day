import { useRegisterSW } from 'virtual:pwa-register/react'
import './UpdatePrompt.css'

function UpdatePrompt() {
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW()

  if (!needRefresh) return null

  return (
    <div className="update-prompt" role="status">
      <span>New version available.</span>
      <button type="button" className="btn btn-invert update-prompt__btn" onClick={() => updateServiceWorker(true)}>
        Refresh
      </button>
    </div>
  )
}

export default UpdatePrompt
