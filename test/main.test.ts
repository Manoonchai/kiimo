import fs from "fs"
import path from "path"
import { js2xml, xml2js } from "xml-js"
import { generateKlc, generateLayout, validateLayout } from "../main"
import { fixUnicode } from "../utils"

describe("validateLayout", () => {
  it("passes structure validation", async () => {
    const validJson = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "input", "Manoonchai.json"),
        "utf8"
      )
    )
    const result = await validateLayout(validJson)

    expect(result).toEqual(true)

    const invalidJson = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "input", "Manoonchai.json"),
        "utf8"
      )
    )

    // Empty keys
    invalidJson["keys"] = {}
    expect(await validateLayout(invalidJson)).toEqual(false)

    // Invalid layer name
    invalidJson["keys"] = { a: ["a", "A"] }
    invalidJson["layers"][0] = "InvalidLayerName"
    expect(await validateLayout(invalidJson)).toEqual(false)
  })
})

describe("generateLayout", () => {
  it("receives layout json and returns keylayout xml correctly", async () => {
    const manoonchaiJson = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "input", "Manoonchai.json"),
        "utf8"
      )
    )

    const manoonchaiXml = await generateLayout(manoonchaiJson)

    expect(manoonchaiXml).toBeDefined()

    const manoonchai = xml2js(manoonchaiXml)

    expect(manoonchai).not.toStrictEqual({})

    expect(manoonchai).toEqual(
      expect.objectContaining({
        declaration: { attributes: { version: "1.1", encoding: "UTF-8" } },
      })
    )

    fs.writeFileSync(
      "output/tmp.keylayout",
      js2xml(manoonchai, { spaces: 2 }),
      {}
    )

    fixUnicode("output/tmp.keylayout")

    expect(manoonchai.elements[0]).toEqual({
      doctype:
        'keyboard SYSTEM "file://localhost/System/Library/DTDs/KeyboardLayout.dtd"',
      type: "doctype",
    })

    // <keyboard group="0" id="5991" name="Thai - Manoonchai v0.3" maxout="1">
    const keyboard = manoonchai.elements[1]
    expect(keyboard).toEqual(
      expect.objectContaining({
        type: "element",
        name: "keyboard",
        attributes: {
          group: "0",
          id: "12345",
          name: "Manoonchai",
          maxout: "1",
        },
      })
    )

    // <layouts>
    //     <layout first="0" last="0" mapSet="a8" modifiers="30"/>
    // </layouts>
    const layouts = keyboard.elements[0]
    expect(layouts).toEqual({
      type: "element",
      name: "layouts",
      elements: [
        {
          type: "element",
          name: "layout",
          attributes: {
            first: "0",
            last: "0",
            modifiers: "defaultModifierMap",
            mapSet: "defaultKeyMapSet",
          },
        },
      ],
    })

    // <modifierMap id="defaultModifierMap" defaultIndex="0">
    //   <keyMapSelect mapIndex="0">
    //     <modifier keys="anyControl? command?" />
    //   </keyMapSelect>
    //   ...
    // </modifierMap>
    const modifierMap = keyboard.elements[1]
    expect(modifierMap).toEqual({
      type: "element",
      name: "modifierMap",
      attributes: { id: "defaultModifierMap", defaultIndex: "0" },
      elements: [
        {
          type: "element",
          name: "keyMapSelect",
          attributes: {
            mapIndex: "0",
          },
          elements: [
            {
              type: "element",
              name: "modifier",
              attributes: {
                keys: "anyControl? command?",
              },
            },
          ],
        },
        {
          type: "element",
          name: "keyMapSelect",
          attributes: {
            mapIndex: "1",
          },
          elements: [
            {
              type: "element",
              name: "modifier",
              attributes: {
                keys: "anyShift anyControl? command?",
              },
            },
          ],
        },
      ],
    })

    // <keyMapSet id="defaultKeyMapSet">
    //   <keyMap index="0">
    //     <key code="10" output="`" />
    const expectedKeys = [
      { code: "0", output: "ง" },
      { code: "1", output: "เ" },
      { code: "2", output: "ร" },
      { code: "3", output: "น" },
      { code: "4", output: "อ" },
      { code: "5", output: "ม" },
      { code: "6", output: "ุ" },
      { code: "7", output: "ไ" },
      { code: "8", output: "ท" },
      { code: "9", output: "ย" },
      { code: "10", output: "§" },
      { code: "11", output: "จ" },
      { code: "12", output: "ใ" },
      { code: "13", output: "ต" },
      { code: "14", output: "ห" },
      { code: "15", output: "ล" },
      { code: "16", output: "ป" },
      { code: "17", output: "ส" },
      { code: "18", output: "1" },
      { code: "19", output: "2" },
      { code: "20", output: "3" },
      { code: "21", output: "4" },
      { code: "22", output: "6" },
      { code: "23", output: "5" },
      { code: "24", output: "=" },
      { code: "25", output: "9" },
      { code: "26", output: "7" },
      { code: "27", output: "-" },
      { code: "28", output: "8" },
      { code: "29", output: "0" },
      { code: "30", output: "ฬ" },
      { code: "31", output: "ิ" },
      { code: "32", output: "ั" },
      { code: "33", output: "็" },
      { code: "34", output: "ก" },
      { code: "35", output: "บ" },
      { code: "36", output: escape("&#x000D;") },
      { code: "37", output: "้" },
      { code: "38", output: "า" },
      { code: "39", output: "ื" },
      { code: "40", output: "่" },
      { code: "41", output: "ว" },
      { code: "42", output: "ฯ" },
      { code: "43", output: "ด" },
      { code: "44", output: "ู" },
      { code: "45", output: "ค" },
      { code: "46", output: "ี" },
      { code: "47", output: "ะ" },
      { code: "48", output: escape("&#x0009;") },
      { code: "49", output: " " },
      { code: "50", output: "`" },
      { code: "51", output: escape("&#x0008;") },
      { code: "52", output: escape("&#x0003;") },
      { code: "53", output: escape("&#x001B;") },
      { code: "65", output: "." },
      { code: "66", output: escape("&#x001D;") },
      { code: "67", output: "*" },
      { code: "69", output: "+" },
      { code: "70", output: escape("&#x001C;") },
      { code: "71", output: escape("&#x001B;") },
      { code: "72", output: escape("&#x001F;") },
      { code: "75", output: "/" },
      { code: "76", output: escape("&#x0003;") },
      { code: "77", output: escape("&#x001E;") },
      { code: "78", output: "-" },
      { code: "81", output: "=" },
      { code: "82", output: "0" },
      { code: "83", output: "1" },
      { code: "84", output: "2" },
      { code: "85", output: "3" },
      { code: "86", output: "4" },
      { code: "87", output: "5" },
      { code: "88", output: "6" },
      { code: "89", output: "7" },
      { code: "91", output: "8" },
      { code: "92", output: "9" },
      { code: "96", output: escape("&#x0010;") },
      { code: "97", output: escape("&#x0010;") },
      { code: "98", output: escape("&#x0010;") },
      { code: "99", output: escape("&#x0010;") },
      { code: "100", output: escape("&#x0010;") },
      { code: "101", output: escape("&#x0010;") },
      { code: "103", output: escape("&#x0010;") },
      { code: "105", output: escape("&#x0010;") },
      { code: "107", output: escape("&#x0010;") },
      { code: "109", output: escape("&#x0010;") },
      { code: "111", output: escape("&#x0010;") },
      { code: "113", output: escape("&#x0010;") },
      { code: "114", output: escape("&#x0005;") },
      { code: "115", output: escape("&#x0001;") },
      { code: "116", output: escape("&#x000B;") },
      { code: "117", output: escape("&#x007F;") },
      { code: "118", output: escape("&#x0010;") },
      { code: "119", output: escape("&#x0004;") },
      { code: "120", output: escape("&#x0010;") },
      { code: "121", output: escape("&#x000C;") },
      { code: "122", output: escape("&#x0010;") },
      { code: "123", output: escape("&#x001C;") },
      { code: "124", output: escape("&#x001D;") },
      { code: "125", output: escape("&#x001F;") },
      { code: "126", output: escape("&#x001E;") },
    ]
    const expectedShiftedKeys = [
      { code: "0", output: "ษ" },
      { code: "1", output: "ถ" },
      { code: "2", output: "แ" },
      { code: "3", output: "ช" },
      { code: "4", output: "ผ" },
      { code: "5", output: "พ" },
      { code: "6", output: "ฤ" },
      { code: "7", output: "ฝ" },
      { code: "8", output: "ๆ" },
      { code: "9", output: "ณ" },
      { code: "10", output: "§" },
      { code: "11", output: "๊" },
      { code: "12", output: "ฒ" },
      { code: "13", output: "ฏ" },
      { code: "14", output: "ซ" },
      { code: "15", output: "ญ" },
      { code: "16", output: "ฉ" },
      { code: "17", output: "ฟ" },
      { code: "18", output: "!" },
      { code: "19", output: "@" },
      { code: "20", output: "#" },
      { code: "21", output: "$" },
      { code: "22", output: "^" },
      { code: "23", output: "%" },
      { code: "24", output: "+" },
      { code: "25", output: "(" },
      { code: "26", output: escape("&#x0026;") },
      { code: "27", output: "_" },
      { code: "28", output: "*" },
      { code: "29", output: ")" },
      { code: "30", output: "ฑ" },
      { code: "31", output: "ฐ" },
      { code: "32", output: "ึ" },
      { code: "33", output: "ฆ" },
      { code: "34", output: "ธ" },
      { code: "35", output: "ฎ" },
      { code: "36", output: escape("&#x000D;") },
      { code: "37", output: "โ" },
      { code: "38", output: "ำ" },
      { code: "39", output: '"' },
      { code: "40", output: "ข" },
      { code: "41", output: "ภ" },
      { code: "42", output: "ฌ" },
      { code: "43", output: "ศ" },
      { code: "44", output: "?" },
      { code: "45", output: "๋" },
      { code: "46", output: "์" },
      { code: "47", output: "ฮ" },
      { code: "48", output: escape("&#x0009;") },
      { code: "49", output: " " },
      { code: "50", output: "~" },
      { code: "51", output: escape("&#x0008;") },
      { code: "52", output: escape("&#x0003;") },
      { code: "53", output: escape("&#x001B;") },
      { code: "65", output: "." },
      { code: "66", output: escape("&#x001D;") },
      { code: "67", output: "*" },
      { code: "69", output: "+" },
      { code: "70", output: escape("&#x001C;") },
      { code: "71", output: escape("&#x001B;") },
      { code: "72", output: escape("&#x001F;") },
      { code: "75", output: "/" },
      { code: "76", output: escape("&#x0003;") },
      { code: "77", output: escape("&#x001E;") },
      { code: "78", output: "-" },
      { code: "81", output: "=" },
      { code: "82", output: "0" },
      { code: "83", output: "1" },
      { code: "84", output: "2" },
      { code: "85", output: "3" },
      { code: "86", output: "4" },
      { code: "87", output: "5" },
      { code: "88", output: "6" },
      { code: "89", output: "7" },
      { code: "91", output: "8" },
      { code: "92", output: "9" },
      { code: "96", output: escape("&#x0010;") },
      { code: "97", output: escape("&#x0010;") },
      { code: "98", output: escape("&#x0010;") },
      { code: "99", output: escape("&#x0010;") },
      { code: "100", output: escape("&#x0010;") },
      { code: "101", output: escape("&#x0010;") },
      { code: "103", output: escape("&#x0010;") },
      { code: "105", output: escape("&#x0010;") },
      { code: "107", output: escape("&#x0010;") },
      { code: "109", output: escape("&#x0010;") },
      { code: "111", output: escape("&#x0010;") },
      { code: "113", output: escape("&#x0010;") },
      { code: "114", output: escape("&#x0005;") },
      { code: "115", output: escape("&#x0001;") },
      { code: "116", output: escape("&#x000B;") },
      { code: "117", output: escape("&#x007F;") },
      { code: "118", output: escape("&#x0010;") },
      { code: "119", output: escape("&#x0004;") },
      { code: "120", output: escape("&#x0010;") },
      { code: "121", output: escape("&#x000C;") },
      { code: "122", output: escape("&#x0010;") },
      { code: "123", output: escape("&#x001C;") },
      { code: "124", output: escape("&#x001D;") },
      { code: "125", output: escape("&#x001F;") },
      { code: "126", output: escape("&#x001E;") },
    ]

    const keyMapSet = keyboard.elements[2]
    expect(keyMapSet).toEqual({
      type: "element",
      name: "keyMapSet",
      attributes: { id: "defaultKeyMapSet" },
      elements: [
        {
          type: "element",
          name: "keyMap",
          attributes: { index: "0" },
          elements: expect.arrayContaining(
            expectedKeys.map(({ code, output }) => ({
              type: "element",
              name: "key",
              attributes: { code, output },
            }))
          ),
        },
        {
          type: "element",
          name: "keyMap",
          attributes: { index: "1" },
          elements: expect.arrayContaining(
            expectedShiftedKeys.map(({ code, output }) => ({
              type: "element",
              name: "key",
              attributes: { code, output },
            }))
          ),
        },
      ],
    })

    // Test if escaped unicode works
    const content = fs.readFileSync(
      path.join(process.cwd(), "output", "tmp.keylayout"),
      "utf8"
    )

    const layout = xml2js(content)
    const keys = layout.elements[1].elements[2].elements[0].elements
    expect(keys[keys.length - 1].attributes["code"]).toEqual("126")
    expect(keys[keys.length - 1].attributes["output"]).toEqual("\u001e")
  })
})

