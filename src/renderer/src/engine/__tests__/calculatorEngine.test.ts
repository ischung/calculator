import { describe, it, expect } from 'vitest'
import { initialState, inputDigit, inputDecimal, inputOperator, calculate } from '../calculatorEngine'
import type { CalculatorState } from '../../../../types/calculator'

describe('initialState', () => {
  it('displayValue가 "0"이다', () => {
    expect(initialState.displayValue).toBe('0')
  })

  it('모든 초기값이 올바르다', () => {
    expect(initialState.firstOperand).toBeNull()
    expect(initialState.operator).toBeNull()
    expect(initialState.waitingForSecond).toBe(false)
    expect(initialState.isError).toBe(false)
  })
})

describe('inputDigit', () => {
  it('숫자를 입력하면 displayValue에 추가된다', () => {
    const result = inputDigit(initialState, '5')
    expect(result.displayValue).toBe('5')
  })

  it('"0" 상태에서 숫자 입력 시 교체된다', () => {
    const result = inputDigit(initialState, '3')
    expect(result.displayValue).toBe('3')
  })

  it('연속 숫자 입력 시 이어붙여진다', () => {
    let state = inputDigit(initialState, '1')
    state = inputDigit(state, '2')
    state = inputDigit(state, '3')
    expect(state.displayValue).toBe('123')
  })

  it('"0" 상태에서 "0" 입력 시 "00"이 되지 않는다', () => {
    const result = inputDigit(initialState, '0')
    expect(result.displayValue).toBe('0')
  })

  it('연산자 직후(waitingForSecond) 숫자 입력 시 새 숫자로 시작한다', () => {
    const stateAfterOperator: CalculatorState = {
      ...initialState,
      displayValue: '5',
      firstOperand: 5,
      operator: '+',
      waitingForSecond: true
    }
    const result = inputDigit(stateAfterOperator, '3')
    expect(result.displayValue).toBe('3')
    expect(result.waitingForSecond).toBe(false)
  })

  it('오류 상태에서 입력을 무시한다', () => {
    const errorState: CalculatorState = { ...initialState, isError: true }
    const result = inputDigit(errorState, '5')
    expect(result).toBe(errorState)
  })

  it('원본 state를 변경하지 않는다 (순수 함수)', () => {
    const original = { ...initialState }
    inputDigit(initialState, '5')
    expect(initialState.displayValue).toBe(original.displayValue)
  })
})

describe('inputDecimal', () => {
  it('소수점을 추가한다', () => {
    const result = inputDecimal(initialState)
    expect(result.displayValue).toBe('0.')
  })

  it('이미 소수점이 있으면 상태가 변경되지 않는다', () => {
    const stateWithDecimal: CalculatorState = {
      ...initialState,
      displayValue: '3.'
    }
    const result = inputDecimal(stateWithDecimal)
    expect(result).toBe(stateWithDecimal)
  })

  it('소수점 중복 입력 시 displayValue가 변하지 않는다', () => {
    let state = inputDecimal(initialState)
    state = inputDecimal(state)
    expect(state.displayValue).toBe('0.')
  })

  it('연산자 직후(waitingForSecond) 소수점 입력 시 "0."으로 시작한다', () => {
    const stateAfterOperator: CalculatorState = {
      ...initialState,
      displayValue: '5',
      firstOperand: 5,
      operator: '+',
      waitingForSecond: true
    }
    const result = inputDecimal(stateAfterOperator)
    expect(result.displayValue).toBe('0.')
    expect(result.waitingForSecond).toBe(false)
  })

  it('오류 상태에서 입력을 무시한다', () => {
    const errorState: CalculatorState = { ...initialState, isError: true }
    const result = inputDecimal(errorState)
    expect(result).toBe(errorState)
  })

  it('원본 state를 변경하지 않는다 (순수 함수)', () => {
    const original = { ...initialState }
    inputDecimal(initialState)
    expect(initialState.displayValue).toBe(original.displayValue)
  })
})

describe('inputOperator', () => {
  it('연산자를 입력하면 firstOperand와 operator가 설정된다', () => {
    const state = inputDigit(initialState, '5')
    const result = inputOperator(state, '+')
    expect(result.firstOperand).toBe(5)
    expect(result.operator).toBe('+')
    expect(result.waitingForSecond).toBe(true)
  })

  it('연산자 연속 입력 시 마지막 연산자로 교체된다', () => {
    let state = inputDigit(initialState, '5')
    state = inputOperator(state, '+')
    state = inputOperator(state, '-')
    expect(state.operator).toBe('-')
    expect(state.waitingForSecond).toBe(true)
  })

  it('결과 표시 후 연산자 입력 시 결과값이 첫 번째 피연산자가 된다', () => {
    let state = inputDigit(initialState, '5')
    state = inputOperator(state, '+')
    state = inputDigit(state, '3')
    state = calculate(state)         // 결과: 8
    state = inputOperator(state, '×')
    expect(state.firstOperand).toBe(8)
    expect(state.operator).toBe('×')
  })

  it('오류 상태에서 입력을 무시한다', () => {
    const errorState: CalculatorState = { ...initialState, isError: true }
    const result = inputOperator(errorState, '+')
    expect(result).toBe(errorState)
  })
})

describe('calculate', () => {
  it('5 + 3 = 결과가 "8"이다', () => {
    let state = inputDigit(initialState, '5')
    state = inputOperator(state, '+')
    state = inputDigit(state, '3')
    state = calculate(state)
    expect(state.displayValue).toBe('8')
  })

  it('5 ÷ 0 = 계산 시 isError가 true가 된다', () => {
    let state = inputDigit(initialState, '5')
    state = inputOperator(state, '÷')
    state = inputDigit(state, '0')
    state = calculate(state)
    expect(state.isError).toBe(true)
  })

  it('= 연속 입력 시 마지막 연산이 반복된다 (5 + 3 = = → 11)', () => {
    let state = inputDigit(initialState, '5')
    state = inputOperator(state, '+')
    state = inputDigit(state, '3')
    state = calculate(state)   // 8
    state = calculate(state)   // 8 + 3 = 11
    expect(state.displayValue).toBe('11')
  })

  it('곱셈이 올바르다', () => {
    let state = inputDigit(initialState, '4')
    state = inputOperator(state, '×')
    state = inputDigit(state, '7')
    state = calculate(state)
    expect(state.displayValue).toBe('28')
  })

  it('뺄셈이 올바르다', () => {
    let state = inputDigit(initialState, '9')
    state = inputOperator(state, '-')
    state = inputDigit(state, '4')
    state = calculate(state)
    expect(state.displayValue).toBe('5')
  })

  it('나눗셈이 올바르다', () => {
    let state = inputDigit(initialState, '9')
    state = inputOperator(state, '÷')
    state = inputDigit(state, '3')
    state = calculate(state)
    expect(state.displayValue).toBe('3')
  })

  it('계산 후 operator와 firstOperand가 초기화된다', () => {
    let state = inputDigit(initialState, '5')
    state = inputOperator(state, '+')
    state = inputDigit(state, '3')
    state = calculate(state)
    expect(state.operator).toBeNull()
    expect(state.firstOperand).toBeNull()
    expect(state.waitingForSecond).toBe(false)
  })
})
