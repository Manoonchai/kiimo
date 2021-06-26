import fs from "fs";
import path from "path";
import { js2xml, xml2js } from "xml-js";
import { generate, validateLayout } from "../main";

describe("#generate", () => {
  beforeAll(() => {
    generate();
  });

  it("creates output .keylayout file", () => {
    expect(
      fs.existsSync(path.join(process.cwd(), "output", "foo.keylayout"))
    ).toBeTruthy();
  });

  it("creates a valid keylayout XML file", () => {
    const content = fs.readFileSync(
      path.join(process.cwd(), "output", "bar.keylayout"),
      "utf8"
    );
    const jsContent = xml2js(content);
    // console.dir(jsContent);
    const xmlContent = js2xml(jsContent, {
      compact: false,
      spaces: 2,
    });
    console.log({ xmlContent: xmlContent.substring(0, 10) });
  });
});

describe("json input", () => {
  it("passes structure validation", async () => {
    const validJson = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "input", "manoonchai.json"),
        "utf8"
      )
    );
    const result = await validateLayout(validJson);

    expect(result).toEqual(true);

    const invalidJson = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "input", "manoonchai.json"),
        "utf8"
      )
    );

    // Empty keys
    invalidJson["keys"] = {};
    expect(await validateLayout(invalidJson)).toEqual(false);

    // Invalid layer name
    invalidJson["keys"] = { a: ["a", "A"] };
    invalidJson["layers"][0] = "InvalidLayerName";
    expect(await validateLayout(invalidJson)).toEqual(false);
  });
});
