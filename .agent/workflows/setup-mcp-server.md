---
description: MCP 서버 설치 및 Claude Desktop 연동 방법
---

# MCP 서버 설정 워크플로우

이 워크플로우는 Today Work Log MCP 서버를 설치하고 Claude Desktop과 연동하는 과정을 안내합니다.

## 1. 의존성 설치

프로젝트 디렉토리로 이동하여 npm 패키지를 설치합니다.

```bash
cd /Users/kimbyungsun/project/gemini/today-work-log-mcp
npm install
```

## 2. 실행 권한 설정

index.js 파일에 실행 권한을 부여합니다.

```bash
chmod +x index.js
```

## 3. Claude Desktop 설정 파일 열기

Claude Desktop의 설정 파일을 엽니다.

```bash
open ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

파일이 없다면 생성합니다:

```bash
mkdir -p ~/Library/Application\ Support/Claude
touch ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

## 4. MCP 서버 등록

`claude_desktop_config.json` 파일에 다음 내용을 추가합니다:

```json
{
  "mcpServers": {
    "today-work-log": {
      "command": "node",
      "args": ["/Users/kimbyungsun/project/gemini/today-work-log-mcp/index.js"]
    }
  }
}
```

이미 다른 MCP 서버가 등록되어 있다면, `mcpServers` 객체 안에 `today-work-log` 항목만 추가합니다.

## 5. Claude Desktop 재시작

설정을 적용하기 위해 Claude Desktop을 완전히 종료하고 다시 시작합니다.

1. Claude Desktop 완전 종료 (Cmd+Q)
2. Claude Desktop 다시 실행

## 6. MCP 도구 확인

Claude Desktop에서 MCP 도구가 정상적으로 로드되었는지 확인합니다.

대화창에서 다음과 같이 요청하여 테스트:

```
오늘 작업한 내용을 요약해줘
리포지토리 경로: /Users/kimbyungsun/project/gemini/workflow
```

Claude가 `get_todays_git_diff` 도구를 사용하여 커밋 내역을 가져와야 합니다.

## 사용 예시

### TIL 작성

```
오늘의 작업 내역을 바탕으로 TIL을 작성해줘
리포지토리: /Users/kimbyungsun/project/gemini/workflow
```

### 업무 보고서

```
오늘 작업한 내용으로 간단한 업무 보고서를 만들어줘
리포지토리: /Users/kimbyungsun/project/gemini/gameNews
```

### 여러 리포지토리 통합

```
다음 리포지토리들의 오늘 작업 내역을 각각 요약해줘:
1. /Users/kimbyungsun/project/gemini/workflow
2. /Users/kimbyungsun/project/gemini/gameNews
```
