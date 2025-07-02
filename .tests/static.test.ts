import { beforeAll, test } from "bun:test";
import fs from "node:fs";
import path from "node:path";

// todo: move *implementation* to @reliverse/retests (or @reliverse/relienv)

const DEBUG_MODE = false;

interface TsConfig {
  compilerOptions?: {
    baseUrl?: string;
    paths?: Record<string, string[]>;
  };
}

function debugLog(...args: unknown[]) {
  if (DEBUG_MODE) {
    console.log(...args);
  }
}

const projectRoot = path.resolve(process.cwd());
let tsBaseUrl: string; // this will be an absolute path
let aliasPaths: Record<string, string[]> = {};
const ASSET_EXTENSIONS = [
  "png",
  "jpg",
  "jpeg",
  "gif",
  "svg",
  "webp",
  "css",
  "scss",
  "sass",
  "less",
  "ico",
  "json",
  "woff",
  "woff2",
  "ttf",
  "eot",
  "otf",
  "mp4",
  "webm",
  "ogg",
  "mp3",
  "wav",
  "flac",
  "aac",
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "zip",
  "tar",
  "gz",
];
const SOURCE_FILE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"];
const SCAN_DIRECTORIES = ["src"]; // We'll scan src recursively

// recursively find files with specific extensions in a directory
function findFilesRecursive(
  dir: string,
  extList: string[],
  allFiles: string[] = [],
): string[] {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    return allFiles;
  }

  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (
      file === "node_modules" ||
      file.startsWith(".") ||
      // Skip test files and configuration files
      file === "tests" ||
      file === "__tests__" ||
      file.endsWith(".test.ts") ||
      file.endsWith(".test.tsx") ||
      file.endsWith(".spec.ts") ||
      file.endsWith(".spec.tsx")
    ) {
      continue;
    }

    try {
      if (fs.statSync(filePath).isDirectory()) {
        findFilesRecursive(filePath, extList, allFiles);
      } else if (extList.some((ext) => filePath.endsWith(ext))) {
        allFiles.push(filePath);
      }
    } catch {
      // ignore files that cannot be stat'd (e.g. broken symlinks)
    }
  }
  return allFiles;
}

beforeAll(async () => {
  const tsConfigPath = path.join(projectRoot, "tsconfig.json");

  // using fs.existsSync for a quick check, as Bun.file().exists() is async
  // and we want to avoid awaiting if the file isn't there at all.
  if (fs.existsSync(tsConfigPath)) {
    try {
      const tsConfig: TsConfig = await Bun.file(tsConfigPath).json();

      tsBaseUrl = path.resolve(
        projectRoot,
        tsConfig.compilerOptions?.baseUrl || ".",
      );
      aliasPaths = tsConfig.compilerOptions?.paths || {};
    } catch (e) {
      console.error(
        "failed to parse tsconfig.json using Bun.file().json():",
        e,
      );
      // Fallback if Bun.file().json() fails (e.g. not valid JSON, though it should handle comments)
      // Yet, we should probably handle here manually the text reading + comment stripping + JSON.parse
      // For now, simple fallback:
      tsBaseUrl = projectRoot;
      aliasPaths = {};
    }
  } else {
    console.warn(
      "tsconfig.json not found at project root. asset path resolution might be limited.",
    );
    tsBaseUrl = projectRoot;
    aliasPaths = {}; // just to ensure aliasPaths is initialized
  }
});

// helper to get line number from index
function getLineNumber(content: string, index: number): number {
  return content.slice(0, index).split("\n").length;
}

