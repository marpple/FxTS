import * as fs from "fs";
import * as path from "path";
import * as util from "util";
import {
  IMarkdownDocumenterFeatureOnBeforeWritePageArgs,
  MarkdownDocumenterFeature,
} from "@microsoft/api-documenter";
import { ApiItem } from "@microsoft/api-extractor-model";

import {
  FuncParameters,
  FuncReturn,
  Signature,
  SignatureOut,
  SignatureType,
} from "./Signature";
import SignatureMap from "./SignatureMap";

const unLinkP = util.promisify(fs.unlink);
const readFileP = util.promisify(fs.readFile);
const writeFileP = util.promisify(fs.writeFile);
const cpFileP = util.promisify(fs.cp);

const signatureMap = new SignatureMap();
const packageNameMap = new Map(); // to find an exact filename

type MarkDownType =
  | typeof Signature
  | typeof FuncParameters
  | typeof FuncReturn
  | typeof SignatureOut;

class MarkdownFeature extends MarkdownDocumenterFeature {
  private _apiItemsWithPages: Set<ApiItem> = new Set<ApiItem>();
  private header: string[] = [];
  private footer: string[] = [];
  public onInitialized(): void {
    console.log("MarkdownFeature: onInitialized()");
  }

  public onBeforeWritePage(
    eventArgs: IMarkdownDocumenterFeatureOnBeforeWritePageArgs,
  ): void {
    this.header = ["---", `id: ${eventArgs.apiItem.displayName}`, "---"];

    this.footer = [];

    // remove top title
    eventArgs.pageContent = eventArgs.pageContent
      .split("\n")
      .slice(3)
      .join("\n");

    const splitedPageContent = eventArgs.pageContent.split("\n\n");
    this.saveSignatureInfo(eventArgs, splitedPageContent);
    this.removeUnlessText(splitedPageContent);

    // prettier-ignore
    eventArgs.pageContent = [
      this.header.join("\n"),
      splitedPageContent.join("\n\n"),
      this.footer.join('\n')
    ].join('\n');
    this._apiItemsWithPages.add(eventArgs.apiItem);
  }

  public async onFinished(): Promise<void> {
    await this.rewriteFile();
    await this.createIndexPage();
    await this.cpDocs();
    console.log("MarkdownFeature: onFinished");
  }

  private saveSignatureInfo(
    eventArgs: IMarkdownDocumenterFeatureOnBeforeWritePageArgs,
    splitedPageContent: string[],
  ): void {
    const displayName = eventArgs.apiItem.displayName;
    const outputFilename = eventArgs.outputFilename.split("/")[1];

    if (!outputFilename.match(/[a-zA-Z]+\.[_a-zA-Z1-9]+\.md/)) {
      return;
    }

    const signatureStartEndIdx = this.findTextStartEndIndex(
      splitedPageContent,
      Signature,
    );

    signatureMap.add(
      displayName,
      splitedPageContent[signatureStartEndIdx[0] + 1],
    );

    packageNameMap.set(displayName.toLowerCase(), displayName);
  }

  // remove parameter / return info
  private removeUnlessText(splitedPageContent: string[]) {
    const paramterStartEndIdx = this.findTextStartEndIndex(
      splitedPageContent,
      FuncParameters,
    );
    const returnStartEndIdx = this.findTextStartEndIndex(
      splitedPageContent,
      FuncReturn,
    );
    this.spliceText(splitedPageContent, returnStartEndIdx);
    this.spliceText(splitedPageContent, paramterStartEndIdx);
  }

  private async rewriteFile() {
    await this.removeUnlessFile();
    await this.rewriteSignatures();
  }

  private async removeUnlessFile(): Promise<void> {
    const files = fs.readdirSync(this.context.outputFolder);
    const rejectFiles = files.filter(
      (file) => !file.match(/[a-zA-Z]+\.[a-zA-Z]+\.md/),
    );

    await Promise.all(
      rejectFiles.map((file) => unLinkP(this.getFilePath(file))),
    );
  }

  private async rewriteSignatures() {
    const files = fs.readdirSync(this.context.outputFolder);
    await Promise.all(files.map((file) => this.rewriteSignature(file)));
  }

  private async rewriteSignature(file: string): Promise<void> {
    const packageName = this.getPackageName(file);
    const content = (await readFileP(this.getFilePath(file))).toString();
    const splitedPageContent = content.split("\r\n");
    const displayName = packageNameMap.get(packageName.toLowerCase());

    // multi signature are rewriten only
    if (signatureMap.get(displayName).length >= 2) {
      const signatureStartEndIdx = this.findTextStartEndIndex(
        splitedPageContent,
        SignatureOut,
      );

      const signatureContent =
        `${Signature.text}\n\n` + signatureMap.stringify(displayName);
      this.spliceText(
        splitedPageContent,
        signatureStartEndIdx,
        signatureContent,
      );
    }

    const mdPath = this.getFilePath(`${displayName}.md`);
    await writeFileP(mdPath, splitedPageContent.join("\r\n"));
    await unLinkP(this.getFilePath(file));
  }

  private getFilePath(file: string) {
    return path.join(this.context.outputFolder, file);
  }

  private getPackageName(file: string) {
    return file.split(".")[1];
  }

  private spliceText(
    texts: string[],
    idx: [number, number],
    ...changeTexts: string[]
  ) {
    if (idx[0] === -1 && idx[1] === -1) {
      return "";
    }

    texts.splice(idx[0], idx[1], changeTexts.join(""));
    return texts;
  }

  private findTextIndex(
    splited: string[],
    index: number,
    signature: SignatureType,
  ): [number, number] {
    if (typeof signature.skip === "number") {
      return [index, signature.skip];
    }

    if (typeof signature.skip === "function") {
      return [index, signature.skip(index, splited)];
    }

    throw new TypeError("Invaild signature skip type");
  }

  private findTextStartEndIndex(
    splited: string[],
    markdown: MarkDownType,
  ): [number, number] {
    let startEnd: [number, number] = [-1, -1];
    for (let i = 0; i < splited.length; i++) {
      if (splited[i].startsWith(markdown.text)) {
        startEnd = this.findTextIndex(splited, i, markdown);
        break;
      }
    }
    return startEnd;
  }

  private async createIndexPage() {
    const root = this.context.outputFolder;

    const funcPath = path.resolve(root, "../", "function.json");
    const docIndexPath = path.resolve(root, "index.md");
    const funcFile = await readFileP(funcPath);
    const funcJSON = JSON.parse(funcFile.toString());

    const renderString = (
      values: string[],
      prefix: string,
      renderFunc: (value: any) => string,
    ) => {
      return values
        .map((value: string) => `${prefix}${renderFunc(value)}`)
        .join("\n");
    };

    const getValues = (key: string) => {
      return renderString(
        funcJSON[key],
        "  - ",
        (value) => `[${value}](/docs/${value})`,
      );
    };

    const content = renderString(
      Object.keys(funcJSON),
      "## ",
      (key) => `${key}\n${getValues(key)}`,
    );

    await writeFileP(
      docIndexPath,
      [
        // header
        "---",
        "id: index",
        "---",
        // content
        content,
      ].join("\n"),
    );
  }

  private async cpDocs() {
    const root = this.context.outputFolder;

    const mdPath = path.resolve(root, "../", "docs_md");
    const outPath = path.resolve(root, "../docs");
    const files = fs.readdirSync(mdPath);

    await Promise.all(
      files.map((file) =>
        cpFileP(path.resolve(mdPath, file), path.resolve(outPath, file)),
      ),
    );
  }
}

export default MarkdownFeature;
