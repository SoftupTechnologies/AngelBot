# ~~CH~~<strong style="color: #0095ff">Angel</strong>~~OG~~ <strong style="color: #0095ff">Bot</strong>

This is a POC of a parser needed to read changelog files and prepare them for storage in a database.

### example API call:
`curl -X POST http://localhost:5000/api/v1/parse -d content="content from example_chl.md"`

### response: 
```
{
  "success":"true",
  "message":{
    "changelog":[
      {
        "version":"1.0.0",
        "date":"Unreleased",
        "changes":[
          {
            "BUG FIXES":[
              {
                "description":"* fix a problem with router not responding to back button ",
                "pr":"[PR#30466]"
              },
              {
                "description":"* IE 11 bug can break URL unification when comparing objects ",
                "pr":"[PR#30422]"
              },
              {
                "description":"* add ability to watch for AngularJS URL updates through onUrlChange hook ",
                "pr":"[PR#30433]"
              }
            ]
          },
          {
            "BREAKING CHANGES":[
              {
                "description":"* Resource `network_port` has been removed ",
                "pr":"[PR#30444]"
              }
            ]
          },
          {
            "FEATURES":[
              {
                "description":"* add ability to watch for AngularJS URL updates through onUrlChange hook ",
                "pr":"[PR#30455]"
              }
            ]
          },
          {
            "IMPROVEMENTS":[
              {
                "description":"* Add `ATTRIBUTE` argument (support X new functionality) ",
                "pr":"[PR#30411]"
              },
              {
                "description":"* use shared DomElementSchemaRegistry instance ",
                "pr":"[PR#30406, PR#30433]"
              }
            ]
          }
        ]
      },
      {
        "version":"0.2.0",
        "date":"2017-06-20",
        "changes":[
          {
            "FEATURES":[
              {
                "description":"* stricter types for SlicePipe ",
                "pr":"[PR#30451]"
              },
              {
                "description":"* Implement definitionAndBoundSpan ",
                "pr":"[PR#30401]"
              }
            ]
          }
        ]
      },
      {
        "version":"0.1.12",
        "date":"2016-06-20",
        "changes":[
          {
            "FEATURES":[
              {
                "description":"* blablabla ",
                "pr":"[PR#30451]"
              },
              {
                "description":"* Implement definitionAndBoundSpan ",
                "pr":"[PR#30401]"
              }
            ]
          }
        ]
      }
    ]
  }
}
```
### Info
* Install npm packages
* Install nearley js on your machine globally:
`sudo npm install -g nearley`
* Compile nearley file to js every time you make changes:
`nearleyc grammar.ne -o grammar.js`
* type in your terminal: 
`npm run start`
