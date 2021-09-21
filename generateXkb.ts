import { plainToClass } from "class-transformer"
import { validate } from "class-validator"
import fs from "fs"
import { Layout, WindowsAttributes } from "./main"

export async function generateXkb(
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

  function toHex(str: string) {
    let hex, i;
    let result = "";

    for (i = 0; i < str.length; i++) {
      hex = str.charCodeAt(i).toString(16);
      result += " 0x1" + ("000000" + hex).slice(-6);
    }
    return result;
  }



  const klfDefaultLayout = {
    "1": "key <AE01> { [",
    "2": "key <AE02> { [",
    "3": "key <AE03> { [",
    "4": "key <AE04> { [",
    "5": "key <AE05> { [",
    "6": "key <AE06> { [",
    "7": "key <AE07> { [",
    "8": "key <AE08> { [",
    "9": "key <AE09> { [",
    "0": "key <AE10> { [",
    "-": "key <AE11> { [",
    "=": "key <AE12> { [",
    "`": "key <TLDE> { [",
    q: "key <AD01> { [",
    w: "key <AD02> { [",
    e: "key <AD03> { [",
    r: "key <AD04> { [",
    t: "key <AD05> { [",
    y: "key <AD06> { [",
    u: "key <AD07> { [",
    i: "key <AD08> { [",
    o: "key <AD09> { [",
    p: "key <AD10> { [",
    "[": "key <AD11> { [",
    "]": "key <AD12> { [",
    a: "key <AC01> { [",
    s: "key <AC02> { [",
    d: "key <AC03> { [",
    f: "key <AC04> { [",
    g: "key <AC05> { [",
    h: "key <AC06> { [",
    j: "key <AC07> { [",
    k: "key <AC08> { [",
    l: "key <AC09> { [",
    ";": "key <AC10> { [",
    "'": "key <AC11> { [",
    "\\": "key <BKSL> { [",
    z: "key <AB01> { [",
    x: "key <AB02> { [",
    c: "key <AB03> { [",
    v: "key <AB04> { [",
    b: "key <AB05> { [",
    n: "key <AB06> { [",
    m: "key <AB07> { [",
    ",": "key <AB08> { [",
    ".": "key <AB09> { [",
    "/": "key <AB10> { [",
  }

  const lines = [
    `partial alphanumeric_keys`,
    `xkb_symbols "${layout.os.windows.installerName}" {`,
    `\n    // COPYRIGHT    "${layout.license}"`,
    `\n    name[Group1]= "${layout.name} v${layout.version}";`,
  ]

  const layoutLines = [""]
  Object.entries(klfDefaultLayout).forEach(([key, value]) => {
//    const extensions = layout.layers.map((_, idx) => {
//      return (toHex(layout.keys[key][idx]) || "voidsymbol") + ((idx < 3) ? "," : "")
//    })
    const extensions = (toHex(layout.keys[key][0]) || "voidsymbol") + "," + (toHex(layout.keys[key][1]) || "voidsymbol") 
    + "," + (toHex(layout.keys[key][3]) || "voidsymbol")+ "," + (toHex(layout.keys[key][5]) || "voidsymbol") + "] };"

    //extensions.push("] };")
    layoutLines.push([value, ...extensions].join(""))
  })

  fs.writeFileSync(
    outputPath,
    "\ufeff" +
    [
      lines.join("\n"),
      layoutLines.join("\n    "),
      "    include \"level3(ralt_switch)\"\n};",
    ].join("\n\n"),
    {
      encoding: "utf8",
    }
  )
}
