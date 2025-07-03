# Kiimo

Modify, and generate keyboard layout from single JSON file. Built with TypeScript.

## Features

- Validate JSON layout (See example files in [`input`](./input))
- Generate layout files
  - `.keylayout` (macOS) *inside `.bundle`*
  - `.klc` (Windows)
  - `.kcm` (Android Physical keyboard)
  - XKB (Linux, BSD, etc)
  - Chrome OS remap extension (Manifest V3)  
    *Note: Alphanumeric shortcut keys still do not work on Chrome OS.*

## Notes for JIS & ISO Layout
- **ISO and JIS layouts are not supported on Windows yet**:  
  Kiimo does not currently generate `.klc` files for ISO or JIS layouts, and **Microsoft Keyboard Layout Creator (MSKLC)** cannot compile them correctly  
  (e.g., `¥` and `_` keys cannot be mapped).

# How to Create Your Own Layout

1. Edit an existing JSON file in the [`input`](./input) directory, or add a new one.
2. Some platforms use icons or images; source images are in the [`src`](./src) folder.  
   If you want to use your own icons, create images with the same filenames and **replace the files inside the built output folder after building**.

# How to Build a Layout

You can build the layout using any compatible runtime.  
In this example, we use [Bun](https://bun.sh):

1. Install dependencies:
   ```
   bun install
   ```
2. Run the CLI:
   ```
   bun run cli
   ```
3. Select a layout from the list.  
   ```
   $ bun run cli
   ? Pick input JSON file › - Use arrow-keys. Return to submit.
     Manoonchai-ColemakDH-Mod.json
   ❯ Manoonchai.json
     Manoonchai_Lao.json
     Manoonchai-WittNV.json
     Manoonchai-v0.2.json
     Manoonchai-JIS.json
    ```
4. The generated files will appear in:
    ```
    output/<filename>/
    ```
    where `<filename>` matches the selected JSON file.
5. For **Windows** users:  
   To install the layout on your PC, use **Microsoft Keyboard Layout Creator (MSKLC)** to compile the generated `.klc` file into an installable layout.  

# Changelog
## 2025/07/03
- Added support for **ISO** and **JIS** layouts on:
  - macOS
  - XKB (Linux, BSD, etc)
  - Chrome OS
  - Android physical keyboard

- **macOS**: Layouts now build as `.bundle` format.  
   *(It's just a folder with a specific file extension.)*

- **Android (.kcm)**: Alphanumeric shortcut keys are now supported; no longer fall back to the default QWERTY layout.  
   *(Theoretically; pending real-device testing.)*

## pre 2025/07/03
- ***works on my machine***

# License
```
MIT License
Copyright (c) 2021 Manassarn Manoonchai
```