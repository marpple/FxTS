import { cp, readFile, writeFile } from "fs/promises";
import { glob } from "glob";

const OUTPUT_DIR = "./dist";
const ESM_ROOT_DIR = `${OUTPUT_DIR}/esm`;
const ESM5_ROOT_DIR = `${OUTPUT_DIR}/esm5`;
const TYPES_ROOT_DIR = `${OUTPUT_DIR}/types`;
const TYPES_ESM_ROOT_DIR = `${OUTPUT_DIR}/types-esm`;

async function main() {
  // Copy the declarations into an ESM scope (dist/types-esm gets its own
  // { "type": "module" } package.json in generateExports) so `nodenext`
  // consumers see ESM typings for the `import` condition instead of the
  // CJS-scoped dist/types.
  await cp(TYPES_ROOT_DIR, TYPES_ESM_ROOT_DIR, { recursive: true });

  const files = (
    await Promise.all([
      glob(`${ESM_ROOT_DIR}/**/*.js`),
      glob(`${ESM5_ROOT_DIR}/**/*.js`),
      // ESM-scoped declarations need explicit extensions as well
      glob(`${TYPES_ESM_ROOT_DIR}/**/*.d.ts`),
    ])
  ).flat();

  await files
    .map((path) => [path, readFile(path)])
    .map(async ([name, filePromise]) => [
      name as string,
      String(await filePromise),
    ])
    .map(async (promise) => {
      const [path, file] = await promise;
      const importRegex = /import [\w,{}\s\n_*]+ from "\.[\w,{}\s\n./_]+";/gi;
      const exportRegex = /export [\w,{}\s\n_*]+ from "[\w,{}\s\n./_]+";/gi;
      const statements = (file.match(importRegex) || []).concat(
        file.match(exportRegex) || ([] as any),
      );

      let acc = file;
      if (statements.length > 0) {
        for (const statement of statements) {
          const { length } = statement;
          acc = acc.replace(
            statement,
            statement.substring(0, length - 2) + '.js";',
          );
        }
      }

      // Inline `import("./x")` type references in declaration files
      acc = acc.replace(/import\("(\.[^"]+?)"\)/g, (match, specifier) =>
        specifier.endsWith(".js") ? match : `import("${specifier}.js")`,
      );

      return writeFile(path, acc);
    })
    .reduce((acc, item) => acc.then(() => item));
}

main();
