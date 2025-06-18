import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import {
  screenshotToolName,
  screenshotToolDescription,
  ScreenshotToolSchema,
  runScreenshotTool,
} from "./tools/screenshot.js";

import {
  architectToolName,
  architectToolDescription,
  ArchitectToolSchema,
  runArchitectTool,
} from "./tools/architect.js";

import {
  codeReviewToolName,
  codeReviewToolDescription,
  CodeReviewToolSchema,
  runCodeReviewTool,
} from "./tools/codeReview.js";

/**
 * A minimal MCP server providing three Cursor Tools:
 *   1) Screenshot
 *   2) Architect
 *   3) CodeReview
 */

// 1. Create an MCP server instance
const server = new Server(
  {
    name: "cursor-tools",
    version: "2.0.1",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// 2. Define the list of tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: screenshotToolName,
        description: screenshotToolDescription,
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "Full URL to screenshot",
            },
            relativePath: {
              type: "string",
              description: "Relative path appended to http://localhost:3000",
            },
            fullPathToScreenshot: {
              type: "string",
              description:
                "Path to where the screenshot file should be saved. This should be a cwd-style full path to the file (not relative to the current working directory) including the file name and extension.",
            },
          },
          required: [],
        },
      },
      {
        name: architectToolName,
        description: architectToolDescription,
        inputSchema: {
          type: "object",
          properties: {
            task: {
              type: "string",
              description: "Description of the task",
            },
            code: {
              type: "string",
              description: "Concatenated code from one or more files",
            },
          },
          required: ["task", "code"],
        },
      },
      {
        name: codeReviewToolName,
        description: codeReviewToolDescription,
        inputSchema: {
          type: "object",
          properties: {
            folderPath: {
              type: "string",
              description:
                "Path to the full root directory of the repository to diff against target branch",
            },
          },
          required: ["folderPath"],
        },
      },
    ],
  };
});

// 3. Implement the tool call logic
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case screenshotToolName: {
      const validated = ScreenshotToolSchema.parse(args);
      return await runScreenshotTool(validated);
    }
    case architectToolName: {
      const validated = ArchitectToolSchema.parse(args);
      return await runArchitectTool(validated);
    }
    case codeReviewToolName: {
      const validated = CodeReviewToolSchema.parse(args);
      return await runCodeReviewTool(validated);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// 4. Start the MCP server with a stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Cursor Tools MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
