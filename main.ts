import "reflect-metadata"
import { plainToClass } from "class-transformer"
import {
  ArrayNotEmpty,
  IsDefined,
  IsIn,
  IsNotEmptyObject,
  IsString,
  validate,
} from "class-validator"
import { js2xml } from "xml-js"
import fs from "fs"

export async function validateLayout(
  content: Record<string, unknown>
): Promise<boolean> {
  const layout = plainToClass(Layout, content)
  const errors = await validate(layout)

  if (errors.length) {
    console.log(errors.map((e) => e.toString()).join(", "))
  }

  return !errors.length
}

export async function generateKlc(
  content: Record<string, unknown>
): Promise<void> {
  const layout = plainToClass(Layout, content)
  const errors = await validate(layout)

  if (errors.length) {
    throw new Error(errors.map((e) => e.toString()).join(", "))
  }

  const locales = {
    Thai: "th-TH",
  }

  const lines = [
    `KBD\t${layout.name}\t"${layout.language} ${layout.name} v${layout.version}"`,
    `COPYRIGHT\t"MIT"`,
    `COMPANY\t"${layout.os.windows.company}"`,
    `LOCALENAME\t"${locales[layout.language]}"`,
    `LOCALEID\t"${layout.os.windows.localeId}"`,
    `VERSION\t${layout.version}`,
  ]

  fs.writeFileSync("./output/test.klc", lines.join("\n"), {
    encoding: "utf8",
  })
}

