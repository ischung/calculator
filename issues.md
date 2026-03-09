# Issues — 4칙 연산 계산기

> **원본 TechSpec**: techspec.md
> **생성일**: 2026-03-10
> **총 이슈 수**: 15개
> **총 예상 소요**: 4일 (병렬 작업 기준)

---

## #1 [Setup] Electron + Vite + React + TypeScript 프로젝트 초기화

**레이블**: Setup
**예상 소요**: 0.5일
**의존성**: 없음

### 설명

현재 빈 저장소 상태로, 개발을 시작하기 위한 프로젝트 뼈대가 없다.
`electron-vite` 공식 스캐폴딩을 사용하여 Electron + Vite + React + TypeScript 기반 프로젝트를 초기화하고, TechSpec에 정의된 폴더 구조를 확립한다.

```
src/
├── main/
├── renderer/
│   ├── components/
│   │   ├── Calculator/
│   │   ├── Display/
│   │   ├── ButtonGrid/
│   │   └── Button/
│   ├── engine/
│   └── styles/
└── types/
```

### 수락 기준 (Acceptance Criteria)

- [ ] `npm run dev` 실행 시 Electron 창이 정상적으로 열린다
- [ ] TypeScript 컴파일 오류 없이 빌드된다
- [ ] TechSpec §2-3의 폴더 구조가 그대로 반영되어 있다
- [ ] `package.json`에 Electron, React, TypeScript, Vite 의존성이 명시되어 있다

### 참고

- TechSpec 섹션: §2, §3, §8 Phase 1
- 관련 이슈: 없음

---

## #2 [Setup] ESLint, Prettier, Vitest 개발 환경 설정

**레이블**: Setup
**예상 소요**: 0.5일
**의존성**: Depends on #1

### 설명

프로젝트 초기화 후 코드 품질 도구가 설정되어 있지 않다.
ESLint(린팅), Prettier(포맷팅), Vitest(단위 테스트)를 설정하여 일관된 코드 스타일과 테스트 환경을 확립한다.

### 수락 기준 (Acceptance Criteria)

- [ ] `npm run lint` 실행 시 ESLint가 정상 동작한다
- [ ] `npm run format` 실행 시 Prettier가 파일을 자동 포맷한다
- [ ] `npm run test` 실행 시 Vitest가 정상 동작한다
- [ ] `.eslintrc`, `.prettierrc` 설정 파일이 존재한다
- [ ] VSCode 저장 시 자동 포맷 적용을 위한 `.vscode/settings.json`이 포함된다

### 참고

- TechSpec 섹션: §3, §8 Phase 1
- 관련 이슈: #1

---

## #3 [Infra] GitHub Actions CI 파이프라인 구성 (lint + test)

**레이블**: Infra
**예상 소요**: 0.5일
**의존성**: Depends on #2

### 설명

현재 PR 머지 시 코드 품질을 자동으로 검증하는 파이프라인이 없다.
GitHub Actions를 사용하여 PR 생성/업데이트 시 lint와 test를 자동 실행하는 CI 워크플로우를 구성한다.

### 수락 기준 (Acceptance Criteria)

- [ ] `.github/workflows/ci.yml` 파일이 존재한다
- [ ] PR 생성 시 lint + test 잡이 자동으로 트리거된다
- [ ] lint 또는 test 실패 시 PR 머지가 차단된다
- [ ] Node.js 버전은 20.x LTS를 사용한다

### 참고

- TechSpec 섹션: §2-3, §8 Phase 1
- 관련 이슈: #2

---

## #4 [Core Logic] CalculatorEngine — 숫자·소수점 입력 함수 구현

**레이블**: Core Logic
**예상 소요**: 0.5일
**의존성**: Depends on #1

### 설명

계산기의 핵심 로직을 담당하는 `CalculatorEngine` 모듈이 존재하지 않는다.
`inputDigit`과 `inputDecimal` 함수를 순수 함수(pure function)로 구현한다.

구현 조건:
- `inputDigit`: 숫자를 이어붙이되, 중복 `0` 입력 방지, 연산자 직후 새 숫자 시작
- `inputDecimal`: 소수점 중복 무시, 연산자 직후 `0.`으로 자동 시작

### 수락 기준 (Acceptance Criteria)

