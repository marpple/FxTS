export const FIRST_EXCEPT = "```typescript";
export const LAST_EXCEPT = "```";

class SignatureMap {
  map: Map<string, string[]>;
  constructor() {
    this.map = new Map();
  }

  add(key: string, value: string): void {
    if (!this.map.has(key)) {
      this.map.set(key, [value]);
      return;
    }
    this.map.get(key)?.push(value);
  }

  toString() {
    let str = "";
    for (const [key, value] of this.map) {
      str += `(${key},${value})`;
    }
    return str;
  }

  stringify(key: string) {
    if (!this.map.has(key)) {
      return "";
    }

    let str = "";
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const values = this.map.get(key)!.sort((a, b) => a.length - b.length);
    const len = values.length;
    for (let i = 0; i < len; i++) {
      const value = values[i];

      if (i === len - 1) {
        str += value.slice(FIRST_EXCEPT.length);
      } else if (i === 0) {
        str += value.slice(0, value.length - LAST_EXCEPT.length);
      } else {
        str += value.slice(
          FIRST_EXCEPT.length,
          value.length - LAST_EXCEPT.length,
        );
      }
    }
    return str;
  }

  get(key: string): string[] {
    if (!this.map.has(key)) {
      this.map.set(key, []);
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.map.get(key)!;
  }
}

export default SignatureMap;
