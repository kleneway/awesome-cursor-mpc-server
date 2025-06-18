import { z } from "zod";
import OpenAI from "openai";
import { settings } from "../settings.js";

/**
 * Architect tool
 *   - Calls an OpenAI model (o3-mini-01-31-24) to generate a series of steps
 *   - Input: 'task' (description of the task), 'code' (one or more code files concatenated)
 */

export const architectToolName = "architect";
export const architectToolDescription =
  "Analyzes a task description plus some code, then outlines steps for an AI coding agent.";

export const ArchitectToolSchema = z.object({
  task: z.string().min(1, "Task description is required."),
  code: z
    .string()
    .min(1, "Code string is required (one or more files concatenated)."),
});

export async function runArchitectTool(
  args: z.infer<typeof ArchitectToolSchema>,
) {
  // Instantiate the new OpenAI client
  const openai = new OpenAI({
    baseURL: settings.OPENAI_BASE_URL,
    apiKey: settings.OPENAI_API_KEY,
  });

  const { task, code } = args;
  const systemPrompt = `You are an expert software architect. Given a task and some code, outline the steps that an AI coding agent should take to complete or improve the code.`;

  // We'll prompt the model with both the task and code
  const userPrompt = `Task: ${task}\n\nCode:\n${code}\n\nPlease provide a step-by-step plan.`;

  try {
    const response = await openai.chat.completions.create({
      model: "o3-mini-2025-01-31",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    // Extract the content from the assistant's message (if available)
    const assistantMessage =
      response.choices?.[0]?.message?.content ?? "No response from model.";

    return {
      content: [
        {
          type: "text",
          text: assistantMessage,
        },
      ],
    };
  } catch (error: any) {
    // If the request fails, return the error as text
    return {
      content: [
        {
          type: "text",
          text: `OpenAI Error: ${error.message || error}`,
        },
      ],
    };
  }
}
