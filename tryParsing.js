const nearley = require("nearley");
const grammar = require("./grammar/grammar.js");
// Load the full build.
var _ = require('lodash');

module.exports = function parseInput(textInput) {
    if (textInput.length) {
        try {
            const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
            parser.feed(textInput);
            if (!parser.results[0]) {
                throw new Error("Not complete!");
            }
            let returnedResult = parser.results[0];
            console.log(JSON.stringify(returnedResult));
            return (returnedResult);
        } catch (e) {
            return ("Input is not well formed! " + e);
        }
    } else {
        return null;
    }
};