- [ ] `inputDigit(state, '5')` 호출 시 `displayValue`가 `'5'`로 업데이트된다
- [ ] `'0'` 상태에서 `inputDigit(state, '0')` 호출 시 `'00'`이 되지 않는다
- [ ] `inputDecimal` 호출 시 소수점이 이미 있으면 상태가 변경되지 않는다
- [ ] 연산자 직후 `inputDecimal` 호출 시 `displayValue`가 `'0.'`이 된다
- [ ] 모든 함수가 원본 state를 변경하지 않는 순수 함수로 구현된다

### 참고

- TechSpec 섹션: §4, §5, §6-4
- 관련 이슈: #5, #6

---

## #5 [Core Logic] CalculatorEngine — 연산자·계산 실행 함수 구현

**레이블**: Core Logic
**예상 소요**: 0.5일
**의존성**: Depends on #4

### 설명

연산자 선택과 계산 실행 로직이 없다.
`inputOperator`와 `calculate` 함수를 구현한다.

구현 조건:
- `inputOperator`: 연산자 연속 입력 시 마지막 연산자로 교체, 숫자 없이 연산자 입력 시 무시 (단, `-`는 음수 부호 허용)
- `calculate`: `=` 실행, 결과 후 `=` 반복 시 `lastOperator`+`lastOperand`로 재연산, 0으로 나누기 시 `isError: true`

### 수락 기준 (Acceptance Criteria)

- [ ] `5 + 3 =` 계산 결과가 `'8'`이다
- [ ] `5 ÷ 0 =` 계산 시 `isError`가 `true`가 된다
- [ ] 연산자 연속 입력(`5 + -`) 시 마지막 연산자(`-`)로 교체된다
- [ ] `=` 연속 입력 시 마지막 연산이 반복된다 (`5 + 3 = =` → `11`)
- [ ] 결과 표시 후 연산자 입력 시 결과값이 첫 번째 피연산자가 된다

### 참고

- TechSpec 섹션: §4, §5, §6-4
- 관련 이슈: #4, #6

---

## #6 [Core Logic] CalculatorEngine — 초기화·Backspace 및 엣지케이스 처리

**레이블**: Core Logic
**예상 소요**: 0.5일
**의존성**: Depends on #4

### 설명

`clear`와 `backspace` 함수 및 전체 엣지케이스 처리가 없다.
`clear`, `backspace` 함수를 구현하고 §6-4의 모든 엣지케이스를 처리한다.

구현 조건:
- `clear`: 전체 상태 초기화, 초기 상태에서 호출 시 무시
- `backspace`: 마지막 자리 삭제, 한 자리 시 `'0'`으로, 결과 표시 중 무시

### 수락 기준 (Acceptance Criteria)

- [ ] `clear()` 호출 시 `displayValue`가 `'0'`인 초기 상태를 반환한다
- [ ] 초기 상태에서 `clear()` 호출 시 상태가 변경되지 않는다
- [ ] `backspace`로 `'123'` → `'12'`로 줄어든다
- [ ] `backspace`로 한 자리 숫자 → `'0'`이 된다
- [ ] 결과 표시 중 `backspace` 호출 시 상태가 변경되지 않는다
- [ ] 오류 상태에서 `clear()` 호출 시 정상 초기 상태로 복귀한다

### 참고

- TechSpec 섹션: §5, §6-4
- 관련 이슈: #4, #5

---

## #7 [Test] CalculatorEngine 단위 테스트 작성 (커버리지 80% 이상)

**레이블**: Test
**예상 소요**: 1일
**의존성**: Depends on #4, #5, #6

### 설명

CalculatorEngine의 모든 함수에 대한 단위 테스트가 없다.
Vitest를 사용하여 6개 함수(`inputDigit`, `inputDecimal`, `inputOperator`, `calculate`, `clear`, `backspace`)의 정상 케이스, 엣지케이스를 모두 커버하는 테스트를 작성한다.

### 수락 기준 (Acceptance Criteria)

- [ ] `npm run test` 실행 시 모든 테스트가 통과한다
- [ ] 코드 커버리지 80% 이상을 달성한다
- [ ] 각 함수별 정상 케이스 최소 2개 이상 테스트한다
- [ ] §6-4의 엣지케이스 7가지가 모두 테스트된다
- [ ] 테스트 파일은 `src/renderer/engine/__tests__/` 디렉토리에 위치한다

