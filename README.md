Angular Bootstrap Show Errors
=============================

This Angular directive intelligently applies the 'has-error' class to show errors in forms that use Bootstrap 3.

Installation
---
With Bower

    bower install angular-bootstrap-show-errors

Or Manually

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

Force Validity Check
---
By default this directive doesn't check the validity until the user tabs off the input element. However, there are times you want to show invalid form elements even if the user has not tabbed off. (e.g. before saving the form)

To force validity check, set `showErrorsCheckValidity` to true on the form control

```html
<form name="userForm">
  <div class="form-group" show-errors>
    <input type="text" name="firstName" ng-model="firstName" ng-required />
  </div>
  <input type="submit" ng-click="save()" />
</form>
```

```javascript
$scope.save = function() {
  $scope.userForm.showErrorsCheckValidity = true
  
  if ($scope.userForm.$valid) {
    // save the user
  }
}
```

Reset Validity
---
If you have functionality to reset your form, you can set `showErrorsReset` to true to remove any errors on the form elements.

```html
<form name="userForm">
  <div class="form-group" show-errors>
    <input type="text" name="firstName" ng-model="firstName" ng-required />
  </div>
  <a href="#" ng-click="reset()">Reset</a>
</form>
```

```javascript
$scope.reset = function() {
  $scope.userForm.showErrorsReset = true
}
```
    
