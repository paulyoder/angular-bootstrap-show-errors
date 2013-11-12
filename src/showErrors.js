(function () {
  angular.module('ui.bootstrap.showErrors', []).directive('showErrors', function () {
    var linkFn;
    linkFn = function (scope, elem, attrs, ctrl) {
      return elem.addClass('has-error');
    };
    return {
      restrict: 'A',
      require: '^form',
      compile: function (elem, attrs) {
        if (!elem.hasClass('form-group')) {
          throw 'show-errors element does not have the \'form-group\' class';
        }
        if (elem[0].querySelector('input[name]') == null) {
          throw 'show-errors element has no input elements with a \'name\' attribute';
        }
        return linkFn;
      }
    };
  });
}.call(this));