describe("generateKlc", () => {
  it("exists", () => {
    expect(generateKlc).toBeDefined()
  })

  it("generates .klc file", async () => {
    const inputJson = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "input", "Manoonchai.json"),
        "utf8"
      )
    )

    await generateKlc(inputJson)

    expect(fs.existsSync("output/test.klc")).toBeTruthy()

    const lines = fs
      .readFileSync("output/test.klc", "utf16le")
      .split("\r\n")
      .filter(Boolean)

    // Assert file headers
    expect(lines[0]).toEqual(`\ufeffKBD\tThaiMnc\t"Thai Manoonchai v1.0"`)
    expect(lines[1]).toEqual(`COPYRIGHT\t"MIT"`)
    expect(lines[2]).toEqual(`COMPANY\t"Manoonchai"`)
    expect(lines[3]).toEqual(`LOCALENAME\t"th-TH"`)
    expect(lines[4]).toEqual(`LOCALEID\t"0000041e"`)
    expect(lines[5]).toEqual(`VERSION\t1.0`)

    // Assert Shiftstate
    // public enum ShiftState : int {
    //   Base            = 0,                    // 0
    //   Shft            = 1,                    // 1
    //   Ctrl            = 2,                    // 2
    //   ShftCtrl        = Shft | Ctrl,          // 3
    //   Menu            = 4,                    // 4 -- NOT USED
    //   ShftMenu        = Shft | Menu,          // 5 -- NOT USED
    //   MenuCtrl        = Menu | Ctrl,          // 6
    //   ShiftMenuCtrl   = Shft | Menu | Ctrl,   // 7
    // }

    // 0	//Column 4
    // 1	//Column 5 : Shft
    // 2	//Column 6 :       Ctrl
    // 6	//Column 7 :       Ctrl Alt
    // 7	//Column 8 : Shft  Ctrl Alt

    expect(lines[6]).toEqual(`SHIFTSTATE`)
    expect(lines[7]).toEqual(`0\t// Column 4 : Base`)
    expect(lines[8]).toEqual(`1\t// Column 5 : Shift`)

    // Assert Layout
    expect(lines[9]).toEqual(`LAYOUT`)

    expect(lines[10]).toEqual(`0b\t0\t0\t0\t)`)
    expect(lines[11]).toEqual(`02\t1\t0\t1\t!`)

    // Assert ENDKBD
    expect(lines.slice(-1)).toEqual(["ENDKBD"])
  })
})
