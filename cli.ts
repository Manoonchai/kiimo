import prompts from "prompts"
import fs from "fs"
import path from "path"
import { generateKeylayout } from "./generateKeylayout"
import { generateKlc } from "./generateKlc"
import { generateXkb } from "./generateXkb"
import { fixUnicode } from "./utils"

// eslint-disable-next-line @typescript-eslint/no-var-requires
prompts.override(require("yargs").argv)

const filenames = fs.readdirSync("input")
const choices = filenames.map((filename) => ({
  title: filename,
  value: filename,
}))

  ; (async () => {
    const response = await prompts({
      type: "select",
      name: "input",
      message: "Pick input JSON file",
      choices,
    })

    const jsonInput = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "input", response.input), "utf8")
    )

    // Keylayout
    try {
      const keylayoutXml = await generateKeylayout(jsonInput)
      const layoutName = response.input.split(".").slice(0, -1).join(".")
      const outputFilename = `output/${layoutName}.keylayout`
      fs.writeFileSync(outputFilename, keylayoutXml)

      fixUnicode(outputFilename)

      console.log(`Output : ${outputFilename}`)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }

    // Klc
    try {
      const layoutName = response.input.split(".").slice(0, -1).join(".")
      const outputFilename = `output/${layoutName}.klc`
      await generateKlc(jsonInput, outputFilename)

      console.log(`Output : ${outputFilename}`)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }

    // Xkb
    try {
      const layoutName = response.input.split(".").slice(0, -1).join(".")
      const outputFilename = `output/${layoutName}_xkb`
      await generateXkb(jsonInput, outputFilename)

      console.log(`Output : ${outputFilename}`)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  })()
