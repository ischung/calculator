import type { CalculatorState } from '../../../../types/calculator'
import styles from './Display.module.css'

interface DisplayProps {
  state: CalculatorState
}

function getFontSize(length: number): string {
  if (length <= 9) return '48px'
  if (length <= 12) return '36px'
  return '28px'
}

function Display({ state }: DisplayProps): JSX.Element {
  const { expression, displayValue, isError } = state
  return (
    <div className={styles.display}>
      <div className={styles.expression}>{expression || '\u00A0'}</div>
      <div
        className={`${styles.value} ${isError ? styles.error : ''}`}
        style={{ fontSize: getFontSize(displayValue.length) }}
      >
        {isError ? '앗, 0으로 나눌 수 없어요!' : displayValue}
      </div>
    </div>
  )
}

export default Display
