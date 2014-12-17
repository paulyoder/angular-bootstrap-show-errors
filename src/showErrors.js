(function() {
  var showErrorsModule;

  showErrorsModule = angular.module('ui.bootstrap.showErrors', []);

  showErrorsModule.directive('showErrors', [
    '$timeout', 'showErrorsConfig', '$interpolate', function($timeout, showErrorsConfig, $interpolate) {
      var getShowSuccess, getTrigger, linkFn;
      getTrigger = function(options) {
        var trigger;
        trigger = showErrorsConfig.trigger;
        if (options && (options.trigger != null)) {
          trigger = options.trigger;
        }
        return trigger;
      };
      getShowSuccess = function(options) {
        var showSuccess;
        showSuccess = showErrorsConfig.showSuccess;
        if (options && (options.showSuccess != null)) {
          showSuccess = options.showSuccess;
        }
        return showSuccess;
      };
      linkFn = function(scope, el, attrs, formCtrl) {
        var blurred, inputEl, inputEls, inputName, inputNgEl, options, showSuccess, toggleClasses, trigger, _i, _len;
        blurred = false;
        options = scope.$eval(attrs.showErrors);
        showSuccess = getShowSuccess(options);
        trigger = getTrigger(options);
        inputEls = el[0].querySelectorAll(['.form-control[name]', 'input[name][type=radio], input[name][type=checkbox]']);
        if (!(inputEls.length > 0)) {
          throw "show-errors element has no child input elements with a 'name' attribute";
        }
        for (_i = 0, _len = inputEls.length; _i < _len; _i++) {
          inputEl = inputEls[_i];
          inputNgEl = angular.element(inputEl);
          inputName = $interpolate(inputNgEl.attr('name') || '')(scope);
          inputNgEl.bind(trigger, function() {
            blurred = true;
            return toggleClasses(formCtrl[inputName].$invalid);
          });
          scope.$watch(function() {
            return formCtrl[inputName] && formCtrl[inputName].$invalid;
          }, function(invalid) {
            if (!blurred) {
              return;
            }
            return toggleClasses(invalid);
          });
          scope.$on('show-errors-check-validity', function() {
            return toggleClasses(formCtrl[inputName].$invalid);
          });
        }
        scope.$on('show-errors-reset', function() {
          return $timeout(function() {
            el.removeClass('has-error');
            el.removeClass('has-success');
            return blurred = false;
          }, 0, false);
        });
        return toggleClasses = function(invalid) {
          el.toggleClass('has-error', invalid);
          if (showSuccess) {
            return el.toggleClass('has-success', !invalid);
          }
        };
      };
      return {
        restrict: 'A',
        require: '^form',
        compile: function(elem, attrs) {
          if (!elem.hasClass('form-group')) {
            throw "show-errors element does not have the 'form-group' class";
          }
          return linkFn;
        }
      };
    }
  ]);

  showErrorsModule.provider('showErrorsConfig', function() {
    var _showSuccess, _trigger;
    _showSuccess = false;
    _trigger = 'blur';
    this.showSuccess = function(showSuccess) {
      return _showSuccess = showSuccess;
    };
    this.trigger = function(trigger) {
      return _trigger = trigger;
    };
    this.$get = function() {
      return {
        showSuccess: _showSuccess,
        trigger: _trigger
      };
    };
  });

}).call(this);
