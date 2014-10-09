### 2.0.0

* Breaking Changes
  * Added a more specific selector query for the input element. The input element must now also have the 'form-control' class associated with it. Thanks @martindederer

* Enhancements
  * Added `trigger` option to provide a custom trigger to validate the value. By default the trigger is the `blur` event. Thanks @TEmplarian

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
