const nearley = require("nearley");
const grammar = require("./grammar/grammar.js");

module.exports = function parseInput(textInput) {
    if (textInput.length) {
        try {
            const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
            parser.feed(textInput);
            if (!parser.results[0]) {
                throw new Error("Not complete!");
            }
            console.log(parser.results[0]);
            return (parser.results[0]).join('');
        } catch (e) {
            return ("Input is not well formed! " + e);
        }
    } else {
        return null;
    }
};