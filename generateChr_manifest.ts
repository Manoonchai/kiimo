import { plainToClass } from "class-transformer"
import { validate } from "class-validator"
import fs from "fs"
import { Layout, WindowsAttributes } from "./main"

export async function generateChr_manifest(
  content: Record<string, unknown>,
  outputPath: string,
): Promise<void> {
  const layout = plainToClass(Layout, content)
  const errors = await validate(layout)

  if (errors.length) {
    throw new Error(errors.map((e) => e.toString()).join(", "))
  }

  const windowsErrors = await validate(
    plainToClass(WindowsAttributes, layout.os.windows),
  )

  if (windowsErrors.length) {
    throw new Error(windowsErrors.map((e) => e.toString()).join(", "))
  }

  const chrLocales = {
    Thai: "th",
    Laos: "la",
  }
  
  const lines = 
`{
  "name": "${layout.language} ${layout.name} v${layout.version}",
  "version": "${layout.version}",
  "manifest_version": 3,
  "description": "${layout.language} ${layout.name} v${layout.version}",
  "background": {
    "service_worker": "background.js"
  },
  "icons": {
    "16": "icon16.png",
    "48": "icon48.png",
    "128": "icon128.png"
  },
  "permissions": [
    "input"
  ],
  "input_components": [
    {
      "name": "${layout.language} ${layout.name} v${layout.version}",
      "type": "ime",
      "id": "${chrLocales[layout.language as keyof typeof chrLocales]}_${layout.name.toLowerCase()}_remap",
      "description": "${layout.language} ${layout.name} v${layout.version}",
      "language": "${chrLocales[layout.language as keyof typeof chrLocales]}", 
      "layouts": ["la(stea)"]
    }
  ]
}`
//"layouts": ["la(stea)"] due all embed-thai-layout lack of "level3(ralt_switch)", use laos instead.

  fs.writeFileSync(
    outputPath,
    lines,
    {
      encoding: "utf8",
    },
  )
}
