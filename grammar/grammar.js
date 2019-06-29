// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require('moo')

const lexer = moo.compile({
    VERSION: {match: /[0-9]:*\.[0-9]:*\.[0-9]:*/},
    DATE: {match: /[0-3][0-9]\.[0-1][0-9]\.[0-9][0-9][0-9][0-9]/},
    UNRELEASED : {match: /[Uu]nreleased/},
    CATEGORY: ["BREAKING CHANGES", "NOTES", "FEATURES", "IMPROVEMENTS","ENHANCEMENTS", "BUG FIXES"],
    ENTRY: {match: /\*[^*]+/},
    PR: {match: /\[PR#[0-9]+\]/},
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
    {"name": "MAIN", "symbols": ["MAIN$ebnf$1", "INPUT", "MAIN$ebnf$2"]},
    {"name": "INPUT$ebnf$1", "symbols": []},
    {"name": "INPUT$ebnf$1", "symbols": ["INPUT$ebnf$1", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "INPUT$ebnf$2", "symbols": []},
    {"name": "INPUT$ebnf$2", "symbols": ["INPUT$ebnf$2", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "INPUT$ebnf$3", "symbols": []},
    {"name": "INPUT$ebnf$3", "symbols": ["INPUT$ebnf$3", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "INPUT", "symbols": ["INPUT$ebnf$1", "FIRST", "INPUT$ebnf$2", "REST", "INPUT$ebnf$3"]},
    {"name": "REST$ebnf$1", "symbols": []},
    {"name": "REST$ebnf$1", "symbols": ["REST$ebnf$1", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "REST$ebnf$2", "symbols": []},
    {"name": "REST$ebnf$2", "symbols": ["REST$ebnf$2", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "REST$ebnf$3", "symbols": []},
    {"name": "REST$ebnf$3", "symbols": ["REST$ebnf$3", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "REST", "symbols": ["REST$ebnf$1", "FIRST", "REST$ebnf$2", "REST", "REST$ebnf$3"]},
    {"name": "REST", "symbols": []},
    {"name": "FIRST$ebnf$1", "symbols": []},
    {"name": "FIRST$ebnf$1", "symbols": ["FIRST$ebnf$1", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "FIRST", "symbols": ["HEADER", "FIRST$ebnf$1", "CHANGES"]},
    {"name": "HEADER$ebnf$1", "symbols": []},
    {"name": "HEADER$ebnf$1", "symbols": ["HEADER$ebnf$1", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "HEADER$ebnf$2", "symbols": []},
    {"name": "HEADER$ebnf$2", "symbols": ["HEADER$ebnf$2", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "HEADER$ebnf$3", "symbols": []},
    {"name": "HEADER$ebnf$3", "symbols": ["HEADER$ebnf$3", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "HEADER$ebnf$4", "symbols": []},
    {"name": "HEADER$ebnf$4", "symbols": ["HEADER$ebnf$4", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "HEADER", "symbols": ["HEADER$ebnf$1", "HASH", "HASH", "HEADER$ebnf$2", "VERSION", "HEADER$ebnf$3", "DATE_REL", "HEADER$ebnf$4"]},
    {"name": "DATE_REL$ebnf$1", "symbols": []},
    {"name": "DATE_REL$ebnf$1", "symbols": ["DATE_REL$ebnf$1", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "DATE_REL$ebnf$2", "symbols": []},
    {"name": "DATE_REL$ebnf$2", "symbols": ["DATE_REL$ebnf$2", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "DATE_REL", "symbols": [(lexer.has("PAR_L") ? {type: "PAR_L"} : PAR_L), "DATE_REL$ebnf$1", "DATE", "DATE_REL$ebnf$2", (lexer.has("PAR_R") ? {type: "PAR_R"} : PAR_R)]},
    {"name": "CHANGES$ebnf$1", "symbols": []},
    {"name": "CHANGES$ebnf$1", "symbols": ["CHANGES$ebnf$1", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "CHANGES$ebnf$2", "symbols": []},
    {"name": "CHANGES$ebnf$2", "symbols": ["CHANGES$ebnf$2", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "CHANGES$ebnf$3", "symbols": []},
    {"name": "CHANGES$ebnf$3", "symbols": ["CHANGES$ebnf$3", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "CHANGES$ebnf$4", "symbols": []},
    {"name": "CHANGES$ebnf$4", "symbols": ["CHANGES$ebnf$4", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "CHANGES", "symbols": ["CHANGES$ebnf$1", "CATEGORY", "CHANGES$ebnf$2", "COLON", "CHANGES$ebnf$3", "ENTRIES", "CHANGES$ebnf$4", "CHANGES"]},
    {"name": "CHANGES", "symbols": []},
    {"name": "ENTRIES$ebnf$1", "symbols": []},
    {"name": "ENTRIES$ebnf$1", "symbols": ["ENTRIES$ebnf$1", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ENTRIES$ebnf$2", "symbols": []},
    {"name": "ENTRIES$ebnf$2", "symbols": ["ENTRIES$ebnf$2", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ENTRIES", "symbols": ["ENTRIES$ebnf$1", "ENTRY", "ENTRIES$ebnf$2", "ENTRIES"]},
    {"name": "ENTRIES", "symbols": []},
    {"name": "CATEGORY", "symbols": [(lexer.has("CATEGORY") ? {type: "CATEGORY"} : CATEGORY)]},
    {"name": "ASTERISK", "symbols": [(lexer.has("ASTERISK") ? {type: "ASTERISK"} : ASTERISK)]},
    {"name": "ENTRY$ebnf$1", "symbols": []},
    {"name": "ENTRY$ebnf$1", "symbols": ["ENTRY$ebnf$1", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ENTRY$ebnf$2", "symbols": []},
    {"name": "ENTRY$ebnf$2", "symbols": ["ENTRY$ebnf$2", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ENTRY$ebnf$3", "symbols": []},
    {"name": "ENTRY$ebnf$3", "symbols": ["ENTRY$ebnf$3", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ENTRY", "symbols": ["ENTRY$ebnf$1", (lexer.has("ENTRY") ? {type: "ENTRY"} : ENTRY), "ENTRY$ebnf$2", "PR", "ENTRY$ebnf$3"]},
    {"name": "PR", "symbols": [(lexer.has("PR") ? {type: "PR"} : PR)]},
    {"name": "PR", "symbols": []},
    {"name": "COLON", "symbols": [(lexer.has("COLON") ? {type: "COLON"} : COLON)]},
    {"name": "VERSION", "symbols": [(lexer.has("VERSION") ? {type: "VERSION"} : VERSION)]},
    {"name": "DATE", "symbols": [(lexer.has("DATE") ? {type: "DATE"} : DATE)]},
    {"name": "DATE", "symbols": [(lexer.has("UNRELEASED") ? {type: "UNRELEASED"} : UNRELEASED)]},
    {"name": "HASH", "symbols": [(lexer.has("HASH") ? {type: "HASH"} : HASH)]},
    {"name": "WS", "symbols": [(lexer.has("WS") ? {type: "WS"} : WS)]}
]
  , ParserStart: "MAIN"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
