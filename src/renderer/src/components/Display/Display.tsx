// Issue #9에서 완전 구현 예정
import type { CalculatorState } from '../../../../types/calculator'

interface DisplayProps {
  state: CalculatorState
}

function Display({ state }: DisplayProps): JSX.Element {
  return (
    <div>
      <div style={{ fontSize: '12px', color: '#aaa' }}>{state.expression}</div>
      <div style={{ fontSize: '32px', color: state.isError ? 'red' : 'white' }}>
        {state.isError ? '앗, 0으로 나눌 수 없어요!' : state.displayValue}
      </div>
    </div>
  )
}

export default Display
