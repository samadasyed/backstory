import {
  demoStateSchema,
  feedResponseSchema,
  studentProfileSchema,
  type DemoState,
  type FeedEvent,
  type FeedResponse,
  type StudentProfile
} from "../shared/contracts";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    }
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getFeed(): Promise<FeedResponse> {
  return feedResponseSchema.parse(await request<unknown>("/api/feed"));
}

export async function getProfile(): Promise<StudentProfile> {
  return studentProfileSchema.parse(await request<unknown>("/api/profile"));
}

export async function sendEvent(event: FeedEvent): Promise<void> {
  await request("/api/events", {
    method: "POST",
    body: JSON.stringify({ events: [event] })
  });
}

export async function updateDemoState(state: DemoState): Promise<DemoState> {
  const payload = await request<unknown>("/api/demo/gatsby-position", {
    method: "PATCH",
    body: JSON.stringify(state)
  });
  return demoStateSchema.parse(payload);
}

export async function resetDemo(): Promise<void> {
  await request("/api/demo/reset", { method: "POST" });
}

export async function generatePlan(courseId: string): Promise<{ mode: string; courseId: string; plan: { hook: string; angle: string } }> {
  return request("/api/ai/plan", {
    method: "POST",
    body: JSON.stringify({ courseId })
  });
}
