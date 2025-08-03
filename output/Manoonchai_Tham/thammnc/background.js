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
"Digit0": { "plain": {"plain": "᪩", "shifted": "᪀"}, "alternate": {"plain": "᪐", "shifted":""}, "code": "Digit0"},
"Digit1": { "plain": {"plain": "᪨", "shifted": "᪁"}, "alternate": {"plain": "᪑", "shifted":"!"}, "code": "Digit1"},
"Digit2": { "plain": {"plain": "ᩓ", "shifted": "᪂"}, "alternate": {"plain": "᪒", "shifted":"@"}, "code": "Digit2"},
"Digit3": { "plain": {"plain": "ᩴ", "shifted": "᪃"}, "alternate": {"plain": "᪓", "shifted":"#"}, "code": "Digit3"},
"Digit4": { "plain": {"plain": "ᨤ", "shifted": "᪄"}, "alternate": {"plain": "᪔", "shifted":"$"}, "code": "Digit4"},
"Digit5": { "plain": {"plain": "ᩕ", "shifted": "᪅"}, "alternate": {"plain": "᪕", "shifted":"%"}, "code": "Digit5"},
"Digit6": { "plain": {"plain": "ᩳ", "shifted": "᪆"}, "alternate": {"plain": "᪖", "shifted":"^"}, "code": "Digit6"},
"Digit7": { "plain": {"plain": "ᩋ", "shifted": "᪇"}, "alternate": {"plain": "᪗", "shifted":"&"}, "code": "Digit7"},
"Digit8": { "plain": {"plain": "᩵", "shifted": "᪈"}, "alternate": {"plain": "᪘", "shifted":"*"}, "code": "Digit8"},
"Digit9": { "plain": {"plain": "ᩖ", "shifted": "᪉"}, "alternate": {"plain": "᪙", "shifted":"+"}, "code": "Digit9"},
"Minus": { "plain": {"plain": "-", "shifted": "("}, "alternate": {"plain": "_", "shifted":"÷"}, "code": "Minus"},
"Equal": { "plain": {"plain": "ᪧ", "shifted": ")"}, "alternate": {"plain": "=", "shifted":"×"}, "code": "Equal"},
"Backquote": { "plain": {"plain": "᪥", "shifted": "᪬"}, "alternate": {"plain": "~", "shifted":"`"}, "code": "Backquote"},
"IntlYen": { "plain": {"plain": "᪥", "shifted": "᪬"}, "alternate": {"plain": "¥", "shifted":""}, "code": "IntlYen"},
"KeyQ": { "plain": {"plain": "ᩲ", "shifted": "ᨰ"}, "alternate": {"plain": "᪭", "shifted":"1"}, "code": "KeyQ"},
"KeyW": { "plain": {"plain": "ᨲ", "shifted": "ᨭ"}, "alternate": {"plain": "᪢", "shifted":"2"}, "code": "KeyW"},
"KeyE": { "plain": {"plain": "ᩉ", "shifted": "ᨪ"}, "alternate": {"plain": "ᩚ", "shifted":"3"}, "code": "KeyE"},
"KeyR": { "plain": {"plain": "ᩃ", "shifted": "ᨬ"}, "alternate": {"plain": "᩷", "shifted":"4"}, "code": "KeyR"},
"KeyT": { "plain": {"plain": "ᩈ", "shifted": "ᨼ"}, "alternate": {"plain": "᩸", "shifted":"5"}, "code": "KeyT"},
"KeyY": { "plain": {"plain": "ᨸ", "shifted": "ᨨ"}, "alternate": {"plain": "᩹", "shifted":"6"}, "code": "KeyY"},
"KeyU": { "plain": {"plain": "ᩢ", "shifted": "ᩧ"}, "alternate": {"plain": "ᩙ", "shifted":"7"}, "code": "KeyU"},
"KeyI": { "plain": {"plain": "ᨠ", "shifted": "ᨵ"}, "alternate": {"plain": "ᩂ", "shifted":"8"}, "code": "KeyI"},
"KeyO": { "plain": {"plain": "ᩥ", "shifted": "ᨮ"}, "alternate": {"plain": "ᩍ", "shifted":"9"}, "code": "KeyO"},
"KeyP": { "plain": {"plain": "ᨷ", "shifted": "᩺"}, "alternate": {"plain": "ᩝ", "shifted":"0"}, "code": "KeyP"},
"BracketLeft": { "plain": {"plain": "ᩫ", "shifted": "ᨥ"}, "alternate": {"plain": "[", "shifted":"{"}, "code": "BracketLeft"},
"BracketRight": { "plain": {"plain": "ᩊ", "shifted": "ᨢ"}, "alternate": {"plain": "]", "shifted":"}"}, "code": "BracketRight"},
"KeyA": { "plain": {"plain": "ᨦ", "shifted": "ᩇ"}, "alternate": {"plain": "᪣", "shifted":""}, "code": "KeyA"},
"KeyS": { "plain": {"plain": "ᩮ", "shifted": "ᨳ"}, "alternate": {"plain": "ᩑ", "shifted":""}, "code": "KeyS"},
"KeyD": { "plain": {"plain": "ᩁ", "shifted": "ᩯ"}, "alternate": {"plain": "᪤", "shifted":""}, "code": "KeyD"},
"KeyF": { "plain": {"plain": "ᨶ", "shifted": "ᨩ"}, "alternate": {"plain": "᪬", "shifted":"฿"}, "code": "KeyF"},
"KeyG": { "plain": {"plain": "ᨾ", "shifted": "ᨻ"}, "alternate": {"plain": "ᩜ", "shifted":""}, "code": "KeyG"},
"KeyH": { "plain": {"plain": "ᩬ", "shifted": "ᨹ"}, "alternate": {"plain": "ᩌ", "shifted":""}, "code": "KeyH"},
"KeyJ": { "plain": {"plain": "ᩣ", "shifted": "ᩤ"}, "alternate": {"plain": "᪥", "shifted":""}, "code": "KeyJ"},
"KeyK": { "plain": {"plain": "᩠", "shifted": "ᨡ"}, "alternate": {"plain": "᩿", "shifted":""}, "code": "KeyK"},
"KeyL": { "plain": {"plain": "᩶", "shifted": "ᩰ"}, "alternate": {"plain": "ᩔ", "shifted":":"}, "code": "KeyL"},
"Semicolon": { "plain": {"plain": "ᩅ", "shifted": "ᨽ"}, "alternate": {"plain": "ᩞ", "shifted":";"}, "code": "Semicolon"},
"Quote": { "plain": {"plain": "ᩨ", "shifted": "\""}, "alternate": {"plain": "'", "shifted":"\""}, "code": "Quote"},
"Backslash": { "plain": {"plain": "ᩘ", "shifted": "ᨫ"}, "alternate": {"plain": "/", "shifted":"|"}, "code": "Backslash"},
"IntlBackslash": { "plain": {"plain": ".", "shifted": ","}, "alternate": {"plain": "§", "shifted":""}, "code": "IntlBackslash"},
"KeyZ": { "plain": {"plain": "ᩩ", "shifted": "ᩐ"}, "alternate": {"plain": "ᩗ", "shifted":"`"}, "code": "KeyZ"},
"KeyX": { "plain": {"plain": "ᩱ", "shifted": "ᨺ"}, "alternate": {"plain": "᪡", "shifted":"~"}, "code": "KeyX"},
"KeyC": { "plain": {"plain": "ᨴ", "shifted": "᩻"}, "alternate": {"plain": "᪠", "shifted":""}, "code": "KeyC"},
"KeyV": { "plain": {"plain": "ᨿ", "shifted": "ᨱ"}, "alternate": {"plain": "᪦", "shifted":""}, "code": "KeyV"},
"KeyB": { "plain": {"plain": "ᨧ", "shifted": "ᩭ"}, "alternate": {"plain": "ᩏ", "shifted":""}, "code": "KeyB"},
"KeyN": { "plain": {"plain": "ᨣ", "shifted": "ᩳ"}, "alternate": {"plain": "◌", "shifted":"<"}, "code": "KeyN"},
"KeyM": { "plain": {"plain": "ᩦ", "shifted": "᩼"}, "alternate": {"plain": "ᩎ", "shifted":">"}, "code": "KeyM"},
"Comma": { "plain": {"plain": "ᨯ", "shifted": "ᩆ"}, "alternate": {"plain": ",", "shifted":"᪪"}, "code": "Comma"},
"Period": { "plain": {"plain": "ᩡ", "shifted": "ᩛ"}, "alternate": {"plain": ".", "shifted":"᪫"}, "code": "Period"},
"Slash": { "plain": {"plain": "ᩪ", "shifted": "?"}, "alternate": {"plain": "ᩄ", "shifted":"\\"}, "code": "Slash"},
"IntlRo": { "plain": {"plain": "_", "shifted": "_"}, "alternate": {"plain": "_", "shifted":"_"}, "code": "IntlRo"},
"Space": { "plain": {"plain": " ", "shifted": "​"}, "alternate": {"plain": "‌", "shifted":" "}, "code": "Space"},
"NumpadDecimal": { "plain": {"plain": ".", "shifted": ","}, "alternate": {"plain": ".", "shifted":"."}, "code": "NumpadDecimal"},
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
