(function () {
  angular.module('ui.bootstrap.showErrors', []).directive('showErrors', function () {
    var linkFn;
    linkFn = function (scope, el, attrs, formCtrl) {
      var inputEl, inputName, inputNgEl;
      inputEl = el[0].querySelector('[name]');
      inputNgEl = angular.element(inputEl);
      inputName = inputNgEl.attr('name');
      return inputNgEl.bind('blur', function () {
        if (formCtrl[inputName].$invalid) {
          return el.addClass('has-error');
        }
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
  });
}.call(this));