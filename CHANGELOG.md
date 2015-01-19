### 2.3.0

* Bug Fixes
  * reverted the commit in v2.2.0 that no longer required inputs to have the form-control class. This broke select boxes.

### 2.2.0

* Enhancements
  * Added option to skip the form group check. Thanks @lukaselmer
  * Allow input-group instead of form-group class. Thanks @morgenes
  * Works with inputs without the form-control class (helps it work with radio and checkbox controls). Thanks @Kheldar

### 2.1.0

* Enhancements
  * Using `$interpolate` to retrieve the name of the input element. This allows the directive to work with interpolated form names. Thanks @cherrydev and @Templarian

### 2.0.0

* Breaking Changes
  * Added a more specific selector query for the input element. The input element must now also have the 'form-control' class associated with it. Thanks @martindederer

* Enhancements
  * Added `trigger` option to provide a custom trigger to validate the value. By default the trigger is the `blur` event. Thanks @Templarian

### 1.1.0

* Enhancements
  * Added `showSuccess` option

* Bug Fixes
  * Does not throw an undefined error when the form is dynamically created. Thanks @murphyalexandre

### 1.0.4

* Bug Fixes
  * Using inline array notation to allow the js file to be minified

### 1.0.3

* Bug Fixes
  * Fixed edge case where the error class was not removed correctly after manually checking validation.

### 1.0.2

* refactorings
  * checking if name attribute exists in the link function instead of the compile function
