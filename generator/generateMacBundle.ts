import { plainToClass } from "class-transformer"
import { validate } from "class-validator"
import { Layout, WindowsAttributes } from "../main"

export async function generateMacBundle(
  content: Record<string, unknown>,
): Promise<Record<string, string>> {
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

  const files: Record<string, string> = {}

  files["version.plist"] = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>BuildVersion</key>
  <string></string>
  <key>ProjectName</key>
  <string>${layout.name}</string>
  <key>SourceVersion</key>
  <string></string>
</dict>
</plist>`

  files["info.plist"] =`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleIdentifier</key>
	<string>com.manoonchai.keyboardlayout.${layout.os.windows.installerName.toLocaleLowerCase()}</string>
	<key>CFBundleName</key>
	<string>${layout.name}</string>
	<key>CFBundleVersion</key>
	<string></string>
	<key>KLInfo_${layout.name}</key>
	<dict>
		<key>TICapsLockLanguageSwitchCapable</key>
		<true/>
		<key>TISIconIsTemplate</key>
		<false/>
		<key>TISInputSourceID</key>
		<string>com.manoonchai.keyboardlayout.${layout.os.windows.installerName.toLocaleLowerCase()}.${layout.language.toLocaleLowerCase()}</string>
		<key>TISIntendedLanguage</key>
		<string>th</string>
	</dict>
</dict>
</plist>`

files["Resources/th.lproj/infoPlist.strings"] =`
"${layout.name}" = "${layout.nameTH}";
`

  return files
}
