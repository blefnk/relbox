import { expect, test } from "bun:test";

// todo: move *implementation* to @reliverse/retests

const IGNORE_MISSING: string[] = [];
const IGNORE_PLACEHOLDERS: string[] = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_SERVER_APP_URL",
];

// utility to parse .env.example
// and return a map of key -> value
async function getEnvExampleVars() {
  const envExamplePath = ".env.example";
  const envExampleFile = Bun.file(envExamplePath);
  if (!(await envExampleFile.exists())) {
    throw new Error(
      `❌ required file '${envExamplePath}' not found in project root. this test relies on it to determine expected env variables.`,
    );
  }
  const envExampleContent = await envExampleFile.text();
  const lines = envExampleContent.split("\n");
  const vars: Record<string, string> = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.substring(0, eqIdx).trim();
    let value = trimmed.substring(eqIdx + 1).trim();
    // remove surrounding quotes if present
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    vars[key] = value;
  }
  // if (Object.keys(vars).length === 0 && envExampleContent.trim().length > 0) {
  //   console.warn(
  //     `⚠️ no variables parsed from ${envExamplePath}, but the file is not empty. ensure it contains valid 'KEY=value' lines not starting with '#'.`,
  //   );
  // }
  return vars;
}

test("all required environment variables are defined based on .env.example", async () => {
  const exampleVars = await getEnvExampleVars();
  const expectedEnvVars = Object.keys(exampleVars).filter(
    (key) => !IGNORE_MISSING.includes(key),
  );

  const missingVars: string[] = [];
  for (const varName of expectedEnvVars) {
    if (!(varName in process.env) || !process.env[varName]) {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    console.error(
      "❌ missing environment variables (expected from .env.example):",
      JSON.stringify(missingVars, null, 2),
    );
  }

  expect(missingVars).toEqual([]);
});

test("values in .env file should not be placeholders from .env.example", async () => {
  const exampleVars = await getEnvExampleVars();
  const sensitiveEnvKeys = Object.keys(exampleVars).filter(
    (key) => !IGNORE_PLACEHOLDERS.includes(key),
  );

  for (const key of sensitiveEnvKeys) {
    if (process.env[key]) {
      const currentValue = process.env[key];
      const placeholderValue = exampleVars[key];
      expect(
        () => {
          if (currentValue === placeholderValue) {
            throw new Error(
              `${key} must not use its placeholder value: ${placeholderValue}`,
            );
          }
        },
        // ==================================
        // 1️⃣  Copy .env.example file to .env
        // 2️⃣  REPLACE THE VALUES WITH YOUR OWN CREDENTIALS
        // 3️⃣  Remember to never share .env file/keys with anyone
        // ==================================
      ).not.toThrow();
    }
  }
});
