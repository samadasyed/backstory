import OpenAI from "openai";
import { contentPlanSchema, type ContentPlan, type LearningContext } from "../shared/contracts.js";
import { contentPlanJsonSchema } from "../shared/content-plan-schema.js";

const fixturePlan: ContentPlan = {
  hook: "Gatsby's rumor resume is doing a lot",
  angle: "Frame Gatsby's Chapter 4 backstory as a carefully constructed social profile.",
  format: "kinetic-cards",
  beats: [
    { text: "Oxford?", framing: "fact", sourceId: "source-gatsby" },
    { text: "Inherited fortune?", framing: "fact", sourceId: "source-gatsby" },
    { text: "He brought receipts.", framing: "interpretation", sourceId: "source-gatsby" }
  ],
  conceptTags: ["mystery", "identity", "social-performance"],
  revealsThrough: 4
};

export async function createContentPlan(context: LearningContext): Promise<{
  plan: ContentPlan;
  mode: "fixture" | "gpt-5.6";
}> {
  if (!process.env.OPENAI_API_KEY) {
    return { plan: fixturePlan, mode: "fixture" };
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.responses.create({
    model: "gpt-5.6",
    instructions:
      "You are Backstory's curriculum-aware editorial planner. Create one low-pressure, entertaining short-form post. Ground every beat in the supplied source. Never reveal beyond completedThrough. Do not create a quiz, grade, task, or mastery judgment.",
    input: JSON.stringify({
      learningContext: context,
      availableSource: {
        id: "source-gatsby",
        title: "The Great Gatsby",
        locator: "Current assigned chapters"
      }
    }),
    text: {
      format: {
        type: "json_schema",
        name: "backstory_content_plan",
        strict: true,
        schema: contentPlanJsonSchema
      }
    }
  });

  const plan = contentPlanSchema.parse(JSON.parse(response.output_text));
  if (plan.revealsThrough > context.focus.spoilerBoundary.completedThrough) {
    throw new Error("Generated plan crossed the spoiler boundary");
  }

  return { plan, mode: "gpt-5.6" };
}
