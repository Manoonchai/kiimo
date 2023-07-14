import { plainToClass } from "class-transformer"
import { validate } from "class-validator"
import fs from "fs"
import { Layout, WindowsAttributes } from "./main"

export async function generateKcm(
  content: Record<string, unknown>,
  outputPath: string,
): Promise<void> {
  const layout = plainToClass(Layout, content)
  const errors = await validate(layout)

  if (errors.length) {
    throw new Error(errors.map((e) => e.toString()).join(", "))
  }

  const windowsErrors = await validate(
    plainToClass(WindowsAttributes, layout.os.windows),
  )

  if (windowsErrors.length) {
    throw new Error(windowsErrors.map((e) => e.toString()).join(", "))
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

  const klfDefaultLayout = {
    "1": "key 1 {",
    "2": "key 2 {",
    "3": "key 3 {",
    "4": "key 4 {",
    "5": "key 5 {",
    "6": "key 6 {",
    "7": "key 7 {",
    "8": "key 8 {",
    "9": "key 9 {",
    "0": "key 0 {",
    "-": "key MINUS {",
    "=": "key EQUALS {",
    "`": "key GRAVE {",
    q: "key Q {",
    w: "key W {",
    e: "key E {",
    r: "key R {",
    t: "key T {",
    y: "key Y {",
    u: "key U {",
    i: "key I {",
    o: "key O {",
    p: "key P {",
    "[": "key LEFT_BRACKET {",
    "]": "key RIGHT_BRACKET {",
    a: "key A {",
    s: "key S {",
    d: "key D {",
    f: "key F {",
    g: "key G {",
    h: "key H {",
    j: "key J {",
    k: "key K {",
    l: "key L {",
    ";": "key SEMICOLON {",
    "'": "key APOSTROPHE {",
    "\\": "key BACKSLASH {",
    z: "key Z {",
    x: "key X {",
    c: "key C {",
    v: "key V {",
    b: "key B {",
    n: "key N {",
    m: "key M {",
    ",": "key COMMA {",
    ".": "key PERIOD {",
    "/": "key SLASH {",
    " ": "key SPACE {",
    KPDL: "key NUMPAD_COMMA {",
  }

  const lines = [
    `# License: ${layout.license}
\n# ${layout.language} ${layout.name} v${layout.version}
\ntype OVERLAY
map key 2 1
map key 3 2
map key 4 3
map key 5 4
map key 6 5
map key 7 6
map key 8 7
map key 9 8
map key 10 9
map key 11 0
map key 12 MINUS
map key 13 EQUALS
map key 16 Q
map key 17 W
map key 18 E
map key 19 R
map key 20 T
map key 21 Y
map key 22 U
map key 23 I
map key 24 O
map key 25 P
map key 26 LEFT_BRACKET
map key 27 RIGHT_BRACKET
map key 30 A
map key 31 S
map key 32 D
map key 33 F
map key 34 G
map key 35 H
map key 36 J
map key 37 K
map key 38 L
map key 39 SEMICOLON
map key 40 APOSTROPHE
map key 41 GRAVE
map key 43 BACKSLASH
map key 44 Z
map key 45 X
map key 46 C
map key 47 V
map key 48 B
map key 49 N
map key 50 M
map key 51 COMMA
map key 52 PERIOD
map key 53 SLASH
map key 57 SPACE
map key 95 NUMPAD_COMMA`,
  ]

  const layoutLines = [""]
  Object.entries(klfDefaultLayout).forEach(([key, value]) => {
    const extensions =
      "\n    " +
      (layout.keys[key][0]
        ? "label: '" +
          toHex(layout.keys[key][0]) +
          "'\n    base: '" +
          toHex(layout.keys[key][0]) +
          "'\n    "
        : "") +
      (layout.keys[key][1]
        ? "shift: '" +
          toHex(layout.keys[key][1]) +
          "'\n    capslock: '" +
          toHex(layout.keys[key][1]) +
          "'\n    "
        : "") +
      (layout.keys[key][0]
        ? "capslock+shift: '" + toHex(layout.keys[key][0]) + "'\n    "
        : "") +
      (layout.keys[key][3]
        ? "ralt: '" + toHex(layout.keys[key][3]) + "'\n    "
        : "") +
      (layout.keys[key][5]
        ? "ralt+shift: '" + toHex(layout.keys[key][5]) + "'\n    "
        : "") +
      "}\n"

    layoutLines.push([value, ...extensions].join(""))
  })

  fs.writeFileSync(
    outputPath,
    //"\ufeff" +
    [lines.join("\n"), layoutLines.join("\n")].join("\n\n"),
    {
      encoding: "utf8",
    },
  )
}
