export const contentPlanJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["hook", "angle", "format", "beats", "conceptTags", "revealsThrough"],
  properties: {
    hook: { type: "string" },
    angle: { type: "string" },
    format: {
      type: "string",
      enum: ["kinetic-cards", "relationship-map", "forecast"]
    },
    beats: {
      type: "array",
      minItems: 3,
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["text", "framing", "sourceId"],
        properties: {
          text: { type: "string" },
          framing: { type: "string", enum: ["fact", "interpretation", "creative"] },
          sourceId: { type: "string" }
        }
      }
    },
    conceptTags: {
      type: "array",
      items: { type: "string" },
      minItems: 1
    },
    revealsThrough: { type: "integer", minimum: 0 }
  }
} as const;
