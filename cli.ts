import prompts from "prompts"
import fs from "fs"
import path from "path"
import { generateKeylayout } from "./generator/generateKeylayout"
import { generateKlc } from "./generator/generateKlc"
import { generateXkb } from "./generator/generateXkb"
import { generateKcm } from "./generator/generateKcm"
import { generateChr_background } from "./generator/generateChr_background"
import { generateChr_manifest } from "./generator/generateChr_manifest"
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
      const dir = `output/${layoutName}`
      if (!fs.existsSync(dir)){
              fs.mkdirSync(dir);
      }
      const outputFilename = `output/${layoutName}/${layoutName}.keylayout`
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
      const dir = `output/${layoutName}`
      if (!fs.existsSync(dir)){
              fs.mkdirSync(dir);
      }
      const outputFilename = `output/${layoutName}/`+jsonInput.os.windows.installerName+`.klc`
      await generateKlc(jsonInput, outputFilename)

      console.log(`Output : ${outputFilename}`)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }

    // Xkb
    try {
      const layoutName = response.input.split(".").slice(0, -1).join(".")
      const dir = `output/${layoutName}`
      if (!fs.existsSync(dir)){
              fs.mkdirSync(dir);
      }
      const outputFilename = `output/${layoutName}/${layoutName}_xkb`
      await generateXkb(jsonInput, outputFilename)

      console.log(`Output : ${outputFilename}`)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }

    // Kmc
    try {
      const layoutName = response.input.split(".").slice(0, -1).join(".")
      const dir = `output/${layoutName}`
      if (!fs.existsSync(dir)){
              fs.mkdirSync(dir);
      }
      const outputFilename = `output/${layoutName}/${layoutName}.kcm`
      await generateKcm(jsonInput, outputFilename)

      console.log(`Output : ${outputFilename}`)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }

    // Chr___OS
    try {
      const layoutName = response.input.split(".").slice(0, -1).join(".")
      const dir = `output/${layoutName}/${jsonInput.os.windows.installerName.toLowerCase()}`
      if (!fs.existsSync(dir)){
              fs.mkdirSync(dir);
      }
      const outputManifest = dir+`/manifest.json`
      await generateChr_manifest(jsonInput, outputManifest)
      console.log(`Output : ${outputManifest}`)
      const outputBackground = dir+`/background.js`
      await generateChr_background(jsonInput, outputBackground)
      console.log(`Output : ${outputBackground}`)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  })()
