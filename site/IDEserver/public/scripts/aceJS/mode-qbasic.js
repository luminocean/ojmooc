define("ace/mode/qbasic_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

    var QbasicHighlightRules = function() {

        this.$rules = {
            "start": [
                {
                    token: [
                        "meta.ending-space"
                    ],
                    regex: "$"
                },
                {
                    token: [
                        null
                    ],
                    regex: "^(?=\\t)",
                    next: "state_3"
                },
                {
                    token: [null],
                    regex: "^(?= )",
                    next: "state_4"
                },
                {
                    token: [
                        "text",
                        "storage.type.function.asp",
                        "text",
                        "entity.name.function.asp",
                        "text",
                        "punctuation.definition.parameters.asp",
                        "variable.parameter.function.asp",
                        "punctuation.definition.parameters.asp"
                    ],
                    regex: "^(\\s*)(Function|Sub)(\\s*)([a-zA-Z_]\\w*)(\\s*)(\\()([^)]*)(\\))"
                },
                {
                    token: "punctuation.definition.comment.asp",
                    regex: "'|REM",
                    next: "comment"
                },
                {
                    token: [
                        "keyword.control.asp"
                    ],
                    regex: "\\b(?:If|Then|Else|ElseIf|Else If|End If|While|Wend|For|To|Each|Case|Select|End Select|Return|Continue|Do|Until|Loop|Next|With|Exit Do|Exit For|Exit Function|Exit Property|Exit Sub|IIf)\\b"
                },
                {
                    token: "keyword.operator.asp",
                    regex: "\\b(?:Mod|And|Not|Or|Xor|as)\\b"
                },
                {
                    token: "storage.type.asp",
                    regex: "Dim|Call|Class|Const|Dim|Redim|Function|Sub|Private Sub|Public Sub|End sub|End Function|Set|Let|Get|New|Randomize|Option Explicit|On Error Resume Next|On Error GoTo"
                },
                {
                    token: "constant.language.asp",
                    regex: "\\b(?:Empty|False|Nothing|Null|True)\\b"
                },
                {
                    token: "punctuation.definition.string.begin.asp",
                    regex: '"',
                    next: "string"
                },
                {
                    token: [
                        "punctuation.definition.variable.asp"
                    ],
                    regex: "(\\$)[a-zA-Z_x7f-xff][a-zA-Z0-9_x7f-xff]*?\\b\\s*"
                },

                //语言内置函数
                {
                    token: "support.function.vb.asp",
                    regex: "\\b(?:Array|Add|Asc|Atn|CBool|CByte|CCur|CDate|CDbl|Chr|CInt|CLng|Conversions|Cos|CreateObject|CSng|CStr|Date|DateAdd|DateDiff|DatePart|DateSerial|DateValue|Day|Derived|Math|Escape|Eval|Exists|Exp|Filter|FormatCurrency|FormatDateTime|FormatNumber|FormatPercent|GetLocale|GetObject|GetRef|Hex|Hour|InputBox|InStr|InStrRev|Int|Fix|IsArray|IsDate|IsEmpty|IsNull|IsNumeric|IsObject|Item|Items|Join|Keys|LBound|LCase|Left|Len|LoadPicture|Log|LTrim|RTrim|Trim|Maths|Mid|Minute|Month|MonthName|MsgBox|Now|Oct|Remove|RemoveAll|Replace|RGB|Right|Rnd|Round|ScriptEngine|ScriptEngineBuildVersion|ScriptEngineMajorVersion|ScriptEngineMinorVersion|Second|SetLocale|Sgn|Sin|Space|Split|Sqr|StrComp|String|StrReverse|Tan|Time|Timer|TimeSerial|TimeValue|TypeName|UBound|UCase|Unescape|VarType|Weekday|WeekdayName|Year)\\b"
                },

                {
                    token: [
                        "constant.numeric.asp"
                    ],
                    regex: "-?\\b(?:(?:0(?:x|X)[0-9a-fA-F]*)|(?:(?:[0-9]+\\.?[0-9]*)|(?:\\.[0-9]+))(?:(?:e|E)(?:\\+|-)?[0-9]+)?)(?:L|l|UL|ul|u|U|F|f)?\\b"
                },
                {
                    token: [
                        "entity.name.function.asp"
                    ],
                    regex: "(?:(\\b[a-zA-Z_x7f-xff][a-zA-Z0-9_x7f-xff]*?\\b)(?=\\(\\)?))"
                },
                {
                    token: [
                        "keyword.operator.asp"
                    ],
                    regex: "\\-|\\+|\\*\\\/|\\>|\\<|\\=|\\&"
                }
            ],
            "state_3": [
                {
                    token: [
                        "meta.odd-tab.tabs",
                        "meta.even-tab.tabs"
                    ],
                    regex: "(\\t)(\\t)?"
                },
                {
                    token: "meta.leading-space",
                    regex: "(?=[^\\t])",
                    next: "start"
                },
                {
                    token: "meta.leading-space",
                    regex: ".",
                    next: "state_3"
                }
            ],
            "state_4": [
                {
                    token: ["meta.odd-tab.spaces", "meta.even-tab.spaces"],
                    regex: "(  )(  )?"
                },
                {
                    token: "meta.leading-space",
                    regex: "(?=[^ ])",
                    next: "start"
                },
                {
                    defaultToken: "meta.leading-space"
                }
            ],
            "comment": [
                {
                    token: "comment.line.apostrophe.asp",
                    regex: "$|(?=(?:%>))",
                    next: "start"
                },
                {
                    defaultToken: "comment.line.apostrophe.asp"
                }
            ],
            "string": [
                {
                    token: "constant.character.escape.apostrophe.asp",
                    regex: '""'
                },
                {
                    token: "string.quoted.double.asp",
                    regex: '"',
                    next: "start"
                },
                {
                    defaultToken: "string.quoted.double.asp"
                }
            ]
        }

    };

    oop.inherits(QbasicHighlightRules, TextHighlightRules);

    exports.QbasicHighlightRules = QbasicHighlightRules;
});

define("ace/mode/qbasic",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/qbasic_highlight_rules"], function(require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var TextMode = require("./text").Mode;
    var QbasicHighlightRules = require("./qbasic_highlight_rules").QbasicHighlightRules;

    var Mode = function() {
        this.HighlightRules = QbasicHighlightRules;
    };
    oop.inherits(Mode, TextMode);

    (function() {

        this.lineCommentStart = ["'", "REM"];

        this.$id = "ace/mode/qbasic";
    }).call(Mode.prototype);

    exports.Mode = Mode;
});
