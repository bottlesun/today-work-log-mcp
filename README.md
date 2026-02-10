# Today Work Log MCP Server

로컬 Git 리포지토리에서 오늘의 작업 내역(커밋 + 코드 변경사항)을 추출하는 MCP(Model Context Protocol) 서버입니다.

## 기능

- 오늘 자정(00:00) 이후 작성한 모든 커밋 조회
- 현재 Git 사용자의 커밋만 필터링
- 코드 변경사항(Diff) 포함
- Merge 커밋 제외
- Claude Desktop, Cursor 등 MCP 클라이언트와 연동 가능

## 설치

```bash
cd /path/to/today-work-log-mcp
npm install
chmod +x index.js
```

## 사용 방법

### Claude Desktop 설정

`~/Library/Application Support/Claude/claude_desktop_config.json` 파일에 다음 설정을 추가하세요:

```json
{
  "mcpServers": {
    "today-work-log": {
      "command": "node",
      "args": ["/path/to/today-work-log-mcp/index.js"]
    }
  }
}
```

### Cursor 설정

Cursor의 MCP 설정 파일에 유사하게 추가:

```json
{
  "mcpServers": {
    "today-work-log": {
      "command": "node",
      "args": ["/path/to/today-work-log-mcp/index.js"]
    }
  }
}
```

## MCP Tool 사용

설정 후 Claude Desktop을 재시작하면 `get_todays_git_diff` 도구를 사용할 수 있습니다.

**예시:**

```
오늘 작업한 내용을 요약해줘
리포지토리 경로: /path/to/your-repo
```

Claude가 자동으로 `get_todays_git_diff` 도구를 호출하여 커밋 내역과 코드 변경사항을 가져온 후 요약해줍니다.

## 출력 형식

```
📊 오늘의 Git 작업 내역 (2026. 2. 10.)

작성자: Kim Byungsun
리포지토리: /path/to/your-repo

========================================
Commit: abc123...
Author: Kim Byungsun <email@example.com>
Date: Mon Feb 10 15:30:00 2026
Subject: feat: Add new feature

[커밋 메시지 본문]

========================================

diff --git a/file.js b/file.js
index abc123..def456 100644
--- a/file.js
+++ b/file.js
@@ -10,7 +10,7 @@
[코드 변경사항]
...
```

## 기술 스택

- Node.js
- [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/sdk) - MCP 공식 SDK
- [zod](https://github.com/colinhacks/zod) - 스키마 검증

## 라이선스

MIT
