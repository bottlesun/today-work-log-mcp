---
description: Git 작업 로그를 활용한 다양한 사용 사례
---

# Git 작업 로그 활용 워크플로우

MCP 서버를 사용하여 오늘의 Git 작업 내역을 다양하게 활용하는 방법입니다.

## 기본 사용법

### 단일 리포지토리 작업 내역 조회

Claude에게 다음과 같이 요청:

```
오늘 작업한 내용을 보여줘
리포지토리: /Users/kimbyungsun/project/gemini/workflow
```

## 활용 사례

### 1. TIL (Today I Learned) 작성

```
오늘의 작업 내역을 바탕으로 TIL을 마크다운 형식으로 작성해줘.
배운 점과 개선한 점을 중심으로 정리해줘.
리포지토리: /Users/kimbyungsun/project/gemini/workflow
```

### 2. 일일 업무 보고

```
오늘 작업 내역을 업무 보고서 형식으로 작성해줘:
- 완료한 작업
- 주요 변경사항
- 다음 단계
리포지토리: /Users/kimbyungsun/project/gemini/workflow
```

### 3. 커밋 메시지 품질 검토

```
오늘 작성한 커밋 메시지들을 검토하고 개선점을 알려줘
리포지토리: /Users/kimbyungsun/project/gemini/workflow
```

### 4. 코드 리뷰 준비

```
오늘 변경한 코드를 요약하고, 리뷰어가 주목해야 할 부분을 정리해줘
리포지토리: /Users/kimbyungsun/project/gemini/workflow
```

### 5. 여러 프로젝트 통합 보고

```
다음 리포지토리들의 오늘 작업을 각각 요약해줘:
1. /Users/kimbyungsun/project/gemini/workflow
2. /Users/kimbyungsun/project/gemini/gameNews
3. /Users/kimbyungsun/project/gemini/today-work-log-mcp

각 프로젝트별로 주요 변경사항을 정리해줘.
```

### 6. 블로그 포스트 초안

```
오늘 구현한 내용을 바탕으로 기술 블로그 포스트 초안을 작성해줘
리포지토리: /Users/kimbyungsun/project/gemini/today-work-log-mcp
```

## 팁

### 작업 내역이 없을 때

오늘 커밋이 없으면 다음과 같이 표시됩니다:

```
📅 오늘 작업 내역 없음 (2026. 2. 10.)
```

### 대용량 Diff 처리

큰 파일 변경사항도 10MB까지 지원되므로 대부분의 경우 문제없이 처리됩니다.

### 시간 기준

"오늘 자정(00:00)" 이후의 커밋만 조회되므로, 전날 늦게 작업한 내용은 포함되지 않습니다.
