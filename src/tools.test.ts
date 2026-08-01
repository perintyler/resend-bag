import { describe, it, expect } from "vitest";
import * as mainTools from "./tools.js";
import * as inboxTools from "./inbox.js";
import * as spamTools from "./spam.js";

type ToolShape = { name: string; namespace: string; handler: Function; description: string };

function extractTools(mod: Record<string, unknown>): ToolShape[] {
  return Object.values(mod).filter(
    (v): v is ToolShape =>
      typeof v === "object" && v !== null && "name" in v && "handler" in v,
  );
}

const allTools = [
  ...extractTools(mainTools),
  ...extractTools(inboxTools),
  ...extractTools(spamTools),
];

describe("tool exports", () => {
  it("exports tools from all three modules", () => {
    expect(extractTools(mainTools).length).toBeGreaterThan(0);
    expect(extractTools(inboxTools).length).toBeGreaterThan(0);
    expect(extractTools(spamTools).length).toBeGreaterThan(0);
  });

  it("exports at least one tool total", () => {
    expect(allTools.length).toBeGreaterThan(0);
  });

  for (const tool of allTools) {
    describe(tool.name, () => {
      it("has required fields", () => {
        expect(tool.name).toBeTruthy();
        expect(tool.namespace).toBeTruthy();
        expect(typeof tool.handler).toBe("function");
        expect(tool.description).toBeTruthy();
      });
    });
  }
});

describe("non-tool exports", () => {
  it("requireEnv is a function, not a tool", () => {
    expect(typeof mainTools.requireEnv).toBe("function");
    expect(mainTools.requireEnv).not.toHaveProperty("handler");
  });
});
