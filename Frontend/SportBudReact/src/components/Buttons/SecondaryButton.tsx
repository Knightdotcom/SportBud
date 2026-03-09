// Props för knappkomponenterna – text, klickhändelse och valfri inaktiverad-flagga
interface ButtonProps {
  buttonText: string
  buttonEvent?: () => void
  disabled?: boolean
}

// Sekundärknapp med transparent bakgrund och kantlinje – används för mindre framträdande åtgärder som avbryt
function SecondaryButton({ buttonText, buttonEvent, disabled }: ButtonProps) {
  return (
    <button
      onClick={buttonEvent}
      disabled={disabled}
      style={{
        backgroundColor: 'transparent',
        color: disabled ? '#9ca3af' : '#1a1a2e',
        border: `1.5px solid ${disabled ? '#9ca3af' : '#1a1a2e'}`,
        borderRadius: '6px',
        padding: '0.35rem 0.8rem',
        fontWeight: 500,
        fontSize: '0.85rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {buttonText}
    </button>
  )
}

export default SecondaryButton
