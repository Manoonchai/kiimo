import fs from "fs";
import path from "path";

export function generate() {
  fs.writeFileSync(path.join("output", "foo.keylayout"), "Hello!");
}
