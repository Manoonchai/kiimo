/*# License: MIT
Generated via github.com/Manoonchai/kiimo
*/
var AltGr = { PLAIN: "plain", ALTERNATE: "alternate" };
var Shift = { PLAIN: "plain", SHIFTED: "shifted" };

var contextID = -1;
var altGrState = AltGr.PLAIN;
var shiftState = Shift.PLAIN;
var lastRemappedKeyEvent = undefined;

var lut = {
"Digit0": { "plain": {"plain": "0", "shifted": ")"}, "alternate": {"plain": "໐", "shifted":""}, "code": "Digit0"},
"Digit1": { "plain": {"plain": "1", "shifted": "!"}, "alternate": {"plain": "໑", "shifted":"!"}, "code": "Digit1"},
"Digit2": { "plain": {"plain": "2", "shifted": "@"}, "alternate": {"plain": "໒", "shifted":"@"}, "code": "Digit2"},
"Digit3": { "plain": {"plain": "3", "shifted": "#"}, "alternate": {"plain": "໓", "shifted":"#"}, "code": "Digit3"},
"Digit4": { "plain": {"plain": "4", "shifted": "$"}, "alternate": {"plain": "໔", "shifted":"$"}, "code": "Digit4"},
"Digit5": { "plain": {"plain": "5", "shifted": "%"}, "alternate": {"plain": "໕", "shifted":"%"}, "code": "Digit5"},
"Digit6": { "plain": {"plain": "6", "shifted": ","}, "alternate": {"plain": "໖", "shifted":"^"}, "code": "Digit6"},
"Digit7": { "plain": {"plain": "7", "shifted": "&"}, "alternate": {"plain": "໗", "shifted":"&"}, "code": "Digit7"},
"Digit8": { "plain": {"plain": "8", "shifted": "."}, "alternate": {"plain": "໘", "shifted":"*"}, "code": "Digit8"},
"Digit9": { "plain": {"plain": "9", "shifted": "("}, "alternate": {"plain": "໙", "shifted":""}, "code": "Digit9"},
"Minus": { "plain": {"plain": "-", "shifted": "_"}, "alternate": {"plain": "÷", "shifted":""}, "code": "Minus"},
"Equal": { "plain": {"plain": "=", "shifted": "+"}, "alternate": {"plain": "×", "shifted":""}, "code": "Equal"},
"Backquote": { "plain": {"plain": "`", "shifted": "~"}, "alternate": {"plain": "`", "shifted":""}, "code": "Backquote"},
"IntlYen": { "plain": {"plain": "`", "shifted": "~"}, "alternate": {"plain": "¥", "shifted":""}, "code": "IntlYen"},
"KeyQ": { "plain": {"plain": "ໃ", "shifted": "ຒ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyQ"},
"KeyW": { "plain": {"plain": "ຕ", "shifted": "ຏ"}, "alternate": {"plain": "x", "shifted":""}, "code": "KeyW"},
"KeyE": { "plain": {"plain": "ຫ", "shifted": "ຢ"}, "alternate": {"plain": "໡", "shifted":""}, "code": "KeyE"},
"KeyR": { "plain": {"plain": "ລ", "shifted": "ຎ"}, "alternate": {"plain": "໢", "shifted":""}, "code": "KeyR"},
"KeyT": { "plain": {"plain": "ສ", "shifted": "ຟ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyT"},
"KeyY": { "plain": {"plain": "ປ", "shifted": "ຉ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyY"},
"KeyU": { "plain": {"plain": "ັ", "shifted": "ຶ"}, "alternate": {"plain": "຺", "shifted":""}, "code": "KeyU"},
"KeyI": { "plain": {"plain": "ກ", "shifted": "ຮ"}, "alternate": {"plain": "ໞ", "shifted":""}, "code": "KeyI"},
"KeyO": { "plain": {"plain": "ິ", "shifted": "ຽ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyO"},
"KeyP": { "plain": {"plain": "ບ", "shifted": "ຘ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyP"},
"BracketLeft": { "plain": {"plain": "ົ", "shifted": "ຆ"}, "alternate": {"plain": "[", "shifted":"{"}, "code": "BracketLeft"},
"BracketRight": { "plain": {"plain": "ຬ", "shifted": "ຑ"}, "alternate": {"plain": "]", "shifted":"}"}, "code": "BracketRight"},
"KeyA": { "plain": {"plain": "ງ", "shifted": "ຩ"}, "alternate": {"plain": "໠", "shifted":""}, "code": "KeyA"},
"KeyS": { "plain": {"plain": "ເ", "shifted": "ຖ"}, "alternate": {"plain": "◌", "shifted":""}, "code": "KeyS"},
"KeyD": { "plain": {"plain": "ຣ", "shifted": "ແ"}, "alternate": {"plain": "₭", "shifted":""}, "code": "KeyD"},
"KeyF": { "plain": {"plain": "ນ", "shifted": "ຊ"}, "alternate": {"plain": "ໜ", "shifted":""}, "code": "KeyF"},
"KeyG": { "plain": {"plain": "ມ", "shifted": "ພ"}, "alternate": {"plain": "ໝ", "shifted":""}, "code": "KeyG"},
"KeyH": { "plain": {"plain": "ອ", "shifted": "ໍ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyH"},
"KeyJ": { "plain": {"plain": "າ", "shifted": "ຳ"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyJ"},
"KeyK": { "plain": {"plain": "່", "shifted": "ຂ"}, "alternate": {"plain": "຃", "shifted":""}, "code": "KeyK"},
"KeyL": { "plain": {"plain": "້", "shifted": "ໂ"}, "alternate": {"plain": "໣", "shifted":""}, "code": "KeyL"},
"Semicolon": { "plain": {"plain": "ວ", "shifted": "ຠ"}, "alternate": {"plain": ";", "shifted":":"}, "code": "Semicolon"},
"Quote": { "plain": {"plain": "ື", "shifted": "\""}, "alternate": {"plain": "'", "shifted":"\""}, "code": "Quote"},
"Backslash": { "plain": {"plain": "ໆ", "shifted": "ຯ"}, "alternate": {"plain": "\\", "shifted":"|"}, "code": "Backslash"},
"IntlBackslash": { "plain": {"plain": ".", "shifted": ","}, "alternate": {"plain": "§", "shifted":""}, "code": "IntlBackslash"},
"KeyZ": { "plain": {"plain": "ຸ", "shifted": "ຼ"}, "alternate": {"plain": "຦", "shifted":""}, "code": "KeyZ"},
"KeyX": { "plain": {"plain": "ໄ", "shifted": "ຝ"}, "alternate": {"plain": "຤", "shifted":""}, "code": "KeyX"},
"KeyC": { "plain": {"plain": "ທ", "shifted": "ຜ"}, "alternate": {"plain": "ຌ", "shifted":""}, "code": "KeyC"},
"KeyV": { "plain": {"plain": "ຍ", "shifted": "ຓ"}, "alternate": {"plain": "ໟ", "shifted":""}, "code": "KeyV"},
"KeyB": { "plain": {"plain": "ຈ", "shifted": "໊"}, "alternate": {"plain": "", "shifted":""}, "code": "KeyB"},
"KeyN": { "plain": {"plain": "ຄ", "shifted": "໋"}, "alternate": {"plain": "຅", "shifted":""}, "code": "KeyN"},
"KeyM": { "plain": {"plain": "ີ", "shifted": "໌"}, "alternate": {"plain": "໎", "shifted":""}, "code": "KeyM"},
"Comma": { "plain": {"plain": "ດ", "shifted": "ຨ"}, "alternate": {"plain": ",", "shifted":"<"}, "code": "Comma"},
"Period": { "plain": {"plain": "ະ", "shifted": "ຐ"}, "alternate": {"plain": ".", "shifted":">"}, "code": "Period"},
"Slash": { "plain": {"plain": "ູ", "shifted": "?"}, "alternate": {"plain": "/", "shifted":"?"}, "code": "Slash"},
"IntlRo": { "plain": {"plain": "_", "shifted": "_"}, "alternate": {"plain": "_", "shifted":"_"}, "code": "IntlRo"},
"Space": { "plain": {"plain": " ", "shifted": "​"}, "alternate": {"plain": " ", "shifted":" "}, "code": "Space"},
"NumpadDecimal": { "plain": {"plain": ",", "shifted": "."}, "alternate": {"plain": ",", "shifted":","}, "code": "NumpadDecimal"},
};


chrome.input.ime.onFocus.addListener(function(context) {
  contextID = context.contextID;
});

function updateAltGrState(keyData) {
  altGrState = (keyData.code == "AltRight") ? ((keyData.type == "keydown") ? AltGr.ALTERNATE : AltGr.PLAIN) : altGrState;
}

function updateShiftState(keyData) {
  shiftState = ((keyData.shiftKey && !(keyData.capsLock)) || (!(keyData.shiftKey) && keyData.capsLock)) ? Shift.SHIFTED : Shift.PLAIN;
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
