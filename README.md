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
```javascript
angular.module('yourApp', ['ui.bootstrap.showErrors']);
```

2. Add the `show-errors` attribute on the div element that contains the `form-group` class
```html
<form name="userForm">
  <div class="form-group" show-errors>
    <input type="text" name="firstName" ng-model="firstName" ng-required />
  </div>
</form>
```

3. If you want to avoid the extra bottom margin of `form-group`, you can use `input-group`.
```html
<form name="userForm">
  <div class="input-group" show-errors>
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

Show Valid Entries
---
It's also possible to let the user know when they have entered valid values by applying the 'show-success' class that Bootstrap provides. 
You can either apply this globally or on an element by element basis.

##### Globally
The following example shows how to show valid values on every input that uses the showErrors directive.

```javascript
app = angular.module('yourApp', ['ui.bootstrap.showErrors']);
app.config(['showErrorsConfigProvider', function(showErrorsConfigProvider) {
  showErrorsConfigProvider.showSuccess(true);
}]);
```

##### By Input Element
If you only want to show valid values on specific inputs, then you can pass in the `{ showSuccess: true }` option like the example below shows.

```html
<form name="userForm">
  <div class="form-group" show-errors="{ showSuccess: true }">
    <input type="text" name="firstName" ng-model="firstName" ng-required />
  </div>
</form>
```

Skip Form Group Check
---
If your HTML code doesn't have a form-group class, the form group check can be skipped:

```html
<form name="userForm">
<div show-errors="{ skipFormGroupCheck: true }">
<input type="text" name="firstName" ng-model="firstName" ng-required />
</div>
</form>
```

Custom Trigger
---
By default, the validation is not performed until the `blur` event is trigger on the input 
element. However, there are some scenarios where this is not desirable, so it's possible to 
override this with the `trigger` option.

##### By Input Element
```html
<form name="userForm">
  <div class="form-group" show-errors="{ trigger: 'keypress' }">
    <input ng-model="firstName" ng-pattern="/^foo$/" ng-required name="firstName" class="form-control" type="text" />
  </div>
</form>
```

##### Globally
```javascript
app = angular.module('yourApp', ['ui.bootstrap.showErrors']);
app.config(['showErrorsConfigProvider', function(showErrorsConfigProvider) {
  showErrorsConfigProvider.trigger('keypress');
}]);
```
    
## Development

### Install Development Dependencies
Before you begin development, you will need to install the required node modules and bower components. To do
so, open a terminal window in the project directory and run the following commands.
```
npm install
bower install
```

### Compile and Run the Unit Tests
Just type `grunt` in the command line to compile and run the karma unit tests once.

If you want to have grunt watch for any file changes and automatically compile and run the karma 
unit tests, then run the following command:
```
grunt karma:continuous:start watch
```
