import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

export type SecretPuzzle = {
  puzzle: string;
  answer: string;
};

export type SecretPuzzleChallenge = {
  intro: string;
  puzzle: string;
  replyPrompt: string;
};

const TOKEN_VERSION = "v1";

export function formatPuzzleChallenge(challenge: SecretPuzzleChallenge): string {
  return [challenge.intro, challenge.puzzle, challenge.replyPrompt]
    .map((part) => part.trim())
    .filter(Boolean)
    .join("\n\n");
}

export function isPlainEnglishPuzzle(puzzle: string): boolean {
  const normalized = puzzle.toLowerCase().replace(/\s+/g, " ").trim();
  const usesEncodedPuzzleLanguage =
    /\b(cipher|decode|decipher|encoded|encoding|caesar|rot\d*)\b/.test(normalized) ||
    /\b(letter shift|anagram|unscramble)\b/.test(normalized);
  const usesMathOrSequencePuzzle =
    /\b(number pattern|number sequence|next number|solve the equation)\b/.test(normalized) ||
    /\d\s*[+*/=]\s*\d/.test(normalized);
  const uppercaseCodeWords = puzzle.match(/\b[A-Z]{3,}\b/g) || [];

  return !usesEncodedPuzzleLanguage && !usesMathOrSequencePuzzle && uppercaseCodeWords.length < 2;
}

export function isTerminalPasswordRequest(content: string): boolean {
  const normalized = content.toLowerCase().replace(/\s+/g, " ").trim();

  return (
    /\b(password|passcode|passphrase)\b/.test(normalized) ||
    /\b(terminal|sudo|root|batman|dark knight)\b.{0,40}\b(secret|code|key|access|unlock)\b/.test(
      normalized
    ) ||
    /\b(what(?:'s| is)|tell|give|reveal|share|show)\b.{0,35}\bsecret\b/.test(normalized)
  );
}

function getTokenKey(secret: string): Buffer {
  return createHash("sha256").update(`byte-secret-puzzle:${secret}`).digest();
}

export function createPuzzleToken(puzzle: SecretPuzzle, secret: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getTokenKey(secret), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(puzzle), "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [
    TOKEN_VERSION,
    iv.toString("base64url"),
    authTag.toString("base64url"),
    encrypted.toString("base64url"),
  ].join(".");
}

export function readPuzzleToken(token: string, secret: string): SecretPuzzle | null {
  try {
    const [version, encodedIv, encodedAuthTag, encodedPayload, ...rest] = token.split(".");
    if (
      version !== TOKEN_VERSION ||
      !encodedIv ||
      !encodedAuthTag ||
      !encodedPayload ||
      rest.length > 0
    ) {
      return null;
    }

    const decipher = createDecipheriv(
      "aes-256-gcm",
      getTokenKey(secret),
      Buffer.from(encodedIv, "base64url")
    );
    decipher.setAuthTag(Buffer.from(encodedAuthTag, "base64url"));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encodedPayload, "base64url")),
      decipher.final(),
    ]).toString("utf8");
    const parsed = JSON.parse(decrypted) as Partial<SecretPuzzle>;

    if (
      typeof parsed.puzzle !== "string" ||
      typeof parsed.answer !== "string" ||
      !parsed.puzzle.trim() ||
      !parsed.answer.trim()
    ) {
      return null;
    }

    return { puzzle: parsed.puzzle, answer: parsed.answer };
  } catch {
    return null;
  }
}
