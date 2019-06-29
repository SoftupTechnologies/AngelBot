// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require('moo')

const lexer = moo.compile({
    VERSION: {match: /[0-9]*\.[0-9]*\.[0-9]*/},
    DATE: {match: /[0-9][0-9][0-9][0-9]\-[0-1][0-9]\-[0-3][0-9]/},
    UNRELEASED : {match: /[Uu]nreleased/},
    CATEGORY: ["BREAKING CHANGES", "NOTES", "FEATURES", ,"ENHANCEMENTS", "BUG FIXES", "IMPROVEMENTS"],
    PR: {match: /\[[PR#,0-9 ]+\]/},
    DESCRPT: {match: /\*[\w\(\)\`\´ ]+/},
    PAR_L: '(',
    PAR_R: ')',
    SQBR_L: '[',
    SQBR_R: ']',
    BRACE_L: '{',
    BRACE_R: '}',
    COLON: ':',
    SEMICOLON: ';',
    COMMA: ',',
    ASTERISK: '*',
    HASH: '#',
    STRING: {match: /"(?:\\["\\]|[^\n"\\])*"/, value: s => s.slice(1, -1)},
    QUOT: '"',
    WS: {
      match: /\s+/,
      lineBreaks: true
    },
});

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "MAIN$ebnf$1", "symbols": []},
    {"name": "MAIN$ebnf$1", "symbols": ["MAIN$ebnf$1", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "MAIN$ebnf$2", "symbols": []},
    {"name": "MAIN$ebnf$2", "symbols": ["MAIN$ebnf$2", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "MAIN", "symbols": ["MAIN$ebnf$1", "INPUT", "MAIN$ebnf$2"], "postprocess": function(d) { return d[1]; }},
    {"name": "INPUT$ebnf$1", "symbols": []},
    {"name": "INPUT$ebnf$1", "symbols": ["INPUT$ebnf$1", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "INPUT$ebnf$2", "symbols": []},
    {"name": "INPUT$ebnf$2", "symbols": ["INPUT$ebnf$2", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "INPUT$ebnf$3", "symbols": []},
    {"name": "INPUT$ebnf$3", "symbols": ["INPUT$ebnf$3", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "INPUT", "symbols": ["INPUT$ebnf$1", "FIRST", "INPUT$ebnf$2", "REST", "INPUT$ebnf$3"], "postprocess": function(d) { return d[1] + d[3]; }},
    {"name": "REST$ebnf$1", "symbols": []},
    {"name": "REST$ebnf$1", "symbols": ["REST$ebnf$1", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "REST", "symbols": ["FIRST", "REST$ebnf$1", "REST"], "postprocess": function(d) { return d[0] + d[2]; }},
    {"name": "REST", "symbols": []},
    {"name": "FIRST$ebnf$1", "symbols": []},
    {"name": "FIRST$ebnf$1", "symbols": ["FIRST$ebnf$1", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "FIRST", "symbols": ["HEADER", "FIRST$ebnf$1", "CHANGES"], "postprocess": function(d) { return d[0] + d[2]; }},
    {"name": "CHANGES$ebnf$1", "symbols": []},
    {"name": "CHANGES$ebnf$1", "symbols": ["CHANGES$ebnf$1", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "CHANGES$ebnf$2", "symbols": []},
    {"name": "CHANGES$ebnf$2", "symbols": ["CHANGES$ebnf$2", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "CHANGES$ebnf$3", "symbols": []},
    {"name": "CHANGES$ebnf$3", "symbols": ["CHANGES$ebnf$3", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "CHANGES", "symbols": ["CATEGORY", "CHANGES$ebnf$1", (lexer.has("COLON") ? {type: "COLON"} : COLON), "CHANGES$ebnf$2", "ENTRIES", "CHANGES$ebnf$3", "CHANGES"], "postprocess": function(d) { return d[0] + d[4] + d[6]; }},
    {"name": "CHANGES", "symbols": []},
    {"name": "HEADER$ebnf$1", "symbols": []},
    {"name": "HEADER$ebnf$1", "symbols": ["HEADER$ebnf$1", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "HEADER$ebnf$2", "symbols": []},
    {"name": "HEADER$ebnf$2", "symbols": ["HEADER$ebnf$2", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "HEADER$ebnf$3", "symbols": []},
    {"name": "HEADER$ebnf$3", "symbols": ["HEADER$ebnf$3", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "HEADER", "symbols": [(lexer.has("HASH") ? {type: "HASH"} : HASH), (lexer.has("HASH") ? {type: "HASH"} : HASH), "HEADER$ebnf$1", (lexer.has("VERSION") ? {type: "VERSION"} : VERSION), "HEADER$ebnf$2", "DATE_REL", "HEADER$ebnf$3"], "postprocess": function(d) { return " HEADER--" + d[3] + " " + d[5];}},
    {"name": "DATE_REL$ebnf$1", "symbols": []},
    {"name": "DATE_REL$ebnf$1", "symbols": ["DATE_REL$ebnf$1", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "DATE_REL$ebnf$2", "symbols": []},
    {"name": "DATE_REL$ebnf$2", "symbols": ["DATE_REL$ebnf$2", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "DATE_REL", "symbols": [(lexer.has("PAR_L") ? {type: "PAR_L"} : PAR_L), "DATE_REL$ebnf$1", "DATE", "DATE_REL$ebnf$2", (lexer.has("PAR_R") ? {type: "PAR_R"} : PAR_R)], "postprocess": function(d) { return d[2];}},
    {"name": "ENTRIES$ebnf$1", "symbols": []},
    {"name": "ENTRIES$ebnf$1", "symbols": ["ENTRIES$ebnf$1", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ENTRIES", "symbols": ["ENTRY", "ENTRIES$ebnf$1", "ENTRIES"], "postprocess": function(d) { return d[0] + d[2];}},
    {"name": "ENTRIES", "symbols": []},
    {"name": "ENTRY$ebnf$1", "symbols": []},
    {"name": "ENTRY$ebnf$1", "symbols": ["ENTRY$ebnf$1", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ENTRY", "symbols": [(lexer.has("DESCRPT") ? {type: "DESCRPT"} : DESCRPT), "ENTRY$ebnf$1", (lexer.has("PR") ? {type: "PR"} : PR)], "postprocess": function(d) { return " ENTRY--" + d[0] + " PULL REQ--" + d[2]; }},
    {"name": "DATE", "symbols": [(lexer.has("DATE") ? {type: "DATE"} : DATE)], "postprocess": function(d) { return " DATE--" + d; }},
    {"name": "DATE", "symbols": [(lexer.has("UNRELEASED") ? {type: "UNRELEASED"} : UNRELEASED)], "postprocess": function(d) { return d; }},
    {"name": "CATEGORY", "symbols": [(lexer.has("CATEGORY") ? {type: "CATEGORY"} : CATEGORY)], "postprocess": function(d) { return " CATEGORY--" + d; }},
    {"name": "WS", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS)], "postprocess": function(d) { return null; }}
]
  , ParserStart: "MAIN"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
