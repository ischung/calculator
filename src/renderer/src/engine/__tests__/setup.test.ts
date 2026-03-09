// Vitest 환경 동작 확인용 샘플 테스트
// CalculatorEngine 구현 후 실제 테스트로 교체 예정 (Issue #7)
describe('Vitest 환경 설정', () => {
  it('테스트 환경이 정상 동작한다', () => {
    expect(true).toBe(true)
  })

  it('기본 산술 연산이 올바르다', () => {
    expect(1 + 1).toBe(2)
    expect(10 - 3).toBe(7)
    expect(4 * 5).toBe(20)
    expect(10 / 2).toBe(5)
  })
})