### 참고

- TechSpec 섹션: §5, §6-4
- 관련 이슈: #4, #5, #6

---

## #8 [Frontend] Calculator 루트 컴포넌트 및 상태 관리 구현

**레이블**: Frontend
**예상 소요**: 0.5일
**의존성**: Depends on #4, #5, #6

### 설명

React 컴포넌트가 존재하지 않는다.
`Calculator` 컴포넌트를 구현하여 `CalculatorState`를 `useState`로 관리하고, 버튼 클릭 이벤트를 받아 엔진 함수를 호출하는 중앙 컨트롤러 역할을 담당하게 한다.

### 수락 기준 (Acceptance Criteria)

- [ ] `Calculator` 컴포넌트가 `CalculatorState`를 `useState`로 보유한다
- [ ] 버튼 클릭 시 적절한 엔진 함수가 호출되고 상태가 업데이트된다
- [ ] `Display`와 `ButtonGrid`에 필요한 props를 올바르게 전달한다
- [ ] 컴포넌트가 TechSpec §6-1의 책임 정의를 준수한다

### 참고

- TechSpec 섹션: §6-1, §6-3
- 관련 이슈: #9, #10

---

## #9 [Frontend] Display 컴포넌트 구현 (글자 크기 자동 조절 포함)

**레이블**: Frontend
**예상 소요**: 0.5일
**의존성**: Depends on #8

### 설명

디스플레이 화면이 없다.
`Display` 컴포넌트를 구현하여 수식(`expression`)과 현재값(`displayValue`)을 표시하고, 자릿수에 따라 글자 크기를 자동 조절한다.

글자 크기 기준:
- 1~9자: 48px
- 10~12자: 36px
- 13자 이상: 28px

### 수락 기준 (Acceptance Criteria)

- [ ] `expression`이 상단에 작게, `displayValue`가 하단에 크게 표시된다
- [ ] `displayValue` 길이에 따라 글자 크기가 자동으로 조절된다
- [ ] 오류 상태에서 `"앗, 0으로 나눌 수 없어요!"`가 표시된다
- [ ] 오류 메시지는 `--color-error` 색상으로 표시된다

### 참고

- TechSpec 섹션: §6-1, §7-2, §7-4
- 관련 이슈: #8

---

## #10 [Frontend] ButtonGrid + Button 컴포넌트 구현

**레이블**: Frontend
**예상 소요**: 0.5일
**의존성**: Depends on #8

### 설명

버튼 UI가 없다.
`ButtonGrid` 컴포넌트로 4×5 그리드 레이아웃을 구성하고, `Button` 컴포넌트로 개별 버튼을 렌더링한다. `0` 버튼은 가로 2칸으로 표시한다.

버튼 레이아웃:
```
[ C  ] [ ⌫ ] [   ] [ ÷ ]
[ 7  ] [ 8  ] [ 9 ] [ × ]
[ 4  ] [ 5  ] [ 6 ] [ - ]
[ 1  ] [ 2  ] [ 3 ] [ + ]
[   0    ] [ . ] [ = ]
```

### 수락 기준 (Acceptance Criteria)

- [ ] 19개 버튼이 4×5 그리드로 올바르게 배치된다
- [ ] `0` 버튼이 가로 2칸(`162px`)을 차지한다
- [ ] 각 버튼의 `type`(number/operator/equals/clear/backspace/decimal)에 따라 다른 스타일이 적용된다
- [ ] 버튼 클릭 시 `onButtonClick` 콜백이 올바른 값으로 호출된다

### 참고

- TechSpec 섹션: §6-1, §6-2, §7-5
- 관련 이슈: #8, #11

---

## #11 [UI/UX] 디자인 토큰 및 전체 스타일 적용

**레이블**: UI/UX
**예상 소요**: 0.5일
**의존성**: Depends on #10

### 설명

스타일이 적용되지 않은 상태이다.
TechSpec §7-1의 CSS Custom Properties(디자인 토큰)를 전역으로 정의하고, 카드형 레이아웃과 각 컴포넌트의 스타일을 CSS Modules로 구현한다.

### 수락 기준 (Acceptance Criteria)

