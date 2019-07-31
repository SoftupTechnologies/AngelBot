@{%
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

%}

@lexer lexer

MAIN -> WS:* REST WS:*                                              {% function(d) { return {changelog:d[1]}; } %}

REST -> FIRST REST                                                  {% function(d) { return [d[0], ...d[1]]; } %}
        | null

FIRST -> HEADER WS:* CHANGES                                        {% function(d) { return Object.assign(d[0], ...d[2]); } %}

CHANGES -> CATEGORY_ENTRIES CHANGES                                 {% function(d) { return [d[0], ...d[1]]; } %}
          | null

HEADER -> %HASH %HASH WS:* %VERSION WS:* DATE_REL                   {% function(d) { return {version:d[3].toString(), date:d[5].toString()};} %}

CATEGORY_ENTRIES -> %CATEGORY WS:* COLON WS:* ENTRIES               {% function(d) { return {[d[0]]: [...d[4]]}; } %}

ENTRIES -> ENTRY WS:* ENTRIES                                       {% function(d) { return [d[0], ...d[2]];} %}
          | null

ENTRY -> %DESCRPT %PR                                               {% function(d) { return {description:d[0].toString().trim(), pr:d[1].toString()}; } %}
        | %DESCRPT                                                  {% function(d) { return {description:d[0].toString().trim()}; } %}

DATE -> %DATE                                                       {% function(d) { return (new Date (d[0])).toDateString(); } %}
      | %UNRELEASED                                                 {% function(d) { return d[0]; } %}

COLON -> %COLON
        | null

DATE_REL -> %PAR_L WS:* DATE WS:* %PAR_R                            {% function(d) { return d[2];} %}

WS -> %WS                                                           {% function(d) { return null; } %}