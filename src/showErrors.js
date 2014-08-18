(function () {
  angular.module('ui.bootstrap.showErrors', []).directive('showErrors', [
    '$timeout',
    function ($timeout) {
      var linkFn;
      linkFn = function (scope, el, attrs, formCtrl) {
        var blurred, inputEl, inputName, inputNgEl;
        blurred = false;
        inputEl = el[0].querySelector('[name]');
        inputNgEl = angular.element(inputEl);
        inputName = inputNgEl.attr('name');
        if (!inputName) {
          throw 'show-errors element has no child input elements with a \'name\' attribute';
        }
        inputNgEl.bind('blur', function () {
          blurred = true;
          el.toggleClass('has-error', formCtrl[inputName].$invalid);
          return el.toggleClass('has-success', formCtrl[inputName].$valid);
        });
        scope.$watch(function () {
          return formCtrl[inputName].$invalid;
        }, function (invalid) {
          if (!blurred && invalid) {
            return;
          }
          return el.toggleClass('has-error', invalid);
        });
        scope.$watch(function () {
          return formCtrl[inputName].$valid;
        }, function (valid) {
          if (!blurred && valid) {
            return;
          }
          return el.toggleClass('has-success', valid);
        });
        scope.$on('show-errors-check-validity', function () {
          el.toggleClass('has-error', formCtrl[inputName].$invalid);
          return el.toggleClass('has-success', formCtrl[inputName].$valid);
        });
        return scope.$on('show-errors-reset', function () {
          return $timeout(function () {
            el.removeClass('has-error');
            el.removeClass('has-success');
            return blurred = false;
          }, 0, false);
        });
      };
      return {
        restrict: 'A',
        require: '^form',
        compile: function (elem, attrs) {
          if (!elem.hasClass('form-group')) {
            throw 'show-errors element does not have the \'form-group\' class';
          }
          return linkFn;
        }
      };
    }
  ]);
}.call(this));