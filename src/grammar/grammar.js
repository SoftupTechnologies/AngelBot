// Generated automatically by nearley, version 2.19.3
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require('moo')

const lexer = moo.compile({
    VERSION: {match: /[0-9]?[0-9]\.[0-9]*\.[0-9]*/},
    DATE: {match: /[0-9][0-9][0-9][0-9]?[-/.][0-1][0-9]?[-/.][0-3][0-9]/},
    UNRELEASED : {match: /[Uu]nreleased/},
    CATEGORY: ["BREAKING CHANGES", "NOTES", "FEATURES", ,"ENHANCEMENTS", "BUG FIXES", "IMPROVEMENTS"],
    PR: {match: /\[[PR#,0-9 ]+\]/, value: s => s.replace(/[\[\]PR#,]*/gi, "")},
    DESCRPT: {match: /\*[\w\(\)`´\.,:'\- ]+/, value: s => s.replace(/^[\* ]*/gi, "")},
    PAR_L: '(',
    PAR_R: ')',
    COLON: ':',
    HASH: '#',
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
    {"name": "MAIN", "symbols": ["MAIN$ebnf$1", "REST", "MAIN$ebnf$2"], "postprocess": function(d) { return {changelog:d[1]}; }},
    {"name": "REST", "symbols": ["FIRST", "REST"], "postprocess": function(d) { return [d[0], ...d[1]]; }},
    {"name": "REST", "symbols": []},
    {"name": "FIRST$ebnf$1", "symbols": []},
    {"name": "FIRST$ebnf$1", "symbols": ["FIRST$ebnf$1", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "FIRST", "symbols": ["HEADER", "FIRST$ebnf$1", "CHANGES"], "postprocess": function(d) { return Object.assign(d[0], ...d[2]); }},
    {"name": "CHANGES", "symbols": ["CATEGORY_ENTRIES", "CHANGES"], "postprocess": function(d) { return [d[0], ...d[1]]; }},
    {"name": "CHANGES", "symbols": []},
    {"name": "HEADER$ebnf$1", "symbols": []},
    {"name": "HEADER$ebnf$1", "symbols": ["HEADER$ebnf$1", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "HEADER$ebnf$2", "symbols": []},
    {"name": "HEADER$ebnf$2", "symbols": ["HEADER$ebnf$2", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "HEADER", "symbols": [(lexer.has("HASH") ? {type: "HASH"} : HASH), (lexer.has("HASH") ? {type: "HASH"} : HASH), "HEADER$ebnf$1", (lexer.has("VERSION") ? {type: "VERSION"} : VERSION), "HEADER$ebnf$2", "DATE_REL"], "postprocess": function(d) { return {version:d[3].toString(), date:d[5].toString()};}},
    {"name": "CATEGORY_ENTRIES$ebnf$1", "symbols": []},
    {"name": "CATEGORY_ENTRIES$ebnf$1", "symbols": ["CATEGORY_ENTRIES$ebnf$1", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "CATEGORY_ENTRIES$ebnf$2", "symbols": []},
    {"name": "CATEGORY_ENTRIES$ebnf$2", "symbols": ["CATEGORY_ENTRIES$ebnf$2", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "CATEGORY_ENTRIES", "symbols": [(lexer.has("CATEGORY") ? {type: "CATEGORY"} : CATEGORY), "CATEGORY_ENTRIES$ebnf$1", "COLON", "CATEGORY_ENTRIES$ebnf$2", "ENTRIES"], "postprocess": function(d) { return {[d[0]]: [...d[4]]}; }},
    {"name": "ENTRIES$ebnf$1", "symbols": []},
    {"name": "ENTRIES$ebnf$1", "symbols": ["ENTRIES$ebnf$1", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ENTRIES", "symbols": ["ENTRY", "ENTRIES$ebnf$1", "ENTRIES"], "postprocess": function(d) { return [d[0], ...d[2]];}},
    {"name": "ENTRIES", "symbols": []},
    {"name": "ENTRY", "symbols": [(lexer.has("DESCRPT") ? {type: "DESCRPT"} : DESCRPT), (lexer.has("PR") ? {type: "PR"} : PR)], "postprocess": function(d) { return {description:d[0].toString().trim(), pr:d[1].toString()}; }},
    {"name": "ENTRY", "symbols": [(lexer.has("DESCRPT") ? {type: "DESCRPT"} : DESCRPT)], "postprocess": function(d) { return {description:d[0].toString().trim()}; }},
    {"name": "DATE", "symbols": [(lexer.has("DATE") ? {type: "DATE"} : DATE)], "postprocess": function(d) { return (new Date (d[0])).toISOString().split('T')[0]; }},
    {"name": "DATE", "symbols": [(lexer.has("UNRELEASED") ? {type: "UNRELEASED"} : UNRELEASED)], "postprocess": function(d) { return d[0]; }},
    {"name": "COLON", "symbols": [(lexer.has("COLON") ? {type: "COLON"} : COLON)]},
    {"name": "COLON", "symbols": []},
    {"name": "DATE_REL$ebnf$1", "symbols": []},
    {"name": "DATE_REL$ebnf$1", "symbols": ["DATE_REL$ebnf$1", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "DATE_REL$ebnf$2", "symbols": []},
    {"name": "DATE_REL$ebnf$2", "symbols": ["DATE_REL$ebnf$2", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "DATE_REL", "symbols": [(lexer.has("PAR_L") ? {type: "PAR_L"} : PAR_L), "DATE_REL$ebnf$1", "DATE", "DATE_REL$ebnf$2", (lexer.has("PAR_R") ? {type: "PAR_R"} : PAR_R)], "postprocess": function(d) { return d[2];}},
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
