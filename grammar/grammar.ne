@{%
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

%}

@lexer lexer

MAIN -> WS:* INPUT WS:*                                             {% function(d) { return d[1]; } %}
INPUT -> WS:* FIRST WS:* REST WS:*                                  {% function(d) { return d[1] + d[3]; } %}

REST -> FIRST WS:* REST                                             {% function(d) { return d[0] + d[2]; } %}
        | null

FIRST -> HEADER WS:* CHANGES                                        {% function(d) { return d[0] + d[2]; } %}

CHANGES -> CATEGORY WS:* %COLON WS:* ENTRIES WS:* CHANGES           {% function(d) { return d[0] + d[4] + d[6]; } %}
            | null

HEADER -> %HASH %HASH WS:* %VERSION WS:* DATE_REL WS:*              {% function(d) { return " HEADER--" + d[3] + " " + d[5];} %}
DATE_REL -> %PAR_L WS:* DATE WS:* %PAR_R                            {% function(d) { return d[2];} %}

ENTRIES -> ENTRY WS:* ENTRIES                                       {% function(d) { return d[0] + d[2];} %}
            | null

ENTRY -> %DESCRPT WS:* %PR                                          {% function(d) { return " ENTRY--" + d[0] + " PULL REQ--" + d[2]; } %}

DATE -> %DATE                                                       {% function(d) { return " DATE--" + d; } %}
      | %UNRELEASED                                                 {% function(d) { return d; } %}

CATEGORY -> %CATEGORY                                               {% function(d) { return " CATEGORY--" + d; } %}

WS -> %WS                                                           {% function(d) { return null; } %}