import { describe, it, expect } from 'vitest'
import {
  initialState,
  inputDigit,
  inputDecimal,
  inputOperator,
  calculate,
  clear,
  backspace
} from '../calculatorEngine'
import type { CalculatorState } from '../../../../types/calculator'

// ─── helpers ────────────────────────────────────────────────────────────────

function buildState(partial: Partial<CalculatorState>): CalculatorState {
  return { ...initialState, ...partial }
}

// ─── initialState ────────────────────────────────────────────────────────────

describe('initialState', () => {
  it('displayValue가 "0"이다', () => {
    expect(initialState.displayValue).toBe('0')
  })

  it('모든 필드가 기본값이다', () => {
    expect(initialState.firstOperand).toBeNull()
    expect(initialState.operator).toBeNull()
    expect(initialState.waitingForSecond).toBe(false)
    expect(initialState.isError).toBe(false)
    expect(initialState.lastOperator).toBeNull()
    expect(initialState.lastOperand).toBeNull()
  })
})

// ─── inputDigit ──────────────────────────────────────────────────────────────

describe('inputDigit', () => {
  it('숫자를 입력하면 displayValue에 반영된다', () => {
    expect(inputDigit(initialState, '5').displayValue).toBe('5')
  })

  it('"0" 상태에서 숫자 입력 시 교체된다', () => {
    expect(inputDigit(initialState, '3').displayValue).toBe('3')
  })

  it('연속 숫자 입력 시 이어붙여진다', () => {
    let s = inputDigit(initialState, '1')
    s = inputDigit(s, '2')
    s = inputDigit(s, '3')
    expect(s.displayValue).toBe('123')
  })

  it('"0" 상태에서 "0" 입력 시 "00"이 되지 않는다 — 엣지케이스 1', () => {
    expect(inputDigit(initialState, '0').displayValue).toBe('0')
  })

  it('연산자 직후 숫자 입력 시 새 숫자로 시작한다', () => {
    const s = buildState({ displayValue: '5', firstOperand: 5, operator: '+', waitingForSecond: true })
    const result = inputDigit(s, '3')
    expect(result.displayValue).toBe('3')
    expect(result.waitingForSecond).toBe(false)
  })

  it('오류 상태에서 입력을 무시한다', () => {
    const s = buildState({ isError: true })
    expect(inputDigit(s, '5')).toBe(s)
  })

  it('원본 state를 변경하지 않는다 (순수 함수)', () => {
    inputDigit(initialState, '9')
    expect(initialState.displayValue).toBe('0')
  })
})

// ─── inputDecimal ────────────────────────────────────────────────────────────

describe('inputDecimal', () => {
  it('소수점을 추가한다', () => {
    expect(inputDecimal(initialState).displayValue).toBe('0.')
  })

  it('이미 소수점이 있으면 무시한다 — 엣지케이스 2', () => {
    const s = buildState({ displayValue: '3.' })
    expect(inputDecimal(s)).toBe(s)
  })

  it('소수점 중복 연속 입력 시 displayValue가 변하지 않는다', () => {
    let s = inputDecimal(initialState)
    s = inputDecimal(s)
    expect(s.displayValue).toBe('0.')
  })

  it('연산자 직후 소수점 입력 시 "0."으로 시작한다', () => {
    const s = buildState({ displayValue: '5', firstOperand: 5, operator: '+', waitingForSecond: true })
    const result = inputDecimal(s)
    expect(result.displayValue).toBe('0.')
    expect(result.waitingForSecond).toBe(false)
  })

  it('오류 상태에서 입력을 무시한다', () => {
    const s = buildState({ isError: true })
    expect(inputDecimal(s)).toBe(s)
  })
})

// ─── inputOperator ───────────────────────────────────────────────────────────

describe('inputOperator', () => {
  it('연산자를 입력하면 firstOperand와 operator가 설정된다', () => {
    const s = inputDigit(initialState, '5')
    const result = inputOperator(s, '+')
    expect(result.firstOperand).toBe(5)
    expect(result.operator).toBe('+')
    expect(result.waitingForSecond).toBe(true)
  })

  it('연산자 연속 입력 시 마지막 연산자로 교체된다 — 엣지케이스 3', () => {
    let s = inputDigit(initialState, '5')
    s = inputOperator(s, '+')
    s = inputOperator(s, '-')
    expect(s.operator).toBe('-')
  })

  it('결과 표시 후 연산자 입력 시 결과값이 첫 번째 피연산자가 된다', () => {
    let s = inputDigit(initialState, '5')
    s = inputOperator(s, '+')
    s = inputDigit(s, '3')
    s = calculate(s)        // 8
    s = inputOperator(s, '×')
    expect(s.firstOperand).toBe(8)
    expect(s.operator).toBe('×')
  })

  it('오류 상태에서 입력을 무시한다', () => {
    const s = buildState({ isError: true })
    expect(inputOperator(s, '+')).toBe(s)
  })
})

