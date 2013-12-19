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
        inputNgEl.bind('blur', function () {
          blurred = true;
          return el.toggleClass('has-error', formCtrl[inputName].$invalid);
        });
        scope.$watch(function () {
          return formCtrl[inputName].$invalid;
        }, function (newVal, oldVal) {
          if (!blurred) {
            return;
          }
          return el.toggleClass('has-error', newVal);
        });
        scope.$watch(function () {
          return scope.showErrorsCheckValidity;
        }, function (newVal) {
          if (!newVal) {
            return;
          }
          el.toggleClass('has-error', formCtrl[inputName].$invalid);
          return scope.showErrorsCheckValidity = false;
        });
        return scope.$watch(function () {
          return scope.showErrorsReset;
        }, function (newVal) {
          if (!newVal) {
            return;
          }
          return $timeout(function () {
            el.removeClass('has-error');
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
          if (elem[0].querySelector('input[name]') == null) {
            throw 'show-errors element has no child input elements with a \'name\' attribute';
          }
          return linkFn;
        }
      };
    }
  ]);
}.call(this));