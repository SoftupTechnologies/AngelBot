## 1.0.0 (Unreleased)

BUG FIXES:


* fix a problem with router not responding to back button [PR#30466] 
* IE 11 bug can break URL unification when comparing objects [PR#30422] 
* add ability to watch for AngularJS URL updates through onUrlChange hook [PR#30433]

BREAKING CHANGES:

* Resource `network_port` has been removed [PR#30444]

FEATURES:

* add ability to watch for AngularJS URL updates through onUrlChange hook [PR#30455]

IMPROVEMENTS:

* Add `ATTRIBUTE` argument (support X new functionality) [PR#30411]
* use shared DomElementSchemaRegistry instance [PR#30406, PR#30433]

## 0.2.0 (2017-06-20)

FEATURES:

* stricter types for SlicePipe [PR#30451]
* Implement definitionAndBoundSpan [PR#30401]