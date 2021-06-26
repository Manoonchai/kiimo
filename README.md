# Kiimo

(Work in progress)

Modify, and generate keyboard layout from single JSON file. Built with TypeScript.

## Features

- [ ] Validate JSON layout (See example files in [`input`](./input))
- [ ] Generate layout files
  - [ ] `.keylayout` (macOS)
  - [ ] `.klc` (Windows)
  - [ ] XKB (Linux)
  - [ ] etc

## Layout JSON Format (TODO)

- Basic information
  - `name`
  - `version`
  - `language`
- Layout data
  - `keys`
  - `layers`
