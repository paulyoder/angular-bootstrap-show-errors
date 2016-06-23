(function() {
  var showErrorsModule;

  showErrorsModule = angular.module('ui.bootstrap.showErrors', []);

  showErrorsModule.directive('showErrors', [
    '$timeout', 'showErrorsConfig', '$interpolate', function($timeout, showErrorsConfig, $interpolate) {
      var getIgnorePristine, getShowSuccess, getTrigger, linkFn;
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
      getIgnorePristine = function(options) {
        var ignorePristine;
        ignorePristine = showErrorsConfig.ignorePristine;
        if (options && (options.ignorePristine != null)) {
          ignorePristine = options.ignorePristine;
        }
        return ignorePristine;
      };
      linkFn = function(scope, el, attrs, formCtrl) {
        var blurred, ignorePristine, inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses, trigger;
        blurred = false;
        options = scope.$eval(attrs.showErrors);
        showSuccess = getShowSuccess(options);
        ignorePristine = getIgnorePristine(options);
        trigger = getTrigger(options);
        inputEl = el[0].querySelector('[name]');
        inputNgEl = angular.element(inputEl);
        inputName = $interpolate(inputNgEl.attr('name') || '')(scope);
        if (!inputName) {
          throw "show-errors element has no child input elements with a 'name' attribute";
        }
        inputNgEl.bind(trigger, function() {
          if (ignorePristine && formCtrl[inputName].$pristine) {
            return;
          }
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
        scope.$on('show-errors-check-validity', function(event, name) {
          if (angular.isUndefined(name) || formCtrl['$name'] === name) {
            return toggleClasses(formCtrl[inputName].$invalid);
          }
        });
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
          if (attrs['showErrors'].indexOf('skipFormGroupCheck') === -1) {
            if (!(elem.hasClass('form-group') || elem.hasClass('input-group'))) {
              throw "show-errors element does not have the 'form-group' or 'input-group' class";
            }
          }
          return linkFn;
        }
      };
    }
  ]);

  showErrorsModule.provider('showErrorsConfig', function() {
    var _ignorePristine, _showSuccess, _trigger;
    _showSuccess = false;
    _trigger = 'blur';
    _ignorePristine = false;
    this.showSuccess = function(showSuccess) {
      return _showSuccess = showSuccess;
    };
    this.trigger = function(trigger) {
      return _trigger = trigger;
    };
    this.ignorePristine = function(ignorePristine) {
      return _ignorePristine = ignorePristine;
    };
    this.$get = function() {
      return {
        showSuccess: _showSuccess,
        trigger: _trigger,
        ignorePristine: _ignorePristine
      };
    };
  });

}).call(this);