// ─── calculate ───────────────────────────────────────────────────────────────

describe('calculate', () => {
  it('5 + 3 = 결과가 "8"이다', () => {
    let s = inputDigit(initialState, '5')
    s = inputOperator(s, '+')
    s = inputDigit(s, '3')
    expect(calculate(s).displayValue).toBe('8')
  })

  it('곱셈이 올바르다', () => {
    let s = inputDigit(initialState, '4')
    s = inputOperator(s, '×')
    s = inputDigit(s, '7')
    expect(calculate(s).displayValue).toBe('28')
  })

  it('뺄셈이 올바르다', () => {
    let s = inputDigit(initialState, '9')
    s = inputOperator(s, '-')
    s = inputDigit(s, '4')
    expect(calculate(s).displayValue).toBe('5')
  })

  it('나눗셈이 올바르다', () => {
    let s = inputDigit(initialState, '9')
    s = inputOperator(s, '÷')
    s = inputDigit(s, '3')
    expect(calculate(s).displayValue).toBe('3')
  })

  it('5 ÷ 0 = 계산 시 isError가 true가 된다 — 엣지케이스 4', () => {
    let s = inputDigit(initialState, '5')
    s = inputOperator(s, '÷')
    s = inputDigit(s, '0')
    expect(calculate(s).isError).toBe(true)
  })

  it('= 연속 입력 시 마지막 연산이 반복된다 (5 + 3 = = → 11) — 엣지케이스 5', () => {
    let s = inputDigit(initialState, '5')
    s = inputOperator(s, '+')
    s = inputDigit(s, '3')
    s = calculate(s)   // 8
    s = calculate(s)   // 8 + 3 = 11
    expect(s.displayValue).toBe('11')
  })

  it('계산 후 operator와 firstOperand가 초기화된다', () => {
    let s = inputDigit(initialState, '5')
    s = inputOperator(s, '+')
    s = inputDigit(s, '3')
    s = calculate(s)
    expect(s.operator).toBeNull()
    expect(s.firstOperand).toBeNull()
    expect(s.waitingForSecond).toBe(false)
  })

  it('부동소수점 오차 없이 계산된다 (0.1 + 0.2) — 엣지케이스 6', () => {
    let s = inputDigit(initialState, '0')
    s = inputDecimal(s)
    s = inputDigit(s, '1')
    s = inputOperator(s, '+')
    s = inputDigit(s, '0')
    s = inputDecimal(s)
    s = inputDigit(s, '2')
    s = calculate(s)
    expect(parseFloat(s.displayValue)).toBeCloseTo(0.3, 10)
  })
})

// ─── clear ───────────────────────────────────────────────────────────────────

describe('clear', () => {
  it('clear() 호출 시 initialState를 반환한다', () => {
    const s = inputDigit(initialState, '5')
    const result = clear(s)
    expect(result.displayValue).toBe('0')
    expect(result.firstOperand).toBeNull()
    expect(result.operator).toBeNull()
  })

  it('초기 상태에서 clear() 호출 시 동일 참조를 반환한다', () => {
    expect(clear(initialState)).toBe(initialState)
  })

  it('오류 상태에서 clear() 호출 시 정상 초기 상태로 복귀한다 — 엣지케이스 7', () => {
    const s = buildState({ isError: true, displayValue: 'Error' })
    const result = clear(s)
    expect(result.isError).toBe(false)
    expect(result.displayValue).toBe('0')
  })

  it('연산 도중 clear() 호출 시 완전히 초기화된다', () => {
    let s = inputDigit(initialState, '9')
    s = inputOperator(s, '+')
    const result = clear(s)
    expect(result.firstOperand).toBeNull()
    expect(result.operator).toBeNull()
    expect(result.waitingForSecond).toBe(false)
  })
})

// ─── backspace ───────────────────────────────────────────────────────────────

describe('backspace', () => {
  it('"123" → "12"로 줄어든다', () => {
    const s = buildState({ displayValue: '123' })
    expect(backspace(s).displayValue).toBe('12')
  })

  it('한 자리 숫자에서 backspace 시 "0"이 된다', () => {
    const s = buildState({ displayValue: '5' })
    expect(backspace(s).displayValue).toBe('0')
  })

  it('결과 표시 중 backspace 호출 시 상태가 변경되지 않는다', () => {
    const s = buildState({ displayValue: '8', lastOperator: '+', lastOperand: 3, firstOperand: null })
    expect(backspace(s)).toBe(s)
  })

  it('소수점 포함 숫자에서 backspace가 동작한다', () => {
    const s = buildState({ displayValue: '3.14' })
    expect(backspace(s).displayValue).toBe('3.1')
  })

  it('오류 상태에서 backspace 호출 시 무시된다', () => {
    const s = buildState({ isError: true })
    expect(backspace(s)).toBe(s)
  })
})