test("all static assets have correct import paths", () => {
  const sourceFilesToScan: string[] = [];
  if (DEBUG_MODE) console.log("scanning directories:", SCAN_DIRECTORIES);
  for (const scanDir of SCAN_DIRECTORIES) {
    const fullPath = path.join(projectRoot, scanDir);
    if (DEBUG_MODE) console.log("scanning directory:", fullPath);
    findFilesRecursive(fullPath, SOURCE_FILE_EXTENSIONS, sourceFilesToScan);
  }
  if (DEBUG_MODE) console.log("found files to scan:", sourceFilesToScan);

  if (sourceFilesToScan.length === 0) {
    console.warn(
      `no source files found in [${SCAN_DIRECTORIES.join(", ")}] or fallback directories.`,
    );
    return;
  }

  // Track all assets to provide a summary
  const allAssets: { file: string; line: number; path: string }[] = [];
  const errors: string[] = [];

  for (const sourceFile of sourceFilesToScan) {
    const relativeSourceFilePath = path.relative(projectRoot, sourceFile);
    let content: string;
    try {
      content = fs.readFileSync(sourceFile, "utf-8");
    } catch {
      errors.push(
        `could not read file ${relativeSourceFilePath}, skipping asset checks for this file.`,
      );
      continue;
    }

    const assetPattern = `([^\'"\\\\s]+\\.(?:${ASSET_EXTENSIONS.join("|")}))`;
    const importRegex = new RegExp(
      `import\\s+(?:[^'"]*?from\\s+)?['"]([~@]?[^'"]+?\\.(?:${ASSET_EXTENSIONS.join("|")}))['"]`,
      "g",
    );
    const srcPropRegex = new RegExp(
      `src\\s*=\\s*(?:['"]${assetPattern}['"]|{\\s*['"]${assetPattern}['"]\\s*})`,
      "g",
    );
    const urlFuncRegex = new RegExp(
      `url\\((?:['"]?${assetPattern}['"]?)\\)`,
      "g",
    );

    const foundRawPaths: { line: number; path: string }[] = [];
    let match: null | RegExpExecArray = null;

    match = importRegex.exec(content);
    while (match !== null) {
      const assetPath = match[1];
      const lineNum = getLineNumber(content, match.index);
      debugLog("found import match:", assetPath, "at line", lineNum);
      foundRawPaths.push({
        line: lineNum,
        path: assetPath,
      });
      match = importRegex.exec(content);
    }
    match = srcPropRegex.exec(content);
    while (match !== null) {
      const lineNum = getLineNumber(content, match.index);
      const assetPath = match[1] || match[2];
      debugLog("found src prop match:", assetPath, "at line", lineNum);
      foundRawPaths.push({
        line: lineNum,
        path: assetPath,
      });
      match = srcPropRegex.exec(content);
    }
    match = urlFuncRegex.exec(content);
    while (match !== null) {
      const lineNum = getLineNumber(content, match.index);
      const assetPath = match[1];
      debugLog("found url() match:", assetPath, "at line", lineNum);
      foundRawPaths.push({
        line: lineNum,
        path: assetPath,
      });
      match = urlFuncRegex.exec(content);
    }

    const potentiallyLocalPaths = foundRawPaths.filter(
      (p) =>
        !p.path.startsWith("data:") &&
        !p.path.startsWith("http:") &&
        !p.path.startsWith("https:") &&
        !p.path.includes("node_modules") &&
        !p.path.includes("shepherd.js/dist/css/shepherd.css"),
    );
    const uniqueAssetPaths = [
      ...new Map(
        potentiallyLocalPaths.map((p) => [`${p.path}:${p.line}`, p]),
      ).values(),
    ];

    if (uniqueAssetPaths.length === 0) {
      debugLog("no assets found in file:", relativeSourceFilePath);
      continue;
    }

    for (const { line, path: rawAssetPath } of uniqueAssetPaths) {
      allAssets.push({
        file: relativeSourceFilePath,
        line,
        path: rawAssetPath,
      });

      let resolvedPath: null | string = null;
      const sourceFileDirectory = path.dirname(sourceFile);

      let isAlias = false;
      if (rawAssetPath.startsWith("~/")) {
        resolvedPath = path.resolve(
          projectRoot,
          "src",
          rawAssetPath.substring(2),
        );
        isAlias = true;
        debugLog("resolved ~ alias:", rawAssetPath, "->", resolvedPath);
      } else {
        for (const alias in aliasPaths) {
          let currentAliasPrefix = alias;
          if (alias.endsWith("/*")) {
            currentAliasPrefix = alias.substring(0, alias.length - 1);
          }

          if (rawAssetPath.startsWith(currentAliasPrefix)) {
            const aliasTargets = aliasPaths[alias];
            if (aliasTargets && aliasTargets.length > 0) {
              const aliasTargetDefinition = aliasTargets[0];

              let baseDirFromAliasTarget = aliasTargetDefinition;
              if (aliasTargetDefinition.endsWith("/*")) {
                baseDirFromAliasTarget = aliasTargetDefinition.substring(
                  0,
                  aliasTargetDefinition.length - 2,
                );
              } else if (aliasTargetDefinition.endsWith("/")) {
                baseDirFromAliasTarget = aliasTargetDefinition.substring(
                  0,
                  aliasTargetDefinition.length - 1,
                );
              }

              const remainingPath = rawAssetPath.substring(
                currentAliasPrefix.length,
              );

              resolvedPath = path.resolve(
                tsBaseUrl,
                baseDirFromAliasTarget,
                remainingPath,
              );
              isAlias = true;
              debugLog("resolved alias:", rawAssetPath, "->", resolvedPath);
              break;
            }
          }
        }
      }

      if (
        !isAlias &&
        (rawAssetPath.startsWith("./") || rawAssetPath.startsWith("../"))
      ) {
        resolvedPath = path.resolve(sourceFileDirectory, rawAssetPath);
        debugLog("resolved relative path:", rawAssetPath, "->", resolvedPath);
      }

      if (
        !resolvedPath &&
        !isAlias &&
        !rawAssetPath.startsWith("./") &&
        !rawAssetPath.startsWith("../")
      ) {
        const publicPath = rawAssetPath.startsWith("/")
          ? rawAssetPath.substring(1)
          : rawAssetPath;
        resolvedPath = path.resolve(projectRoot, "public", publicPath);
        debugLog("resolved public path:", rawAssetPath, "->", resolvedPath);
      }

      if (resolvedPath) {
        resolvedPath = path.normalize(resolvedPath);
        const exists = fs.existsSync(resolvedPath);
        debugLog(
          "checking asset:",
          rawAssetPath,
          "->",
          resolvedPath,
          "exists?",
          exists,
          isAlias ? "(using alias resolution)" : "(using direct path)",
        );
        if (!exists) {
          const dir = path.dirname(resolvedPath);
          if (fs.existsSync(dir)) {
            const similarFiles = fs
              .readdirSync(dir)
              .filter(
                (f) =>
                  resolvedPath &&
                  path.parse(f).name.includes(path.parse(resolvedPath).name),
              )
              .map((f) => path.join(path.relative(projectRoot, dir), f));
            if (similarFiles.length > 0) {
              errors.push(
                `Asset check failed: ${relativeSourceFilePath}:${line}\n` +
                  `  Import: ${rawAssetPath}\n` +
                  `  Resolved path: ${resolvedPath}\n` +
                  `  Using: ${isAlias ? "alias resolution" : "direct path"}\n` +
                  `  Similar files found: ${similarFiles.join(", ")}`,
              );
              continue;
            }
          }
          errors.push(
            `Asset check failed: ${relativeSourceFilePath}:${line}\n` +
              `  Import: ${rawAssetPath}\n` +
              `  Resolved path: ${resolvedPath}\n` +
              `  Using: ${isAlias ? "alias resolution" : "direct path"}`,
          );
        }
      } else {
        errors.push(
          `Failed to resolve asset path: ${relativeSourceFilePath}:${line}\n` +
            `  Import: ${rawAssetPath}`,
        );
      }
    }
  }

  if (DEBUG_MODE) {
    console.log("\nChecked assets:");
    for (const { file, line, path } of allAssets) {
      console.log(`  ${file}:${line} -> ${path}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Found invalid asset paths:\n\n${errors.join("\n\n")}`);
  }
});
