import OpenAI from "openai";
import { contentPlanSchema, type ContentPlan, type LearningContext } from "../shared/contracts.js";
import { contentPlanJsonSchema } from "../shared/content-plan-schema.js";

export function planAsksViewerQuestion(plan: ContentPlan): boolean {
  return [plan.hook, plan.angle, ...plan.beats.map((beat) => beat.text)].some((text) => text.includes("?"));
}

function createFixturePlan(context: LearningContext, courseId: string): ContentPlan {
  const focus = context.focuses.find((candidate) => candidate.courseId === courseId) ?? context.focuses[0]!;
  const sourceId = focus.learningItem.resourceIds[0]!;
  const hooks: Record<string, string> = {
    "course-english-10": "Gatsby's rumor resume is doing a lot",
    "course-world-history": "The famous Cold War hotline arrived after the crisis",
    "course-biology": "Cells use checkpoints before they commit to dividing",
    "course-algebra-2": "Doubling stays quiet until the numbers get astronomical"
  };

  return {
    hook: hooks[focus.courseId] ?? `The backstory behind ${focus.topic}`,
    angle: `Turn ${focus.topic} into one low-pressure visual story grounded in the current class resource.`,
    format: "kinetic-cards",
    beats: [
      { text: focus.learningItem.title, framing: "fact", sourceId },
      { text: focus.concepts[0] ?? focus.topic, framing: "fact", sourceId },
      { text: "The pattern, shown in motion.", framing: "creative", sourceId }
    ],
    conceptTags: focus.concepts.slice(0, 3),
    revealsThrough: focus.sequenceBoundary.completedThrough
  };
}

export async function createContentPlan(context: LearningContext, requestedCourseId?: string): Promise<{
  plan: ContentPlan;
  mode: "fixture" | "gpt-5.6";
  courseId: string;
}> {
  const focus = requestedCourseId
    ? context.focuses.find((candidate) => candidate.courseId === requestedCourseId)
    : context.focuses[0];
  if (!focus) throw new Error("Unknown course context");

  if (!process.env.OPENAI_API_KEY) {
    return { plan: createFixturePlan(context, focus.courseId), mode: "fixture", courseId: focus.courseId };
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.responses.create({
    model: "gpt-5.6",
    instructions:
      "You are Backstory's curriculum-aware editorial planner. Create one passive, entertaining short-form post that asks nothing from the viewer. Ground every beat in the supplied source. Never reveal beyond completedThrough. Do not ask a question, solicit an answer, create a poll, quiz, grade, task, checkpoint, or mastery judgment.",
    input: JSON.stringify({
      learningContext: {
        studentId: context.studentId,
        course: context.courses.find((course) => course.id === focus.courseId),
        focus
      },
      availableSource: {
        id: focus.learningItem.resourceIds[0],
        title: focus.learningItem.title,
        locator: focus.learningItem.sequence?.label ?? "Current class material"
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
  if (plan.revealsThrough > focus.sequenceBoundary.completedThrough) {
    throw new Error("Generated plan crossed the course sequence boundary");
  }
  if (planAsksViewerQuestion(plan)) {
    throw new Error("Generated plan asked the viewer a question");
  }

  return { plan, mode: "gpt-5.6", courseId: focus.courseId };
}
