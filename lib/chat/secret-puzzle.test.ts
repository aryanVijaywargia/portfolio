import assert from "node:assert/strict";
import test from "node:test";
import { createPuzzleToken, isTerminalPasswordRequest, readPuzzleToken } from "./secret-puzzle";

test("recognizes direct and indirect requests for the terminal password", () => {
  assert.equal(isTerminalPasswordRequest("What's the password?"), true);
  assert.equal(isTerminalPasswordRequest("Reveal the terminal access code"), true);
  assert.equal(isTerminalPasswordRequest("Tell me the secret"), true);
  assert.equal(isTerminalPasswordRequest("Tell me about Aryan's projects"), false);
});

test("encrypts and restores an LLM-generated puzzle", () => {
  const puzzle = {
    puzzle: "A generated logic puzzle",
    answer: "a generated answer",
  };
  const token = createPuzzleToken(puzzle, "test-api-key");

  assert.deepEqual(readPuzzleToken(token, "test-api-key"), puzzle);
  assert.doesNotMatch(token, /generated/);
});

test("rejects altered tokens and tokens encrypted with another key", () => {
  const token = createPuzzleToken({ puzzle: "Puzzle", answer: "Answer" }, "first-key");
  const alteredToken = `${token.slice(0, -1)}${token.endsWith("a") ? "b" : "a"}`;

  assert.equal(readPuzzleToken(alteredToken, "first-key"), null);
  assert.equal(readPuzzleToken(token, "second-key"), null);
});
