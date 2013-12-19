Angular Bootstrap Show Errors
=============================

This Angular directive intelligently applies the 'has-error' class to show errors in forms that use Bootstrap 3.

Installation
---
With Bower

    bower install angular-bootstrap-show-errors

Manually

Copy the `src/showErrors.js` or `src/showErrors.min.js` file into your project.

Quick Start
---
1. Include the `ui.bootstrap.showErrors` module in your Angular app
2. Add the `show-errors` attribute on the form div element that contains the `form-group` class

```html
    <form name="userForm">
      <div class="form-group" show-errors>
        <input type="text" name="firstName" ng-model="firstName" ng-required />
      </div>
    </form>
```
