import { plainToClass } from "class-transformer"
import { validate } from "class-validator"
import fs from "fs"
import { Layout, WindowsAttributes } from "./main"

export async function generateKlc(
  content: Record<string, unknown>,
  outputPath: string
): Promise<void> {
  const layout = plainToClass(Layout, content)
  const errors = await validate(layout)

  if (errors.length) {
    throw new Error(errors.map((e) => e.toString()).join(", "))
  }

  const windowsErrors = await validate(
    plainToClass(WindowsAttributes, layout.os.windows)
  )

  if (windowsErrors.length) {
    throw new Error(windowsErrors.map((e) => e.toString()).join(", "))
  }

  const klcLocales = {
    Thai: "th-TH",
  }

  const klcShiftStates = {
    Base: 0,
    Shift: 1,
    Ctrl: 2,
    "Shift+Ctrl": 3,
    Alt: 4,
    "Shift+Alt": 5,
    "Alt+Ctrl": 6,
    "Shift+Alt+Ctrl": 7,
    // From macOS config
    Command: 4,
    AltGr: 7,
    Option: 7,
    Control: 2,
  }

  const klfDefaultLayout = {
    "1": "02\t1",
    "2": "03\t2",
    "3": "04\t3",
    "4": "05\t4",
    "5": "06\t5",
    "6": "07\t6",
    "7": "08\t7",
    "8": "09\t8",
    "9": "0a\t9",
    "0": "0b\t0",
    "-": "0c\tOEM_MINUS",
    "=": "0d\tOEM_PLUS",
    q: "10\tQ",
    w: "11\tW",
    e: "12\tE",
    r: "13\tR",
    t: "14\tT",
    y: "15\tY",
    u: "16\tU",
    i: "17\tI",
    o: "18\tO",
    p: "19\tP",
    "[": "1a\tOEM_4",
    "]": "1b\tOEM_6",
    a: "1e\tA",
    s: "1f\tS",
    d: "20\tD",
    f: "21\tF",
    g: "22\tG",
    h: "23\tH",
    j: "24\tJ",
    k: "25\tK",
    l: "26\tL",
    ";": "27\tOEM_1",
    "'": "28\tOEM_7",
    "`": "29\tOEM_3",
    "\\": "2b\tOEM_5",
    z: "2c\tZ",
    x: "2d\tX",
    c: "2e\tC",
    v: "2f\tV",
    b: "30\tB",
    n: "31\tN",
    m: "32\tM",
    ",": "33\tOEM_COMMA",
    ".": "34\tOEM_PERIOD",
    "/": "35\tOEM_2",
  }

  const lines = [
    `KBD\t${layout.os.windows.installerName}\t"${layout.language} ${layout.name} v${layout.version}"`,
    `COPYRIGHT\t"MIT"`,
    `COMPANY\t"${layout.os.windows.company}"`,
    `LOCALENAME\t"${klcLocales[layout.language]}"`,
    `LOCALEID\t"${layout.os.windows.localeId}"`,
    `VERSION\t${layout.version}`,
  ]

  const shiftStateLines: Array<string> = layout.layers.map((layer, idx) => {
    if (layer in klcShiftStates) {
      return `${klcShiftStates[layer]}\t// Column ${idx + 4} : ${layer}`
    } else {
      throw new Error("Layer not valid")
    }
  })

  shiftStateLines.unshift("SHIFTSTATE", "")

  const layoutLines = ["LAYOUT"]

  Object.entries(klfDefaultLayout).forEach(([key, value]) => {
    const extensions = layout.layers.map((_, idx) => layout.keys[key][idx])
    layoutLines.push([value, "0", ...extensions].join("\t"))
  })

  fs.writeFileSync(
    outputPath,
    "\ufeff" +
      [
        lines.join("\r\n\r\n"),
        shiftStateLines.join("\r\n"),
        layoutLines.join("\r\n"),
        "ENDKBD",
      ].join("\r\n\r\n"),
    {
      encoding: "utf16le",
    }
  )
}
