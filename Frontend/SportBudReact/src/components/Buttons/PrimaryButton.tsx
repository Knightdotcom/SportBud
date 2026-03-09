// Props för knappkomponenterna – text, klickhändelse och valfri inaktiverad-flagga
interface ButtonProps {
  buttonText: string
  buttonEvent?: () => void
  disabled?: boolean
}

// Primärknapp med orange bakgrundsfärg – används för huvudåtgärder som att lägga bud
function PrimaryButton({ buttonText, buttonEvent, disabled }: ButtonProps) {
  return (
    <button
      onClick={buttonEvent}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? '#9ca3af' : '#f97316',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '0.5rem 1.1rem',
        fontWeight: 600,
        fontSize: '0.9rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.2s ease',
      }}
      onMouseEnter={e => { if (!disabled) (e.target as HTMLElement).style.backgroundColor = '#ea6c0a' }}
      onMouseLeave={e => { if (!disabled) (e.target as HTMLElement).style.backgroundColor = '#f97316' }}
    >
      {buttonText}
    </button>
  )
}

export default PrimaryButton
