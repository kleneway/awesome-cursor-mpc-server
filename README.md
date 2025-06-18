# 🤖 AI Development Assistant MCP Server

Welcome to your AI-powered development toolkit, designed as a Model Context Protocol (MCP) server for Cursor! This project provides intelligent coding assistance through custom AI tools. Note that this is mostly a tutorial demo, and not a production-ready tool.

## ✨ Features

### 🎨 Code Architect

Call advanced reasoning LLMs to generate plans and instructions for coding agents.

### 📸 Screenshot Buddy

Take UI design screenshots and use them with the composer agent.

### 🔍 Code Review

Use git diffs to trigger code reviews against configurable target branches.

## 🚀 Getting Started

### 1. Environment Setup

Configure the server using environment variables in your `mcp.json` (cursor will suggest to create this file according to "Adding to Cursor below"):

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | Yes | - | Your OpenAI API key |
| `OPENAI_BASE_URL` | No | OpenAI default | Custom API endpoint (e.g., for Perplexity) |
| `OPENAI_MODEL` | No | `o3-mini-2025-01-31` | LLM model to use |
| `CODE_REVIEW_TARGET_BRANCH_NAME` | No | `main` | Target branch for code reviews |

> ⚠️ **Security Note**: Never commit API keys to source control. Always use environment variables for sensitive data.

> ⚠️ **Security Note**: Project consists of backward compatible solution with configuring secretes via [env/keys.ts](env/keys.ts), but it does not recommended.

### 2. Installation

```bash
npm install
# or
yarn install
```

### 3. Build the Server

```bash
npm run build
```

### 4. Adding to Cursor

This project is designed to be used as an MCP server in Cursor. Here's how to set it up:

1. Open Cursor
2. Go to `Cursor Settings > Features > MCP`
3. Click `+ Add New MCP Server`
4. Fill out the `mcp.json`:
```json
{
    "mcpServers": {
      "ai-development-assistant": {
        "command": "node",
        "args": ["/path/to/your/project/build/awesome-cursor-mpc-server/build/index.js"],
        "env": {
          "OPENAI_API_KEY": "get your key from https://platform.openai.com/api-keys",
          "OPENAI_BASE_URL": "optional to use Perplexity e.g.",
          "OPENAI_MODEL": "optional <...>",
          "CODE_REVIEW_TARGET_BRANCH_NAME": "optional <...>" 
        }
      }
    }
}
```

> 📘 **Pro Tip**: You might need to use the full path to your project's built index.js file.

After adding the server, you should see your tools listed under "Available Tools". If not, try clicking the refresh button in the top right corner of the MCP server section.

For more details about MCP setup, check out the [Cursor MCP Documentation](https://docs.cursor.com/advanced/model-context-protocol).

## 🛠️ Using the Tools

Once configured, you can use these tools directly in Cursor's Composer. The AI will automatically suggest using relevant tools, or you can explicitly request them by name or description.

For example, try typing in Composer:

- "Review this code for best practices"
- "Help me architect a new feature"
- "Analyze this UI screenshot"

The agent will ask for your approval before making any tool calls.

> 📘 **Pro Tip**: You can update your .cursorrules file with instructions on how to use the tools for certain scenarios, and the agent will use the tools automatically.

> 📘 **Pro Tip**: To make sure server is used for e.g. "Review this code for best practices" you could add smth like "use code review tool"

## 📁 Project Structure

```
src/
├── tools/
│   ├── architect.ts    # Code structure generator
│   ├── screenshot.ts   # Screenshot analysis tool
│   └── codeReview.ts   # Code review tool
├── env/                # Deprecated! Legacy, add env to mcp.json instead
│   └── keys.ts         # Deprecated! Legacy, add env to mcp.json instead
├── settings.ts        # Environment variables and server configuration
└── index.ts           # Main entry point
```

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Issues & Support

Found a bug or need help? Open an issue with:

1. What you were trying to do
2. What happened instead
3. Steps to reproduce
4. Your environment details

---

I'll be honest though, this is a tutorial demo, and not a production-ready tool so I likely won't be fixing issues. But feel free to fork it and make it your own!

Made with ❤️ by developers, for developers
