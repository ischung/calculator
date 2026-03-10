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

export function clear(state: CalculatorState): CalculatorState {
  // 이미 초기 상태면 무시
  if (
    state.displayValue === '0' &&
    state.firstOperand === null &&
    state.operator === null &&
    !state.waitingForSecond &&
    !state.isError
  ) {
    return state
  }

  return { ...initialState }
}

export function backspace(state: CalculatorState): CalculatorState {
  if (state.isError) return state

  // 결과 표시 중(연산 완료 후 waitingForSecond가 false이고 lastOperator가 있는 상태)이면 무시
  if (state.lastOperator !== null && state.firstOperand === null) {
    return state
  }

  // 한 자리이거나 음수 한 자리('-5' 등)면 '0'으로
  if (state.displayValue.length <= 1 || (state.displayValue.startsWith('-') && state.displayValue.length <= 2)) {
    return { ...state, displayValue: '0' }
  }

  return {
    ...state,
    displayValue: state.displayValue.slice(0, -1)
  }
}

export type { Operator }
