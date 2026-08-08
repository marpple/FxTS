import { readFile, writeFile } from "fs/promises";
import { glob } from "glob";

import { filter, identity, map, not, pipe, reduce } from "../src/index";

const SOURCE_DIR = "./src";
const OUTPUT_DIR = "./dist";
const TYPES_ROOT_DIR = `${OUTPUT_DIR}/types`;
const CJS_ROOT_DIR = `${OUTPUT_DIR}/cjs`;
const ESM_ROOT_DIR = `${OUTPUT_DIR}/esm`;

const TYPES_ESM_ROOT_DIR = `${OUTPUT_DIR}/types-esm`;

// Format-split typings: the `import` condition resolves ESM-scoped
// declarations (dist/types-esm) and the `require` condition the CJS-scoped
// ones (dist/types), so `nodenext` consumers get typings that match the
// runtime module format.
const conditionalExports = (name: string) => ({
  import: {
    types: `${TYPES_ESM_ROOT_DIR}/${name}.d.ts`,
    default: `${ESM_ROOT_DIR}/${name}.js`,
  },
  require: {
    types: `${TYPES_ROOT_DIR}/${name}.d.ts`,
    default: `${CJS_ROOT_DIR}/${name}.js`,
  },
});

const conditionalRootIndex = conditionalExports("index");
const conditionalRootIndexLazy = conditionalExports("Lazy/index");

const defaultSubPathExports = {
  "./package.json": "./package.json",
  ".": conditionalRootIndex,
  "./index": conditionalRootIndex,
  "./index.js": conditionalRootIndex,
  "./Lazy": conditionalRootIndexLazy,
  "./Lazy/index": conditionalRootIndexLazy,
  "./Lazy/index.js": conditionalRootIndexLazy,
};

async function generateExports() {
  const fileNames = await Promise.all([
    glob(`${SOURCE_DIR}/*.ts`),
    glob(`${SOURCE_DIR}/_internal/*.ts`),
    glob(`${SOURCE_DIR}/Lazy/*.ts`),
  ]).then((lists) =>
    lists
      .flat()
      .filter((a) => not(a.endsWith("index.ts")))
      .map((fileName) =>
        fileName.replace(/^(\.\/)?src\//, "").replace(/\.ts$/, ""),
      ),
  );

  const subPathExports = pipe(
    fileNames,
    filter(identity),
    map((name) => {
      const conditionalSubPaths = conditionalExports(name);
      return {
        [`./${name}`]: conditionalSubPaths,
        [`./${name}.js`]: conditionalSubPaths,
      };
    }),
    (iter) => reduce((acc, field) => Object.assign(acc, field), {}, iter),
  );

  const packageJsonObject = JSON.parse(
    String(await readFile("./package.json")),
  );

  await writeFile(
    "./package.json",
    JSON.stringify(
      Object.assign(packageJsonObject, {
        exports: {
          ...defaultSubPathExports,
          ...subPathExports,
        },
      }),
      null,
      2,
    ),
  );
}

(async function main() {
  await Promise.all([
    // Add package.json file to esm/types-esm directory
    writeFile(`${ESM_ROOT_DIR}/package.json`, '{ "type": "module" }'),
    writeFile(`${TYPES_ESM_ROOT_DIR}/package.json`, '{ "type": "module" }'),
    // Generate and add 'exports' field to root package.json
    generateExports(),
  ]);
})();