export async function generateLayout(
  content: Record<string, unknown>
): Promise<string> {
  const layout = plainToClass(Layout, content)
  const errors = await validate(layout)

  if (errors.length) {
    throw new Error(errors.map((e) => e.toString()).join(", "))
  }

  const defaultKeyMapSelects = [
    { layerName: "Base", layerValue: "anyControl? command?" },
    { layerName: "Shift", layerValue: "anyShift anyControl? command?" },
    {
      layerName: "Command",
      layerValue: "command anyShift? anyControl? anyOption?",
    },
    {
      layerName: "Alt",
      layerValue: "command anyShift? anyControl? anyOption?",
    },
    {
      layerName: "Option",
      layerValue: "anyOption anyShift? anyControl? command?",
    },
    {
      layerName: "Control",
      layerValue: "anyControl anyShift? anyOption? command?",
    },
    { layerName: "Caps", layerValue: "caps anyControl? command?" },
    {
      layerName: "Caps+Shift",
      layerValue: "caps anyShift anyControl? command?",
    },
    {
      layerName: "Caps+Option",
      layerValue: "caps anyOption anyControl? command?",
    },
    {
      layerName: "Caps+Shift+Option",
      layerValue: "caps anyShift anyOption anyControl? command?",
    },
  ]

  const defaultKeys = [
    { code: 0, output: "a" },
    { code: 1, output: "s" },
    { code: 2, output: "d" },
    { code: 3, output: "f" },
    { code: 4, output: "h" },
    { code: 5, output: "g" },
    { code: 6, output: "z" },
    { code: 7, output: "x" },
    { code: 8, output: "c" },
    { code: 9, output: "v" },
    { code: 10, output: "§" },
    { code: 11, output: "b" },
    { code: 12, output: "q" },
    { code: 13, output: "w" },
    { code: 14, output: "e" },
    { code: 15, output: "r" },
    { code: 16, output: "y" },
    { code: 17, output: "t" },
    { code: 18, output: "1" },
    { code: 19, output: "2" },
    { code: 20, output: "3" },
    { code: 21, output: "4" },
    { code: 22, output: "6" },
    { code: 23, output: "5" },
    { code: 24, output: "=" },
    { code: 25, output: "9" },
    { code: 26, output: "7" },
    { code: 27, output: "-" },
    { code: 28, output: "8" },
    { code: 29, output: "0" },
    { code: 30, output: "]" },
    { code: 31, output: "o" },
    { code: 32, output: "u" },
    { code: 33, output: "[" },
    { code: 34, output: "i" },
    { code: 35, output: "p" },
    { code: 36, output: "&#x000D;", unicode: true },
    { code: 37, output: "l" },
    { code: 38, output: "j" },
    { code: 39, output: "'" },
    { code: 40, output: "k" },
    { code: 41, output: ";" },
    { code: 42, output: "\\" },
    { code: 43, output: "," },
    { code: 44, output: "/" },
    { code: 45, output: "n" },
    { code: 46, output: "m" },
    { code: 47, output: "." },
    { code: 48, output: "&#x0009;", unicode: true },
    { code: 49, output: " " },
    { code: 50, output: "`" },
    { code: 51, output: "&#x0008;", unicode: true },
    { code: 52, output: "&#x0003;", unicode: true },
    { code: 53, output: "&#x001B;", unicode: true },
    { code: 65, output: "." },
    { code: 66, output: "&#x001D;", unicode: true },
    { code: 67, output: "*" },
    { code: 69, output: "+" },
    { code: 70, output: "&#x001C;", unicode: true },
    { code: 71, output: "&#x001B;", unicode: true },
    { code: 72, output: "&#x001F;", unicode: true },
    { code: 75, output: "/" },
    { code: 76, output: "&#x0003;", unicode: true },
    { code: 77, output: "&#x001E;", unicode: true },
    { code: 78, output: "-" },
    { code: 81, output: "=" },
    { code: 82, output: "0" },
    { code: 83, output: "1" },
    { code: 84, output: "2" },
    { code: 85, output: "3" },
    { code: 86, output: "4" },
    { code: 87, output: "5" },
    { code: 88, output: "6" },
    { code: 89, output: "7" },
    { code: 91, output: "8" },
    { code: 92, output: "9" },
    { code: 96, output: "&#x0010;", unicode: true },
    { code: 97, output: "&#x0010;", unicode: true },
    { code: 98, output: "&#x0010;", unicode: true },
    { code: 99, output: "&#x0010;", unicode: true },
    { code: 100, output: "&#x0010;", unicode: true },
    { code: 101, output: "&#x0010;", unicode: true },
    { code: 102, output: "&#x0010;", unicode: true },
    { code: 103, output: "&#x0010;", unicode: true },
    { code: 104, output: "&#x0010;", unicode: true },
    { code: 105, output: "&#x0010;", unicode: true },
    { code: 106, output: "&#x0010;", unicode: true },
    { code: 107, output: "&#x0010;", unicode: true },
    { code: 108, output: "&#x0010;", unicode: true },
    { code: 109, output: "&#x0010;", unicode: true },
    { code: 110, output: "&#x0010;", unicode: true },
    { code: 111, output: "&#x0010;", unicode: true },
    { code: 112, output: "&#x0010;", unicode: true },
    { code: 113, output: "&#x0010;", unicode: true },
    { code: 114, output: "&#x0005;", unicode: true },
    { code: 115, output: "&#x0001;", unicode: true },
    { code: 116, output: "&#x000B;", unicode: true },
    { code: 117, output: "&#x007F;", unicode: true },
    { code: 118, output: "&#x0010;", unicode: true },
    { code: 119, output: "&#x0004;", unicode: true },
    { code: 120, output: "&#x0010;", unicode: true },
    { code: 121, output: "&#x000C;", unicode: true },
    { code: 122, output: "&#x0010;", unicode: true },
    { code: 123, output: "&#x001C;", unicode: true },
    { code: 124, output: "&#x001D;", unicode: true },
    { code: 125, output: "&#x001F;", unicode: true },
    { code: 126, output: "&#x001E;", unicode: true },
  ]

  const layoutLayers = layout.layers
  const layoutKeyMapSelects = layoutLayers.map((layoutLayerName) => {
    const keyMapSelect = defaultKeyMapSelects.find(
      (defaultKeyMapSelect) => defaultKeyMapSelect.layerName === layoutLayerName
    )

    if (!keyMapSelect) {
      throw new Error(`Invalid layer : ${layoutLayerName}`)
    }

    return keyMapSelect.layerValue
  })

  const document = {
    declaration: { attributes: { version: "1.1", encoding: "UTF-8" } },
    elements: [
      {
        doctype:
          'keyboard SYSTEM "file://localhost/System/Library/DTDs/KeyboardLayout.dtd"',
        type: "doctype",
      },
      {
        type: "element",
        name: "keyboard",
        attributes: {
          group: "0",
          id: "12345",
          name: layout.name,
          maxout: "1",
        },
        elements: [
          {
            type: "element",
            name: "layouts",
            elements: [
              {
                type: "element",
                name: "layout",
                attributes: {
                  first: "0",
                  last: "0",
                  mapSet: "defaultKeyMapSet",
                  modifiers: "defaultModifierMap",
                },
              },
            ],
          },
          {
            type: "element",
            name: "modifierMap",
            attributes: { id: "defaultModifierMap", defaultIndex: "0" },
            elements: layoutKeyMapSelects.map((keyMapSelect, idx) => ({
              type: "element",
              name: "keyMapSelect",
              attributes: {
                mapIndex: `${idx}`,
              },
              elements: [
                {
                  type: "element",
                  name: "modifier",
                  attributes: {
                    keys: keyMapSelect,
                  },
                },
              ],
            })),
          },
          {
            type: "element",
            name: "keyMapSet",
            attributes: { id: "defaultKeyMapSet" },
            elements: layout.layers.map((_, idx) => ({
              type: "element",
              name: "keyMap",
              attributes: { index: idx },
              elements: defaultKeys.map(({ code, output, unicode }) => {
                let overrideKey

                // Override only index 0-50
                // Since some symbols are the same in numpad's position and should not be overridden
                if (code <= 50) {
                  overrideKey = layout.keys[output]?.[idx] || output
                } else {
                  overrideKey = output
                }

                if (overrideKey == "&") {
                  overrideKey = escape("&#x0026;")
                }

                if (unicode) {
                  overrideKey = encodeURIComponent(output)
                }
                return {
                  type: "element",
                  name: "key",
                  attributes: { code, output: overrideKey },
                }
              }),
            })),
          },
        ],
      },
    ],
  }

  return js2xml(document, { spaces: 2 })
}

export class Layout {
  @IsString()
  name: string

  @IsString()
  version: string

  @IsString()
  @IsIn(["Thai"])
  language: "Thai"

  @ArrayNotEmpty()
  @IsIn(["Base", "Shift", "AltGr", "Command", "Option", "Control"], {
    each: true,
  })
  layers: Array<"Base" | "Shift" | "AltGr" | "Command" | "Option" | "Control">

  @IsDefined()
  @IsNotEmptyObject()
  keys: Record<string, string[]>

  @IsDefined()
  os: OSAttributes
}

interface OSAttributes {
  windows: { company: string; localeId: string }
}