- [ ] `global.css`에 §7-1의 모든 CSS Custom Properties가 정의된다
- [ ] 계산기가 딥 네이비(`#1a1a2e`) 배경 위 카드형으로 중앙에 표시된다
- [ ] 카드 너비 `360px`, 모서리 `24px`, 그림자 효과가 적용된다
- [ ] 숫자/연산자/등호/클리어 버튼이 각각 다른 색상으로 표시된다
- [ ] 타이포그래피가 §7-2 사양을 준수한다

### 참고

- TechSpec 섹션: §7-1, §7-2, §7-5
- 관련 이슈: #12

---

## #12 [UI/UX] 버튼 애니메이션 및 오류 메시지 UI 구현

**레이블**: UI/UX
**예상 소요**: 0.5일
**의존성**: Depends on #11

### 설명

버튼 인터랙션 피드백과 오류 상태 UI가 없다.
버튼 클릭 시 scale down 애니메이션을 적용하고, 오류 메시지의 시각적 표현을 완성한다.

### 수락 기준 (Acceptance Criteria)

- [ ] 버튼 클릭(`:active`) 시 `scale(0.93)` 애니메이션이 동작한다
- [ ] 애니메이션 전환 시간이 `0.1s ease`이다
- [ ] 오류 메시지가 `--color-error(#ff6b6b)` 색상으로 표시된다
- [ ] 오류 상태에서 `C` 버튼 클릭 시 즉시 정상 상태로 복귀한다

### 참고

- TechSpec 섹션: §7-3
- 관련 이슈: #11

---

## #13 [Infra] Electron Builder 패키징 설정 (macOS/Windows)

**레이블**: Infra
**예상 소요**: 0.5일
**의존성**: Depends on #8

### 설명

현재 개발 환경에서만 실행 가능하고 배포용 설치 파일을 만들 수 없다.
Electron Builder를 설정하여 macOS(.dmg)와 Windows(.exe) 설치 파일을 생성할 수 있도록 한다.

### 수락 기준 (Acceptance Criteria)

- [ ] `npm run build:mac` 실행 시 `.dmg` 파일이 생성된다
- [ ] `npm run build:win` 실행 시 `.exe` 파일이 생성된다
- [ ] 빌드된 앱이 설치 후 정상적으로 실행된다
- [ ] `electron-builder.yml`에 앱 이름, 아이콘, 버전이 설정된다

### 참고

- TechSpec 섹션: §2-3, §8 Phase 4
- 관련 이슈: #14

---

## #14 [Infra] GitHub Actions 자동 릴리즈 파이프라인 추가

**레이블**: Infra
**예상 소요**: 0.5일
**의존성**: Depends on #3, #13

### 설명

태그 푸시 시 배포 파일을 자동으로 빌드하고 GitHub Releases에 업로드하는 파이프라인이 없다.
`v*` 태그 푸시 시 macOS/Windows 빌드 후 GitHub Releases에 자동 업로드하는 워크플로우를 추가한다.

### 수락 기준 (Acceptance Criteria)

- [ ] `.github/workflows/release.yml` 파일이 존재한다
- [ ] `v1.0.0` 태그 푸시 시 릴리즈 워크플로우가 자동 트리거된다
- [ ] 빌드된 `.dmg`, `.exe` 파일이 GitHub Releases에 자동 첨부된다
- [ ] 릴리즈 노트가 자동으로 생성된다

### 참고

- TechSpec 섹션: §2-3, §8 Phase 4
- 관련 이슈: #3, #13

---

## #15 [Docs] README.md 작성 (스크린샷 포함)

**레이블**: Docs
**예상 소요**: 0.5일
**의존성**: Depends on #12, #13

### 설명

프로젝트에 README가 없어 GitHub 방문자가 앱의 목적과 실행 방법을 알 수 없다.
프로젝트 소개, 스크린샷, 설치/실행 방법, 기술 스택을 포함한 README.md를 작성한다.

### 수락 기준 (Acceptance Criteria)

- [ ] 앱 스크린샷이 1장 이상 포함된다
- [ ] 로컬 개발 환경 실행 방법(`npm install`, `npm run dev`)이 명시된다
- [ ] 다운로드 링크 (GitHub Releases) 섹션이 포함된다
- [ ] 기술 스택 표가 포함된다
- [ ] 한국어 또는 영어로 작성된다

### 참고

- TechSpec 섹션: §8 Phase 4
- 관련 이슈: #14
