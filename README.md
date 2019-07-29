# ~~CH~~<strong style="color: #0095ff">Angel</strong>~~OG~~ <strong style="color: #0095ff">Bot</strong>

This is work in progress. 🤖

## API calls:
### Get all changelogs
```
curl --request GET \
  --url http://localhost:5000/api/v1/changelog
```
### Store a new changelog
```
curl --request POST \
  --url http://localhost:5000/api/v1/changelog \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data 'content= changelog'
```

### To get the all changes from a category including the version for each e.g. 'BUG FIXES'
```
curl --request GET \
  --url http://localhost:5000/api/v1/changelog/category_changes \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data 'category=BUG FIXES'
```
### Initialize the changelogs table

```
curl --request POST \
  --url http://localhost:5000/api/v1/init
```


### Info
* Install npm packages
* Compile nearley file to js every time you make changes:
`npm run convert`
* type in your terminal: 
`npm run start`
