import prompts from "prompts"
import fs from "fs"
import path from "path"
import { generateLayout } from "./main"
import replace from "replace-in-file"

const filenames = fs.readdirSync("input")
const choices = filenames.map((filename) => ({
  title: filename,
  value: filename,
}))

;(async () => {
  const response = await prompts({
    type: "select",
    name: "value",
    message: "Pick input JSON file",
    choices,
  })

  const jsonInput = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "input", response.value), "utf8")
  )

  const keylayoutXml = await generateLayout(jsonInput)

  const layoutName = response.value.split(".")[0]
  const outputFilename = `output/${layoutName}.keylayout`
  fs.writeFileSync(outputFilename, keylayoutXml)

  // Replace Unicode
  const options = {
    files: outputFilename,
    from: /%26%23x([0-9A-F]+)%3B/g,
    to: "&#x$1;",
  }

  try {
    replace.sync(options)
  } catch (error) {
    console.error("Error occurred:", error)
  }

  console.log(`Output : ${outputFilename}`)
})()
