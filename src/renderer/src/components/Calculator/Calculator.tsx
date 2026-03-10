import { useState } from 'react'
import type { ButtonConfig } from '../../../../types/calculator'
import styles from './Calculator.module.css'
import {
  initialState,
  inputDigit,
  inputDecimal,
  inputOperator,
  calculate,
  clear,
  backspace
} from '../../engine/calculatorEngine'
import type { Operator } from '../../engine/calculatorEngine'
import Display from '../Display/Display'
import ButtonGrid from '../ButtonGrid/ButtonGrid'

const BUTTONS: ButtonConfig[] = [
  { label: 'C', type: 'clear', value: 'clear' },
  { label: '⌫', type: 'backspace', value: 'backspace' },
  { label: '', type: 'operator', value: '' }, // 빈 자리 (UI 정렬용, #10에서 처리)
  { label: '÷', type: 'operator', value: '÷' },
  { label: '7', type: 'number', value: '7' },
  { label: '8', type: 'number', value: '8' },
  { label: '9', type: 'number', value: '9' },
  { label: '×', type: 'operator', value: '×' },
  { label: '4', type: 'number', value: '4' },
  { label: '5', type: 'number', value: '5' },
  { label: '6', type: 'number', value: '6' },
  { label: '-', type: 'operator', value: '-' },
  { label: '1', type: 'number', value: '1' },
  { label: '2', type: 'number', value: '2' },
  { label: '3', type: 'number', value: '3' },
  { label: '+', type: 'operator', value: '+' },
  { label: '0', type: 'number', value: '0', className: 'wide' },
  { label: '.', type: 'decimal', value: '.' },
  { label: '=', type: 'equals', value: '=' }
]

const OPERATORS: Operator[] = ['+', '-', '×', '÷']

function Calculator(): JSX.Element {
  const [state, setState] = useState(initialState)

  function handleButtonClick(value: string): void {
    setState((prev) => {
      switch (value) {
        case 'clear':
          return clear(prev)
        case 'backspace':
          return backspace(prev)
        case '.':
          return inputDecimal(prev)
        case '=':
          return calculate(prev)
        default:
          if (OPERATORS.includes(value as Operator)) {
            return inputOperator(prev, value as Operator)
          }
          return inputDigit(prev, value)
      }
    })
  }

  return (
    <div className={styles.card}>
      <Display state={state} />
      <ButtonGrid buttons={BUTTONS} onButtonClick={handleButtonClick} />
    </div>
  )
}

export default Calculator
