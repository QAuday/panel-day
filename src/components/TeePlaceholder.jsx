function TeePlaceholder({ label }) {
  return (
    <svg viewBox="0 0 200 220" className="tee-placeholder" aria-hidden="true">
      <path
        d="M60 10 L20 40 L35 65 L55 52 L55 210 L145 210 L145 52 L165 65 L180 40 L140 10 L120 22 C112 30 88 30 80 22 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <text
        x="100"
        y="128"
        textAnchor="middle"
        className="tee-placeholder__label"
      >
        {label}
      </text>
    </svg>
  )
}

export default TeePlaceholder
