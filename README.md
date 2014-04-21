Angular Bootstrap Show Errors
=============================

An Angular directive for Bootstrap 3 that intelligently applies the 'has-error' class to invalid form fields.

See the [Bootstrap Form Validation Done Right in AngularJS](http://blog.yodersolutions.com/bootstrap-form-validation-done-right-in-angularjs?utm_source=github&utm_medium=readme&utm_campaign=code) blog post to read about the benefits of using this directive.

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

Force Validity Check
---
By default this directive doesn't check the validity until the user tabs off the input element. However, there are times you want to show invalid form elements even if the user has not tabbed off. (e.g. before saving the form)

To force the validity check, broadcast the `show-errors-check-validity` event.

#### Example


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
  $scope.$broadcast('show-errors-check-validity');
  
  if ($scope.userForm.$valid) {
    // save the user
  }
}
```

Reset
---
If you have functionality to reset your form, you can broadcast the 'show-errors-reset' event to remove any errors on the form elements.

#### Example

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
  $scope.$broadcast('show-errors-reset');
}
```
    
