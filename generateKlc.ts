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

  const klcLocales: any = {
    Thai: "th-TH",
    Laos: "lo-LA",
  }
/*   function klcLocales(lang: string){
      switch(lang) { 
         case "Thai": { 
            return "th-TH"; 
            break; 
         } 
         case "Laos": { 
            return "lo-LA"; 
            break; 
         } 
         default: { 
            return "bg-BG"; 
            break; 
         } 
      } 
  } */
  
  function toHex(str: string) {
    let hex, i;
    let result = "";
    if(str !== null && str !== undefined){
        for (i = 0; i < str.length; i++) {
          hex = str.charCodeAt(i).toString(16);
          result += ("0000" + hex).slice(-4);
        }
        return result;
    }
    else{
        return false;
    }
  }

/*   const klcShiftStates = {
    Base: 0,
    Shift: 1,
    Ctrl: 2,
    "Shift+Ctrl": 3,
    Alt: 4, // Layer number 4 is not supported in KLC
    "Shift+Alt": 5,
    "Alt+Ctrl": 6,
    "Shift+Alt+Ctrl": 7,
    // From macOS config
    Command: 4, // Layer number 4 is not supported in KLC
    AltGr: 6,
    ShiftAltGr: 7,
    Option: 7,
    Control: 2,
  } */
  const toVK: any = {
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
    "-": "OEM_MINUS",
    "=": "OEM_PLUS",
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
    "[": "OEM_4",
    "]": "OEM_6",
    a: "A",
    s: "S",
    d: "D",
    f: "F",
    g: "G",
    h: "H",
    j: "J",
    k: "K",
    l: "L",
    ";": "OEM_1",
    "'": "OEM_7",
    "`": "OEM_3",
    "\\": "OEM_5",
    z: "Z",
    x: "X",
    c: "C",
    v: "V",
    b: "B",
    n: "N",
    m: "M",
    ",": "OEM_COMMA",
    ".": "OEM_PERIOD",
    "/": "OEM_2",
    " ": "SPACE",
    "KPDL": "DECIMAL",
  }
  
  const klfDefaultLayout = {
    "1": "02",
    "2": "03",
    "3": "04",
    "4": "05",
    "5": "06",
    "6": "07",
    "7": "08",
    "8": "09",
    "9": "0a",
    "0": "0b",
    "-": "0c",
    "=": "0d",
    q: "10",
    w: "11",
    e: "12",
    r: "13",
    t: "14",
    y: "15",
    u: "16",
    i: "17",
    o: "18",
    p: "19",
    "[": "1a",
    "]": "1b",
    a: "1e",
    s: "1f",
    d: "20",
    f: "21",
    g: "22",
    h: "23",
    j: "24",
    k: "25",
    l: "26",
    ";": "27",
    "'": "28",
    "`": "29",
    "\\": "2b",
    z: "2c",
    x: "2d",
    c: "2e",
    v: "2f",
    b: "30",
    n: "31",
    m: "32",
    ",": "33",
    ".": "34",
    "/": "35",
    " ": "39",
    "KPDL": "53",
  }

  const lines = [
    `KBD\t${layout.os.windows.installerName}\t"${layout.language} ${layout.name} v${layout.version}"`,
    `COPYRIGHT\t"${layout.license}"`,
    `COMPANY\t"${layout.os.windows.company}"`,
    `LOCALENAME\t"${klcLocales[layout.language]}"`,
    `LOCALEID\t"${layout.os.windows.localeId}"`,
    `VERSION\t${layout.version}`,
  ]

  const shiftStateLines: Array<string> = []

/*   layout.layers.forEach((layer, idx) => {
    if (layer in klcShiftStates) {
      // Filter out layer 4 (Command)
      if (klcShiftStates[layer] === 4) {
        layout.keys = Object.fromEntries(
          Object.entries(layout.keys).map(([key, keys]) => {
            keys.splice(idx, 1)
            return [key, keys]
          })
        )
      } else {
        shiftStateLines.push(
          `${klcShiftStates[layer]}\t// Column ${idx + 4} : ${layer}`
        )
      }
    } else {
      throw new Error("Layer not valid")
    }
  }) */
  
  shiftStateLines.push(`0\t//Column 4 : Base`)
  shiftStateLines.push(`1\t//Column 5 : Shft`)
  shiftStateLines.push(`2\t//Column 6 :       Ctrl`)
  shiftStateLines.push(`6\t//Column 7 :       Ctrl Alt`)
  shiftStateLines.push(`7\t//Column 8 : Shft  Ctrl Alt`)

  shiftStateLines.unshift("SHIFTSTATE", "")
  

  const layoutLines = ["LAYOUT\t\t;an extra '@' at the end is a dead key\r\n"]

  layoutLines.push(`//SC\tVK_\tCap\t0\t1\t2\t6\t7`)
  layoutLines.push(`//--\t----\t----\t----\t----\t----\t----\t----\r\n`)

  Object.entries(klfDefaultLayout).forEach(([key, value]) => {
/*     const extensions = layout.layers.map((_, idx) => {
      return layout.keys[key][idx] || "-1"
    })
    
    layoutLines.push([value, "0", ...extensions].join("\t")) */
    
        const extensions = "\t" + (toVK[(layout.keys[key][4])] || "-1") 
    + "\t0" 
    + "\t" + (toHex(layout.keys[key][0]) || "-1") 
    + "\t" + (toHex(layout.keys[key][1]) || "-1")
    + "\t-1"
    + "\t" + (toHex(layout.keys[key][3]) || "-1")
    + "\t" + (toHex(layout.keys[key][5]) || "-1")

    layoutLines.push([value, ...extensions].join(""))
  })

  fs.writeFileSync(
    outputPath,
    "\ufeff" +
      [
        lines.join("\r\n\r\n"),
        shiftStateLines.join("\r\n"),
        layoutLines.join("\r\n"),
        "ENDKBD\r\n",
      ].join("\r\n\r\n"),
    {
      encoding: "utf16le",
    }
  )
}
