# Calculator

> 4칙 연산 데스크탑 계산기 — Electron + React + TypeScript

<!--
  스크린샷: 앱 실행 후 캡처하여 docs/screenshot.png 로 저장
  ![Calculator Screenshot](docs/screenshot.png)
-->

## 다운로드

[GitHub Releases](https://github.com/ischung/calculator/releases) 에서 최신 버전을 다운로드하세요.

| 플랫폼 | 파일 |
|--------|------|
| macOS | `Calculator-x.x.x.dmg` |
| Windows | `Calculator-Setup-x.x.x.exe` |

## 기능

- 사칙 연산 (`+` `-` `×` `÷`)
- 소수점 입력
- 연속 계산 (결과값으로 이어서 계산)
- `C` — 전체 초기화 / `⌫` — 한 자리 삭제
- 0 나누기 오류 감지 및 안내 메시지
- 글자 수에 따른 자동 폰트 크기 조절

## 기술 스택

| 분류 | 기술 |
|------|------|
| 런타임 | [Electron](https://www.electronjs.org/) 29 |
| UI | [React](https://react.dev/) 18 + TypeScript |
| 빌드 | [electron-vite](https://electron-vite.org/) |
| 패키징 | [electron-builder](https://www.electron.build/) |
| 테스트 | [Vitest](https://vitest.dev/) |
| 스타일 | CSS Modules + CSS Custom Properties |

## 로컬 개발 환경 실행

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 시작 (핫 리로드)
npm run dev

# 3. 테스트 실행
npm test

# 4. 린트 검사
npm run lint
```

## 패키징 (배포용 설치 파일 생성)

> 빌드 전 `build/icon.icns` (macOS), `build/icon.ico` (Windows) 아이콘 파일이 필요합니다.

```bash
# macOS (.dmg)
npm run build:mac

# Windows (.exe)
npm run build:win
```

빌드 결과물은 `dist/` 디렉토리에 생성됩니다.

## 프로젝트 구조

```
src/
├── main/               # Electron 메인 프로세스
├── preload/            # 프리로드 스크립트
└── renderer/src/
    ├── components/
    │   ├── Calculator/ # 루트 컴포넌트
    │   ├── Display/    # 수식·결과 표시
    │   └── ButtonGrid/ # 버튼 그리드
    ├── engine/         # 순수 계산 로직 (테스트 가능)
    ├── styles/         # 전역 CSS 변수(디자인 토큰)
    └── types/          # TypeScript 타입 정의
```

## 라이선스

MIT
