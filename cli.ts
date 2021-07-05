import prompts from "prompts"
import fs from "fs"
import path from "path"
import { generateLayout } from "./main"
import { fixUnicode } from "./utils"

// eslint-disable-next-line @typescript-eslint/no-var-requires
prompts.override(require("yargs").argv)

const filenames = fs.readdirSync("input")
const choices = filenames.map((filename) => ({
  title: filename,
  value: filename,
}))

;(async () => {
  const response = await prompts({
    type: "select",
    name: "input",
    message: "Pick input JSON file",
    choices,
  })

  const jsonInput = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "input", response.input), "utf8")
  )

  try {
    const keylayoutXml = await generateLayout(jsonInput)
    const layoutName = response.input.split(".")[0]
    const outputFilename = `output/${layoutName}.keylayout`
    fs.writeFileSync(outputFilename, keylayoutXml)

    fixUnicode(outputFilename)

    console.log(`Output : ${outputFilename}`)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
