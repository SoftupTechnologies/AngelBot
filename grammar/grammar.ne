
@{%
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

%}

@lexer lexer

MAIN -> INPUT
INPUT -> WS:* HEAD WS:+ TAIL                        {% function(d) { return d[1]; } %}
HEAD -> WS:* HASH HASH WS:+ VERSION WS:* DATE WS:*  {% (d) => (Object.assign(d[4], d[6])) %}

DATE -> PAR_L WS:* %DATE WS:* PAR_R                 {% (d) => ({date: d[2]}) %}
TAIL -> [.]:*                                       {% function(d) { return null; } %}
PAR_L -> %PAR_L                                     {% function(d) { return null; } %}
PAR_R -> %PAR_R                                     {% function(d) { return null; } %}
VERSION -> %VERSION                                 {% (d) => ({version: d[0]}) %}
HASH -> %HASH                                       {% function(d) { return null; } %}
WS -> %WS                                           {% function(d) { return null; } %}