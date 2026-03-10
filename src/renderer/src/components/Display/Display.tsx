import styles from './Display.module.css'

interface DisplayProps {
  expression: string
  displayValue: string
  isError: boolean
}

function getFontSize(length: number): string {
  if (length <= 9) return '48px'
  if (length <= 12) return '36px'
  return '28px'
}

function Display({ expression, displayValue, isError }: DisplayProps): JSX.Element {
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
