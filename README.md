# Kiimo

Modify, and generate keyboard layout from single JSON file. Built with TypeScript.

## Features

- Validate JSON layout (See example files in [`input`](./input))
- Generate layout files
  - `.keylayout` (macOS)
  - `.klc` (Windows)
  - `.kcm` (Android Physical keyboard)
  - XKB (Linux)
  - remap extension for Chrome OS (Manifest V3) (icons must be added manually / alphanumeric-shortcut keys will not work.)