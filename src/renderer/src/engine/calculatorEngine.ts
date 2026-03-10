import type { CalculatorState, Operator } from '../../../types/calculator'

export const initialState: CalculatorState = {
  displayValue: '0',
  expression: '',
  firstOperand: null,
  operator: null,
  waitingForSecond: false,
  isError: false,
  lastOperator: null,
  lastOperand: null
}

export function inputDigit(state: CalculatorState, digit: string): CalculatorState {
  if (state.isError) return state

  if (state.waitingForSecond) {
    return {
      ...state,
      displayValue: digit,
      waitingForSecond: false
    }
  }

  // 중복 0 방지: 현재 displayValue가 '0'이고 입력도 '0'이면 무시
  if (state.displayValue === '0' && digit === '0') {
    return state
  }

  // 현재 '0'이면 교체, 아니면 이어붙임
  const newDisplayValue =
    state.displayValue === '0' ? digit : state.displayValue + digit

  return {
    ...state,
    displayValue: newDisplayValue
  }
}

export function inputDecimal(state: CalculatorState): CalculatorState {
  if (state.isError) return state

  // 연산자 직후: '0.'으로 시작
  if (state.waitingForSecond) {
    return {
      ...state,
      displayValue: '0.',
      waitingForSecond: false
    }
  }

  // 이미 소수점이 있으면 무시
  if (state.displayValue.includes('.')) {
    return state
  }

  return {
    ...state,
    displayValue: state.displayValue + '.'
  }
}

export function inputOperator(state: CalculatorState, operator: Operator): CalculatorState {
  if (state.isError) return state

  const currentValue = parseFloat(state.displayValue)

  // 숫자 없이 연산자 입력 시 무시 (단, '-'는 음수 부호로 허용 — 추후 inputDigit에서 처리)
  if (state.firstOperand === null && state.waitingForSecond) {
    // 이미 연산자 대기 중: 마지막 연산자로 교체
    return { ...state, operator }
  }

  // 결과 표시 후 연산자 입력: 결과값을 첫 번째 피연산자로 사용
  if (state.firstOperand !== null && !state.waitingForSecond && state.operator) {
    const result = performCalculation(state.firstOperand, currentValue, state.operator)
    return {
      ...state,
      displayValue: formatResult(result),
      firstOperand: result,
      operator,
      waitingForSecond: true,
      expression: `${formatResult(result)} ${operator}`
    }
  }

  return {
    ...state,
    firstOperand: currentValue,
    operator,
    waitingForSecond: true,
    expression: `${state.displayValue} ${operator}`
  }
}

export function calculate(state: CalculatorState): CalculatorState {
  if (state.isError) return state

  const currentValue = parseFloat(state.displayValue)

  // = 연속 입력: lastOperator + lastOperand로 재연산
  if (state.firstOperand === null && state.lastOperator !== null && state.lastOperand !== null) {
    const result = performCalculation(currentValue, state.lastOperand, state.lastOperator)
    if (result === null) {
      return { ...state, isError: true, displayValue: 'Error', expression: '' }
    }
    return {
      ...state,
      displayValue: formatResult(result),
      expression: '',
      firstOperand: null,
      operator: null,
      waitingForSecond: false
    }
  }

  if (state.firstOperand === null || state.operator === null) return state

  const secondOperand = state.waitingForSecond ? state.firstOperand : currentValue
  const result = performCalculation(state.firstOperand, secondOperand, state.operator)

  if (result === null) {
    return { ...state, isError: true, displayValue: 'Error', expression: '' }
  }

  return {
    ...state,
    displayValue: formatResult(result),
    expression: '',
    firstOperand: null,
    operator: null,
    waitingForSecond: false,
    lastOperator: state.operator,
    lastOperand: secondOperand
  }
}

function performCalculation(a: number, b: number, operator: Operator): number | null {
  switch (operator) {
    case '+': return a + b
    case '-': return a - b
    case '×': return a * b
    case '÷': return b === 0 ? null : a / b
  }
}

function formatResult(value: number): string {
  // 부동소수점 오차 방지: 최대 10자리 유효숫자
  const result = parseFloat(value.toPrecision(10))
  return String(result)
}

export type { Operator }
