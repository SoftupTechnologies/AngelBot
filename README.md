# ~~CH~~<strong style="color: #0095ff">Angel</strong>~~OG~~ <strong style="color: #0095ff">Bot</strong>

This is work in progress. 🤖

The purpose of this project is to provide an easy way to read changelogs.
After a deployment, the changelog is automatically sent to a AWS lambda function (dealer-write) which parses and then stores it in a dynamoDB table.
Another lambda (dealer-read) does the work of notifying that the slack slash command was reveived which is then pushed as a AWS SNS. The SNS invokes the interpreting lambda (angelbot), which after understanding the slash command, reads the changelog table and lastly sends the asked information to the slack channel.

### Posting API
* Install npm packages
* Compile nearley file to js every time you make changes:
`npm run convert`
* Or type `npm run watch` to let the compilation run automatically when changes to grammar.ne are made
* type in your terminal: 
`npm run start`
