# ~~CH~~<strong style="color: #0095ff">Angel</strong>~~OG~~ <strong style="color: #0095ff">Bot</strong>

This is work in progress. 🤖

### API calls:
`
GET /api/v1/changelog
`
to get all changelogs
 
`
POST /api/v1/changelog content=''
`
to store a new changelog


`
GET /api/v1/category_changes category=''
`
to get the all changes from a category including the version for each e.g. 'BUG FIXES'

`
POST /api/v1/init
`
to initialize the changelogs table

### Info
* Install npm packages
* Compile nearley file to js every time you make changes:
`npm run convert`
* type in your terminal: 
`npm run start`
