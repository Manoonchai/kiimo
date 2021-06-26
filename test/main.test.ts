import fs from "fs";
import path from "path";
import { js2xml, xml2js } from "xml-js";
import { generate } from "../main";

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
    console.dir(jsContent);
    const xmlContent = js2xml(jsContent, {
      compact: false,
      spaces: 2,
    });
    console.log({ xmlContent });
  });
});
