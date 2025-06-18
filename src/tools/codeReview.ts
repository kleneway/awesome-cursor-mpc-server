import { z } from "zod";
import { execSync } from "child_process";
import { settings } from "../settings.js";

/**
 * CodeReview tool
 *   - Takes in a file path and runs "git diff <CODE_REVIEW_TARGET_BRANCH_NAME>"
 *   - Returns the diff along with instructions to review and fix issues
 */

export const codeReviewToolName = "code-review";
export const codeReviewToolDescription =
  "Run a git diff against CODE_REVIEW_TARGET_BRANCH_NAME on a specified file and provide instructions to review/fix issues.";

export const CodeReviewToolSchema = z.object({
  folderPath: z.string().min(1, "A folder path is required."),
});

export async function runCodeReviewTool(
  args: z.infer<typeof CodeReviewToolSchema>,
) {
  const { folderPath } = args;

  let diffOutput = "";
  try {
    diffOutput = execSync(`git -C "${folderPath}" diff ${settings.CODE_REVIEW_TARGET_BRANCH_NAME}...HEAD`, {
      encoding: "utf-8",
      maxBuffer: 1024 * 1024 * 10,
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