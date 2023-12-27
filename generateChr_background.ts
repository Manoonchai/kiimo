import {
  plainToClass
} from "class-transformer"
import {
  validate
} from "class-validator"
import fs from "fs"
import {
  Layout,
  WindowsAttributes
} from "./main"

export async function generateChr_background(
  content: Record < string, unknown > ,
  outputPath: string,
): Promise < void > {
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

  function toCheck(str: string) {
    // let hex, i
    // let result = ""
    // for (i = 0; i < str.length; i++) {
    //   hex = str.charCodeAt(i).toString(16)
    //   result += "\\u" + ("0000" + hex).slice(-4)
    // }
    return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  const klfDefaultLayout = {
    "1": "Digit1",
    "2": "Digit2",
    "3": "Digit3",
    "4": "Digit4",
    "5": "Digit5",
    "6": "Digit6",
    "7": "Digit7",
    "8": "Digit8",
    "9": "Digit9",
    "0": "Digit0",
    "-": "Minus",
    "=": "Equal",
    "`": "Backquote",
    q: "KeyQ",
    w: "KeyW",
    e: "KeyE",
    r: "KeyR",
    t: "KeyT",
    y: "KeyY",
    u: "KeyU",
    i: "KeyI",
    o: "KeyO",
    p: "KeyP",
    "[": "BracketLeft",
    "]": "BracketRight",
    a: "KeyA",
    s: "KeyS",
    d: "KeyD",
    f: "KeyF",
    g: "KeyG",
    h: "KeyH",
    j: "KeyJ",
    k: "KeyK",
    l: "KeyL",
    ";": "Semicolon",
    "'": "Quote",
    "\\": "Backslash",
    z: "KeyZ",
    x: "KeyX",
    c: "KeyC",
    v: "KeyV",
    b: "KeyB",
    n: "KeyN",
    m: "KeyM",
    ",": "Comma",
    ".": "Period",
    "/": "Slash",
    " ": "Space",
    KPDL: "NumpadDecimal",
  }

  const lines = `/*# License: ${layout.license}
Generated via github.com/Manoonchai/kiimo
*/
var AltGr = { PLAIN: "plain", ALTERNATE: "alternate" };
var Shift = { PLAIN: "plain", SHIFTED: "shifted" };

var contextID = -1;
var altGrState = AltGr.PLAIN;
var shiftState = Shift.PLAIN;
var lastRemappedKeyEvent = undefined;

var lut = {`

const endLines = `
};


chrome.input.ime.onFocus.addListener(function(context) {
  contextID = context.contextID;
});

function updateAltGrState(keyData) {
  altGrState = (keyData.code == "AltRight") ? ((keyData.type == "keydown") ? AltGr.ALTERNATE : AltGr.PLAIN)
                                              : altGrState;
}

function updateShiftState(keyData) {
  shiftState = ((keyData.shiftKey && !(keyData.capsLock)) || (!(keyData.shiftKey) && keyData.capsLock)) ? 
                 Shift.SHIFTED : Shift.PLAIN;
}

function isPureModifier(keyData) {
  return (keyData.key == "Shift") || (keyData.key == "Ctrl") || (keyData.key == "Alt");
}

function isRemappedEvent(keyData) {
  // hack, should check for a sender ID (to be added to KeyData)
  return lastRemappedKeyEvent != undefined &&
         (lastRemappedKeyEvent.key == keyData.key &&
          lastRemappedKeyEvent.code == keyData.code &&
          lastRemappedKeyEvent.type == keyData.type
         ); // requestID would be different so we are not checking for it  
}


chrome.input.ime.onKeyEvent.addListener(
    function(engineID, keyData) {
      var handled = false;
      
      if (isRemappedEvent(keyData)) {
        lastRemappedKeyEvent = undefined;
        return handled;
      }

      updateAltGrState(keyData);
      updateShiftState(keyData);
                
      if (lut[keyData.code]) {
        //avoid hell key:process loop
        if (keyData.ctrlKey === true && keyData.code != "Space") {
            return;
        }
          var remappedKeyData = keyData;
          remappedKeyData.key = lut[keyData.code][altGrState][shiftState];
          remappedKeyData.code = lut[keyData.code].code;
        
        if (chrome.input.ime.sendKeyEvents != undefined) {
          chrome.input.ime.sendKeyEvents({"contextID": contextID, "keyData": [remappedKeyData]});
          handled = true;
          lastRemappedKeyEvent = remappedKeyData;
        } else if (keyData.type == "keydown" && !isPureModifier(keyData)) {
          chrome.input.ime.commitText({"contextID": contextID, "text": remappedKeyData.key});
          handled = true;
        }
      }
      
      return handled;
});
`

  const layoutLines = [""]
  Object.entries(klfDefaultLayout).forEach(([key, value]) => {
    const extensions =
      `: { "plain": {"plain": "${toCheck(layout.keys[key][0])}"` +
      `, "shifted": "${toCheck(layout.keys[key][1])}"}` +
      `, "alternate": {"plain": "${toCheck(layout.keys[key][3])}"` +
      `, "shifted":"${toCheck(layout.keys[key][5])}"}, ` +
      `"code": "${value}"},`

    layoutLines.push([`"${value}"`, ...extensions].join(""))
  })

  fs.writeFileSync(
    outputPath,
    [lines, layoutLines.join("\n"),endLines].join(""), {
      encoding: "utf8",
    },
  )
}