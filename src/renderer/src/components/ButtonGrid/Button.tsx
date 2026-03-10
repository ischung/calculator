import type { ButtonConfig } from '../../../../types/calculator'
import styles from './ButtonGrid.module.css'

interface ButtonProps {
  config: ButtonConfig
  onButtonClick: (value: string) => void
}

function Button({ config, onButtonClick }: ButtonProps): JSX.Element {
  const { label, type, value, className } = config

  if (!label) return <div />

  return (
    <button
      className={`${styles.button} ${styles[type]} ${className ? styles[className] : ''}`}
      onClick={() => onButtonClick(value)}
    >
      {label}
    </button>
  )
}

export default Button
