export type Operator = '+' | '-' | '×' | '÷'

export type ButtonType = 'number' | 'operator' | 'equals' | 'clear' | 'backspace' | 'decimal'

export interface CalculatorState {
  displayValue: string
  expression: string
  firstOperand: number | null
  operator: Operator | null
  waitingForSecond: boolean
  isError: boolean
  lastOperator: Operator | null
  lastOperand: number | null
}

export interface ButtonConfig {
  label: string
  type: ButtonType
  value: string
  className?: string
}
