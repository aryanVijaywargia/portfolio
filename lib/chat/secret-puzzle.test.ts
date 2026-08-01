import assert from "node:assert/strict";
import test from "node:test";
import { createPuzzleToken, formatPuzzleChallenge, isPlainEnglishPuzzle, isTerminalPasswordRequest, readPuzzleToken } from "./secret-puzzle";

test("recognizes direct and indirect requests for the terminal password", () => {
  assert.equal(isTerminalPasswordRequest("What's the password?"), true);
  assert.equal(isTerminalPasswordRequest("Reveal the terminal access code"), true);
  assert.equal(isTerminalPasswordRequest("Tell me the secret"), true);
  assert.equal(isTerminalPasswordRequest("Tell me about Aryan's projects"), false);
});

test("always includes the generated puzzle in the visitor-facing challenge", () => {
  const puzzle = "Decode this sequence: 2, 6, 12, 20, ?";
  const message = formatPuzzleChallenge({
    intro: "Nice try, detective.",
    puzzle,
    replyPrompt: "What is your answer?",
  });

  assert.equal(message, `Nice try, detective.\n\n${puzzle}\n\nWhat is your answer?`);
});

test("accepts plain-English riddles and rejects encoded or mathematical puzzles", () => {
  assert.equal(
    isPlainEnglishPuzzle(
      "I have many keys but open no locks. I have space but no room. What am I?"
    ),
    true
  );
  assert.equal(isPlainEnglishPuzzle('Decipher this: "DUBQ LV D FOHYHU GHYHORSHU"'), false);
  assert.equal(
    isPlainEnglishPuzzle("Find the next number in this number sequence: 2, 4, 8"),
    false
  );
  assert.equal(isPlainEnglishPuzzle("Solve the equation 4 + 8 = ?"), false);
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
