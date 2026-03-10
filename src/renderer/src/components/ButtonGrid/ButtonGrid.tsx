import type { ButtonConfig } from '../../../../types/calculator'
import Button from './Button'
import styles from './ButtonGrid.module.css'

interface ButtonGridProps {
  buttons: ButtonConfig[]
  onButtonClick: (value: string) => void
}

function ButtonGrid({ buttons, onButtonClick }: ButtonGridProps): JSX.Element {
  return (
    <div className={styles.grid}>
      {buttons.map((btn, idx) => (
        <Button key={`${btn.value}-${idx}`} config={btn} onButtonClick={onButtonClick} />
      ))}
    </div>
  )
}

export default ButtonGrid
