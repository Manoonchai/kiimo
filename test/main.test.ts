import fs from "fs"
import path from "path"
import { js2xml, xml2js } from "xml-js"
import { generate, generateLayout, validateLayout } from "../main"
import replace from "replace-in-file"

describe("#generate", () => {
  beforeAll(() => {
    generate()
  })

  it("creates output .keylayout file", () => {
    expect(
      fs.existsSync(path.join(process.cwd(), "output", "foo.keylayout"))
    ).toBeTruthy()
  })

  it("creates a valid keylayout XML file", () => {
    const content = fs.readFileSync(
      path.join(process.cwd(), "output", "bar.keylayout"),
      "utf8"
    )
    const jsContent = xml2js(content)

    js2xml(jsContent, {
      compact: false,
      spaces: 2,
    })
  })
})

describe("validateLayout", () => {
  it("passes structure validation", async () => {
    const validJson = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "input", "manoonchai.json"),
        "utf8"
      )
    )
    const result = await validateLayout(validJson)

    expect(result).toEqual(true)

    const invalidJson = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "input", "manoonchai.json"),
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
        path.join(process.cwd(), "input", "manoonchai.json"),
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

    fs.writeFileSync("output/tmp.xml", js2xml(manoonchai, { spaces: 2 }), {})

    const options = {
      files: "output/tmp.xml",
      from: /%26%23x([0-9A-F]+)%3B/g,
      to: "&#x$1;",
    }

    try {
      const results = replace.sync(options)
      console.log("Replacement results:", results)
    } catch (error) {
      console.error("Error occurred:", error)
    }

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
          id: "5991",
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
        {
          type: "element",
          name: "keyMapSelect",
          attributes: {
            mapIndex: "2",
          },
          elements: [
            {
              type: "element",
              name: "modifier",
              attributes: {
                keys: "anyOption anyControl? command?",
              },
            },
          ],
        },
        {
          type: "element",
          name: "keyMapSelect",
          attributes: {
            mapIndex: "3",
          },
          elements: [
            {
              type: "element",
              name: "modifier",
              attributes: {
                keys: "anyShift anyOption anyControl? command?",
              },
            },
          ],
        },
        {
          type: "element",
          name: "keyMapSelect",
          attributes: {
            mapIndex: "4",
          },
          elements: [
            {
              type: "element",
              name: "modifier",
              attributes: {
                keys: "caps anyControl? command?",
              },
            },
          ],
        },
        {
          type: "element",
          name: "keyMapSelect",
          attributes: {
            mapIndex: "5",
          },
          elements: [
            {
              type: "element",
              name: "modifier",
              attributes: {
                keys: "caps anyShift anyControl? command?",
              },
            },
          ],
        },
        {
          type: "element",
          name: "keyMapSelect",
          attributes: {
            mapIndex: "6",
          },
          elements: [
            {
              type: "element",
              name: "modifier",
              attributes: {
                keys: "caps anyOption anyControl? command?",
              },
            },
          ],
        },
        {
          type: "element",
          name: "keyMapSelect",
          attributes: {
            mapIndex: "7",
          },
          elements: [
            {
              type: "element",
              name: "modifier",
              attributes: {
                keys: "caps anyShift anyOption anyControl? command?",
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
      { code: "18", output: "1" },
      { code: "19", output: "2" },
      { code: "20", output: "3" },
      { code: "21", output: "4" },
      { code: "23", output: "5" },
      { code: "22", output: "6" },
      { code: "26", output: "7" },
      { code: "28", output: "8" },
      { code: "25", output: "9" },
      { code: "29", output: "0" },
    ]
    const keyMapSet = keyboard.elements[2]
    expect(keyMapSet).toEqual({
      type: "element",
      name: "keyMapSet",
      attributes: { id: "defaultKeyMapSet", defaultIndex: "0" },
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
      ],
    })

    // Test if escaped unicode works
    const content = fs.readFileSync(
      path.join(process.cwd(), "output", "tmp.xml"),
      "utf8"
    )

    const layout = xml2js(content)
    const keys = layout.elements[1].elements[2].elements[0].elements
    expect(keys[keys.length - 1].attributes["code"]).toEqual("126")
    expect(keys[keys.length - 1].attributes["output"]).toEqual("\u001e")
  })
})
