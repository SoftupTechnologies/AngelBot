# ~~CH~~<strong style="color: #0095ff">Angel</strong>~~OG~~ <strong style="color: #0095ff">Bot</strong>

This is work on progress. 🤖

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
                "description":"fix a problem with router not responding to back button",
                "pr":"30466"
              },
              {
                "description":"IE 11 bug can break URL unification when comparing objects",
                "pr":"30422"
              },
              {
                "description":"add ability to watch for AngularJS URL updates through onUrlChange hook",
                "pr":"30433"
              }
            ]
          },
          {
            "BREAKING CHANGES":[
              {
                "description":"Resource `network_port` has been removed"
              }
            ]
          },
          {
            "FEATURES":[
              {
                "description":"add ability to watch for AngularJS URL updates through onUrlChange hook",
                "pr":"3045115"
              }
            ]
          },
          {
            "IMPROVEMENTS":[
              {
                "description":"Add `ATTRIBUTE` argument (support X new functionality)",
                "pr":"30411"
              },
              {
                "description":"use shared DomElementSchemaRegistry instance",
                "pr":"30406 30433"
              }
            ]
          }
        ]
      },
      {
        "version":"0.2.0",
        "date":"Tue Jun 20 2017 00:00:00 GMT+0200 (Central European Summer Time)",
        "changes":[
          {
            "FEATURES":[
              {
                "description":"stricter types for SlicePipe",
                "pr":"30451"
              },
              {
                "description":"Implement definitionAndBoundSpan",
                "pr":"30401"
              }
            ]
          }
        ]
      },
      {
        "version":"0.1.12",
        "date":"Mon Jun 20 2016 02:00:00 GMT+0200 (Central European Summer Time)",
        "changes":[
          {
            "FEATURES":[
              {
                "description":"blablabla",
                "pr":"30451"
              },
              {
                "description":"Implement definitionAndBoundSpan",
                "pr":"30401"
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
* Compile nearley file to js every time you make changes:
`npm run convert`
* type in your terminal: 
`npm run start`
