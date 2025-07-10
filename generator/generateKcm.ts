import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import fs from "fs";
import { Layout, WindowsAttributes } from "../main";

export async function generateKcm(
  content: Record<string, unknown>,
  outputPath: string,
): Promise<void> {
  const layout = plainToClass(Layout, content);

  const errors = await validate(layout);
  if (errors.length) {
    throw new Error(errors.map((e) => e.toString()).join(", "));
  }

  const windowsAttrs = plainToClass(WindowsAttributes, layout.os.windows);
  const windowsErrors = await validate(windowsAttrs);
  if (windowsErrors.length) {
    throw new Error(windowsErrors.map((e) => e.toString()).join(", "));
  }

  function toHex(str: string) {
    let hex, i
    let result = ""
    for (i = 0; i < str.length; i++) {
      hex = str.charCodeAt(i).toString(16)
      result += "\\u" + ("0000" + hex).slice(-4)
    }
    return result
  }

  const charToKeyName: Record<string, string> = {
    "`": "GRAVE",
    "1": "1",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
    "0": "0",
    "-": "MINUS",
    "=": "EQUALS",
    "^": "EQUALS",
    "¥": "YEN",

    q: "Q",
    w: "W",
    e: "E",
    r: "R",
    t: "T",
    y: "Y",
    u: "U",
    i: "I",
    o: "O",
    p: "P",
    "@": "AT",
    "[": "LEFT_BRACKET",
    "]": "RIGHT_BRACKET",

    a: "A",
    s: "S",
    d: "D",
    f: "F",
    g: "G",
    h: "H",
    j: "J",
    k: "K",
    l: "L",
    ";": "SEMICOLON",
    "'": "APOSTROPHE",
    "\\": "BACKSLASH",
    "§": "BACKSLASHUK",
    z: "Z",
    x: "X",
    c: "C",
    v: "V",
    b: "B",
    n: "N",
    m: "M",
    ",": "COMMA",
    ".": "PERIOD",
    "/": "SLASH",
    _: "RO",

    " ": "SPACE",
    KPDL: "NUMPAD_COMMA",
  };

  const klfDefaultLayout = Object.fromEntries(
    Object.entries(layout.keys).map(([char, keyArray]) => {
      const mappedChar = keyArray[4];
      const mappedKeyName = charToKeyName[mappedChar] || charToKeyName[char] || char.toUpperCase();
      return [char, `key ${mappedKeyName} {`];
    }),
  );


  const KeyMap: Record<string, number> = {
    GRAVE: 41,
    "1": 2,
    "2": 3,
    "3": 4,
    "4": 5,
    "5": 6,
    "6": 7,
    "7": 8,
    "8": 9,
    "9": 10,
    "0": 11,
    MINUS: 12,
    EQUALS: 13,
    YEN: 124,

    Q: 16,
    W: 17,
    E: 18,
    R: 19,
    T: 20,
    Y: 21,
    U: 22,
    I: 23,
    O: 24,
    P: 25,
    AT: 26,
    LEFT_BRACKET: 26,
    RIGHT_BRACKET: 27,

    A: 30,
    S: 31,
    D: 32,
    F: 33,
    G: 34,
    H: 35,
    J: 36,
    K: 37,
    L: 38,
    SEMICOLON: 39,
    APOSTROPHE: 40,
    BACKSLASH: 43,

    BACKSLASHUK: 86,
    Z: 44,
    X: 45,
    C: 46,
    V: 47,
    B: 48,
    N: 49,
    M: 50,
    COMMA: 51,
    PERIOD: 52,
    SLASH: 53,
    RO: 89,

    SPACE: 75,
    NUMPAD_COMMA: 95,
  };

  const keyNameToChar = Object.entries(charToKeyName).reduce<Record<string, string>>((acc, [char, keyName]) => {
    if (!(keyName in acc)) {
      acc[keyName] = char;
    }
    return acc;
  }, {});

  const mapKeyLines = Object.entries(KeyMap)
    .map(([originalKeyName, keyCode]) => {
      const originalChar = keyNameToChar[originalKeyName];
      if (!originalChar) return null;

      const mappedChar = layout.keys[originalChar]?.[4];
      if (!mappedChar) return null;

      const mappedKeyName = charToKeyName[mappedChar];
      if (!mappedKeyName) return null;

      return `map key ${keyCode} ${mappedKeyName}`;
    })
    .filter(Boolean) as string[];

  const layoutLines = Object.entries(klfDefaultLayout).map(([key, header]) => {
    const keyVals = layout.keys[key] || [];
    const parts = [];

    if (keyVals[0]) {
      const hex = toHex(keyVals[0]);
      parts.push(`label: '${hex}'`, `base: '${hex}'`);
    }
    if (keyVals[1]) {
      const hex = toHex(keyVals[1]);
      parts.push(`shift: '${hex}'`, `capslock: '${hex}'`);
    }
    if (keyVals[0]) {
      parts.push(`capslock+shift: '${toHex(keyVals[0])}'`);
    }
    if (keyVals[3]) {
      parts.push(`ralt: '${toHex(keyVals[3])}'`);
    }
    if (keyVals[5]) {
      parts.push(`ralt+shift: '${toHex(keyVals[5])}'`);
    }

    return [header, "    " + parts.join("\n    "), "}"].join("\n");
  });

  const fileContent = [
    `# License: ${layout.license}
# ${layout.language} ${layout.name} v${layout.version}

type OVERLAY`,
    mapKeyLines.join("\n"),
    layoutLines.join("\n\n"),
  ].join("\n\n");

  fs.writeFileSync(outputPath, fileContent, { encoding: "utf8" });
}
