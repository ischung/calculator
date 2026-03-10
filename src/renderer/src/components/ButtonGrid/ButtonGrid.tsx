// Issue #10에서 완전 구현 예정
import type { ButtonConfig } from '../../../../types/calculator'

interface ButtonGridProps {
  buttons: ButtonConfig[]
  onButtonClick: (value: string) => void
}

function ButtonGrid({ buttons, onButtonClick }: ButtonGridProps): JSX.Element {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
      {buttons.map((btn) => (
        <button
          key={btn.value}
          onClick={() => onButtonClick(btn.value)}
          style={{ padding: '16px', fontSize: '18px' }}
        >
          {btn.label}
        </button>
      ))}
    </div>
  )
}

export default ButtonGrid
