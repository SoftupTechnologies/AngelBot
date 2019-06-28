# ~~ch~~<strong style="color: #0095ff">ANGEL</strong>~~og~~ <strong style="color: #0095ff">BOT</strong>

This is a POC of a parser needed to read changelog files and prepare them for storage in a database.

### example API call:
`curl -X POST http://localhost:5000/api/v1/parse -d content="## 1.0.0  (31.01.2019)"`

### response: 
```
[{
	version: {
		type: 'VERSION',
		value: '1.0.0',
		text: '1.0.0',
		toString: [Function: tokenToString],
		offset: 3,
		lineBreaks: 0,
		line: 1,
		col: 4
	},
	date: {
		type: 'DATE',
		value: '31.01.2019',
		text: '31.01.2019',
		toString: [Function: tokenToString],
		offset: 11,
		lineBreaks: 0,
		line: 1,
		col: 12
	}
}]
```
### Info
* Install npm packages
* Install nearley js on your machine globally:
`sudo npm install -g nearley`
* Compile nearley file to js every time you make changes:
`nearleyc grammar.ne -o grammar.js`
* type in your terminal: 
`npm run start`
