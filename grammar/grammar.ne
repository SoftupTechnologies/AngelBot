@{%
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

%}

@lexer lexer

MAIN -> WS:* INPUT WS:*
INPUT -> WS:* FIRST WS:* REST WS:*
REST -> WS:* FIRST WS:* REST WS:*
        | null

FIRST -> HEADER WS:* CHANGES
HEADER -> WS:* HASH HASH WS:* VERSION WS:* DATE_REL WS:*
DATE_REL -> %PAR_L WS:* DATE WS:* %PAR_R
CHANGES -> WS:* CATEGORY WS:* COLON WS:* ENTRIES WS:* CHANGES
            | null

ENTRIES -> WS:* ENTRY WS:* ENTRIES
            | null

CATEGORY -> %CATEGORY
ASTERISK -> %ASTERISK
ENTRY -> WS:* %ENTRY WS:* PR WS:*
PR -> %PR
      | null

COLON -> %COLON
VERSION -> %VERSION
DATE -> %DATE | %UNRELEASED
HASH -> %HASH
WS -> %WS