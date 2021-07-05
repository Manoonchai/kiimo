import replace from "replace-in-file"

export function fixUnicode(path: string): void {
  const options = {
    files: path,
    from: /%26%23x([0-9A-F]+)%3B/g,
    to: "&#x$1;",
  }

  replace.sync(options)
}
