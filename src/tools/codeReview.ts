import { z } from "zod";
import { execFileSync } from "child_process";

/**
 * CodeReview tool
 *   - Takes in a file path and runs "git diff main -- <filePath>"
 *   - Returns the diff along with instructions to review and fix issues
 */

export const codeReviewToolName = "code-review";
export const codeReviewToolDescription =
  "Run a git diff against main on a specified file and provide instructions to review/fix issues.";

export const CodeReviewToolSchema = z.object({
  folderPath: z.string().min(1, "A folder path is required."),
});

export async function runCodeReviewTool(
  args: z.infer<typeof CodeReviewToolSchema>,
) {
  const { folderPath } = args;

  let diffOutput = "";
  try {
    diffOutput = execFileSync("git", ["-C", folderPath, "diff"], {
      encoding: "utf-8",
    });
  } catch (error) {
    // If there's an error (e.g., no git repo, or the file doesn't exist), include it in the response.
    diffOutput = `Error running git diff: ${error}`;
  }

  const instructions =
    "Review this diff for any obvious issues. Fix them if found, then finalize the changes.";

  const message = `Git Diff Output:\n${diffOutput}\n\nInstructions:\n${instructions}`;

  return {
    content: [
      {
        type: "text",
        text: message,
      },
    ],
  };
}
