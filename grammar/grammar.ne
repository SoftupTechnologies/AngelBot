@{%
const moo = require('moo')

const lexer = moo.compile({
    VERSION: {match: /[0-9]?[0-9]\.[0-9]*\.[0-9]*/},
    DATE: {match: /[0-9][0-9][0-9][0-9]?[-/.][0-1][0-9]?[-/.][0-3][0-9]/},
    UNRELEASED : {match: /[Uu]nreleased/},
    CATEGORY: ["BREAKING CHANGES", "NOTES", "FEATURES", ,"ENHANCEMENTS", "BUG FIXES", "IMPROVEMENTS"],
    PR: {match: /\[[PR#,0-9 ]+\]/, value: s => s.replace(/[\[\]PR#,]/gi, "")},
    DESCRPT: {match: /\*[\w\(\)\`\´ ]+/, value: s => s.slice(2, -1)},
    PAR_L: '(',
    PAR_R: ')',
    COLON: ':',
    ASTERISK: '*',
    HASH: '#',
    WS: {
      match: /\s+/,
      lineBreaks: true
    },
});

%}

@lexer lexer

MAIN -> WS:* REST WS:*                                              {% function(d) { return {changelog:d[1]}; } %}
REST -> FIRST WS:* REST                                             {% function(d) { return [d[0], ... d[2]]; } %}
        | null

FIRST -> HEADER WS:* CHANGES                                        {% function(d) { return Object.assign(d[0],{changes:d[2]}); } %}

CHANGES -> CATEGORY_ENTRIES WS:* CHANGES                            {% function(d) { return [d[0], ...d[2]]; } %}
          | null

CATEGORY_ENTRIES -> %CATEGORY WS:* %COLON WS:* ENTRIES              {% function(d) { return {[d[0]]: [...d[4]]}; } %}              


HEADER -> %HASH %HASH WS:* %VERSION WS:* DATE_REL WS:*              {% function(d) { return {version:d[3].toString(), date:d[5].toString()};} %}
DATE_REL -> %PAR_L WS:* DATE WS:* %PAR_R                            {% function(d) { return d[2];} %}

ENTRIES -> ENTRY WS:* ENTRIES                                       {% function(d) { return [d[0], ...d[2]];} %}
            | null

ENTRY -> %DESCRPT WS:* %PR                                          {% function(d) { return {description:d[0].toString(), pr:d[2].toString()}; } %}

DATE -> %DATE                                                       {% function(d) { return new Date (d[0]); } %}
      | %UNRELEASED                                                 {% function(d) { return d[0]; } %}


WS -> %WS                                                           {% function(d) { return null; } %}
