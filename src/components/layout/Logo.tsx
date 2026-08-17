export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="9" fill="#4f46e5" />
      <rect x="7" y="16" width="4" height="8" rx="1.5" fill="white" fillOpacity="0.55" />
      <rect x="14" y="10" width="4" height="14" rx="1.5" fill="white" fillOpacity="0.8" />
      <rect x="21" y="4" width="4" height="20" rx="1.5" fill="white" />
    </svg>
  )
}
