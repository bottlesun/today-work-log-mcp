#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';
import { access, constants } from 'fs/promises';

const execAsync = promisify(exec);

// Tool input schema
const GetTodaysGitDiffSchema = z.object({
  repo_path: z.string().describe('Absolute path to the local Git repository'),
});

/**
 * Check if a path exists and is accessible
 */
async function pathExists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Execute a Git command in the specified repository
 */
async function execGitCommand(repoPath, command) {
  try {
    const { stdout, stderr } = await execAsync(command, {
      cwd: repoPath,
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large diffs
      timeout: 30000, // 30 second timeout
    });
    
    if (stderr && !stderr.includes('warning')) {
      console.error(`Git stderr: ${stderr}`);
    }
    
    return stdout.trim();
  } catch (error) {
    throw new Error(`Git command failed: ${error.message}`);
  }
}

/**
 * Get today's Git work log with diffs
 */
async function getTodaysGitDiff(repoPath) {
  // 1. Validate repository path
  if (!(await pathExists(repoPath))) {
    throw new Error(`Repository path does not exist: ${repoPath}`);
  }

  // Check if it's a Git repository
  const gitDirExists = await pathExists(`${repoPath}/.git`);
  if (!gitDirExists) {
    throw new Error(`Not a Git repository: ${repoPath}`);
  }

  // 2. Get current user name
  let userName;
  try {
    userName = await execGitCommand(repoPath, 'git config user.name');
  } catch (error) {
    throw new Error(`Failed to get Git user name: ${error.message}`);
  }

  if (!userName) {
    throw new Error('Git user name is not configured');
  }

  // 3. Get today's commits with diffs
  const gitLogCommand = `git log --since="midnight" --author="${userName}" --no-merges --patch --pretty=format:"========================================%nCommit: %H%nAuthor: %an <%ae>%nDate: %ad%nSubject: %s%n%n%b%n========================================%n"`;

  let logOutput;
  try {
    logOutput = await execGitCommand(repoPath, gitLogCommand);
  } catch (error) {
    throw new Error(`Failed to get Git log: ${error.message}`);
  }

  // 4. Check if there are any commits
  if (!logOutput || logOutput.length === 0) {
    return `📅 오늘 작업 내역 없음 (${new Date().toLocaleDateString('ko-KR')})\n\n작성자: ${userName}\n리포지토리: ${repoPath}\n\n오늘 자정(00:00) 이후로 커밋한 내역이 없습니다.`;
  }

  // 5. Format the output
  const header = `📊 오늘의 Git 작업 내역 (${new Date().toLocaleDateString('ko-KR')})\n\n작성자: ${userName}\n리포지토리: ${repoPath}\n\n`;
  
  return header + logOutput;
}

/**
 * Main server setup
 */
async function main() {
  const server = new Server(
    {
      name: 'today-work-log-mcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'get_todays_git_diff',
          description:
            '로컬 Git 리포지토리에서 오늘 자정(00:00) 이후 작성한 커밋과 코드 변경사항(diff)을 추출합니다. TIL(Today I Learned) 작성이나 작업 내역 요약에 유용합니다.',
          inputSchema: {
            type: 'object',
            properties: {
              repo_path: {
                type: 'string',
                description: '분석할 Git 리포지토리의 절대 경로 (예: /Users/username/project/my-repo)',
              },
            },
            required: ['repo_path'],
          },
        },
      ],
    };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === 'get_todays_git_diff') {
      try {
        const args = GetTodaysGitDiffSchema.parse(request.params.arguments);
        const result = await getTodaysGitDiff(args.repo_path);

        return {
          content: [
            {
              type: 'text',
              text: result,
            },
          ],
        };
      } catch (error) {
        // Return error as text content instead of throwing
        return {
          content: [
            {
              type: 'text',
              text: `❌ 오류 발생: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }

    throw new Error(`Unknown tool: ${request.params.name}`);
  });

  // Start the server
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('Today Work Log MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
