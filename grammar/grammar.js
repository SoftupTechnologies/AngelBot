// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require('moo')

const lexer = moo.compile({
    DATE: {match: /[0-3][0-9]\.[0-1][0-9]\.[0-9][0-9][0-9][0-9]/},
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
    VERSION: {match: /[0-9]:*\.[0-9]:*\.[0-9]:*/},
    WS: {
      match: /[\s]+/,
      lineBreaks: true
    },

    VARIABLE: /[\w]+/,
});

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "MAIN", "symbols": ["INPUT"]},
    {"name": "INPUT$ebnf$1", "symbols": []},
    {"name": "INPUT$ebnf$1", "symbols": ["INPUT$ebnf$1", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "INPUT$ebnf$2", "symbols": ["WS"]},
    {"name": "INPUT$ebnf$2", "symbols": ["INPUT$ebnf$2", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "INPUT", "symbols": ["INPUT$ebnf$1", "HEAD", "INPUT$ebnf$2", "TAIL"], "postprocess": function(d) { return d[1]; }},
    {"name": "HEAD$ebnf$1", "symbols": []},
    {"name": "HEAD$ebnf$1", "symbols": ["HEAD$ebnf$1", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "HEAD$ebnf$2", "symbols": ["WS"]},
    {"name": "HEAD$ebnf$2", "symbols": ["HEAD$ebnf$2", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "HEAD$ebnf$3", "symbols": []},
    {"name": "HEAD$ebnf$3", "symbols": ["HEAD$ebnf$3", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "HEAD$ebnf$4", "symbols": []},
    {"name": "HEAD$ebnf$4", "symbols": ["HEAD$ebnf$4", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "HEAD", "symbols": ["HEAD$ebnf$1", "HASH", "HASH", "HEAD$ebnf$2", "VERSION", "HEAD$ebnf$3", "DATE", "HEAD$ebnf$4"], "postprocess": (d) => (Object.assign(d[4], d[6]))},
    {"name": "DATE$ebnf$1", "symbols": []},
    {"name": "DATE$ebnf$1", "symbols": ["DATE$ebnf$1", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "DATE$ebnf$2", "symbols": []},
    {"name": "DATE$ebnf$2", "symbols": ["DATE$ebnf$2", "WS"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "DATE", "symbols": ["PAR_L", "DATE$ebnf$1", (lexer.has("DATE") ? {type: "DATE"} : DATE), "DATE$ebnf$2", "PAR_R"], "postprocess": (d) => ({date: d[2]})},
    {"name": "TAIL$ebnf$1", "symbols": []},
    {"name": "TAIL$ebnf$1", "symbols": ["TAIL$ebnf$1", /[.]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "TAIL", "symbols": ["TAIL$ebnf$1"], "postprocess": function(d) { return null; }},
    {"name": "PAR_L", "symbols": [(lexer.has("PAR_L") ? {type: "PAR_L"} : PAR_L)], "postprocess": function(d) { return null; }},
    {"name": "PAR_R", "symbols": [(lexer.has("PAR_R") ? {type: "PAR_R"} : PAR_R)], "postprocess": function(d) { return null; }},
    {"name": "VERSION", "symbols": [(lexer.has("VERSION") ? {type: "VERSION"} : VERSION)], "postprocess": (d) => ({version: d[0]})},
    {"name": "HASH", "symbols": [(lexer.has("HASH") ? {type: "HASH"} : HASH)], "postprocess": function(d) { return null; }},
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
