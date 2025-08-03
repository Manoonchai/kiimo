import prompts from "prompts"
import fs from "fs"
import path from "path"
import { generateKeylayout } from "./generator/generateKeylayout"
import { generateMacBundle } from "./generator/generateMacBundle"
import { generateKlc } from "./generator/generateKlc"
import { generateXkb } from "./generator/generateXkb"
import { generateKcm } from "./generator/generateKcm"
import { generateChr_background } from "./generator/generateChr_background"
import { generateChr_manifest } from "./generator/generateChr_manifest"
import { fixUnicode } from "./utils"

// eslint-disable-next-line @typescript-eslint/no-var-requires
prompts.override(require("yargs").argv)

const filenames = fs.readdirSync("input")
  .filter(name => name.endsWith(".json") && !name.endsWith(".json.bak"))
  .sort((a, b) => a.localeCompare(b))
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

    let jsonName: string;
    let layoutName: string;
    let safeLayoutName: string;
    let dir: string;

    try {
      jsonName = response.input.split(".").slice(0, -1).join(".");
      layoutName = jsonInput.name;
      // Replace spaces with underscores for safe use in IDs or filenames for some system
      safeLayoutName = layoutName.replace(/\s+/g, "_").replace(/\./g, "_");
      dir = `output/${jsonName}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
    } catch (e) {
      console.error(e)
      process.exit(1)
    }

    // Keylayout
    try {
      const keylayoutXml = await generateKeylayout(jsonInput)
      const bundleDir = `${dir}/${layoutName}.bundle`
      const contentsDir = `${bundleDir}/Contents`
      const resourceDir = `${contentsDir}/Resources`
      const lprojDir = `${resourceDir}/th.lproj`
      if (!fs.existsSync(lprojDir)) {
        fs.mkdirSync(lprojDir, { recursive: true })
      }
      const outputFilename = `${resourceDir}/${layoutName}.keylayout`
      fs.writeFileSync(outputFilename, keylayoutXml, "utf-8")
      fixUnicode(outputFilename)

      console.log(`Output : ${outputFilename}`)

      const iconName = jsonInput.icon ? `icon_${jsonInput.icon}` : 'icon';
      fs.copyFileSync(
        `src/iconMac/${iconName}.icns`,
        path.join(resourceDir, `${layoutName}.icns`)
      );

      const files = await generateMacBundle(jsonInput)
      for (const [filename, content] of Object.entries(files)) {
        const filePath = path.join(contentsDir, filename)
        fs.writeFileSync(filePath, content, "utf-8")
      }
    } catch (e) {
      console.error(e)
      process.exit(1)
    }


    // Klc
    try {
      if (!fs.existsSync(dir)){
              fs.mkdirSync(dir);
      }
      const outputFilename = `${dir}/`+jsonInput.os.windows.installerName+`.klc`
      await generateKlc(jsonInput, outputFilename)

      console.log(`Output : ${outputFilename}`)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }

    // Xkb
    try {
      const outputFilename = `${dir}/${safeLayoutName}_xkb`
      await generateXkb(jsonInput, outputFilename)

      console.log(`Output : ${outputFilename}`)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }

    // Kmc
    try {
      if (!fs.existsSync(dir)){
              fs.mkdirSync(dir);
      }
      const outputFilename = `${dir}/${safeLayoutName}.kcm`
      await generateKcm(jsonInput, outputFilename)

      console.log(`Output : ${outputFilename}`)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }

    // Chr___OS
    try {
      const chrDir = `${dir}/${jsonInput.os.windows.installerName.toLowerCase()}`
      if (!fs.existsSync(chrDir)){
              fs.mkdirSync(chrDir);
      }
      const outputManifest = chrDir+`/manifest.json`
      await generateChr_manifest(jsonInput, outputManifest)
      console.log(`Output : ${outputManifest}`)
      const outputBackground = chrDir+`/background.js`
      await generateChr_background(jsonInput, outputBackground)
      console.log(`Output : ${outputBackground}`)
      fs.readdirSync('src/iconChr').forEach(f =>
        fs.copyFileSync(path.join('src/iconChr', f), path.join(chrDir, f))
      )
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  })()
