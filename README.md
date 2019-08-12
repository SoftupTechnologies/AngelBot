# ~~CH~~<strong style="color: #0095ff">Angel</strong>~~OG~~ <strong style="color: #0095ff">Bot</strong>

This is work in progress. 🤖

## API calls:
#### Get all changelogs or get a specific changelog version by specifying the version in the request
```
GET /api/v1/changelog [version=1.0.0](optional)
```
#### Store a new changelog, the one on the top or store all with `store_all=true`
```
POST /api/v1/changelog 'content=changelog' [store_all=true](optional)
```

#### To get the all changes from a category including the version e.g. 'BUG FIXES'
```
GET /api/v1/changelog/category_changes 'category=BUG FIXES'
```
#### Initialize the changelogs table

```
POST /api/v1/init
```


### Info
* Install npm packages
* Compile nearley file to js every time you make changes:
`npm run convert`
* Or type `npm run watch` to let the compilation run automatically when changes to grammar.ne are made
* type in your terminal: 
`npm run start`
