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
        var inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses, trigger;
        options = scope.$eval(attrs.showErrors);
        showSuccess = getShowSuccess(options);
        trigger = getTrigger(options);
        inputEl = el[0].querySelector('.form-control[name]');
        inputNgEl = angular.element(inputEl);
        inputName = $interpolate(inputNgEl.attr('name') || '')(scope);
        if (!inputName) {
          throw "show-errors element has no child input elements with a 'name' attribute and a 'form-control' class";
        }
        inputNgEl.bind(trigger, function() {
          scope.$apply(function() {
              formCtrl[inputName].$blurred = true;
          })
          return toggleClasses(formCtrl[inputName].$invalid);
        });
        scope.$watch(function() {
          return formCtrl[inputName] && formCtrl[inputName].$invalid;
        }, function(invalid) {
          if (!formCtrl[inputName].$blurred) {
            return;
          }
          return toggleClasses(invalid);
        });
        scope.$on('show-errors-check-validity', function() {
          return toggleClasses(formCtrl[inputName].$invalid);
        });
        scope.$on('show-errors-reset', function() {
          return $timeout(function() {
            el.removeClass('has-error');
            el.removeClass('has-success');
            return formCtrl[inputName].$blurred = false;
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

  showErrorsModule.directive('showErrorIcons', [
    '$timeout', 'showErrorsConfig', '$interpolate', function($timeout, showErrorsConfig, $interpolate) {
      var getShowSuccess, linkFn;
      getShowSuccess = function(options) {
        var showSuccess;
        showSuccess = showErrorsConfig.showSuccess;
        if (options && (options.showSuccess != null)) {
          showSuccess = options.showSuccess;
        }
        return showSuccess;
      };

      linkFn = function(scope, el, attrs, formCtrl) {
        var inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses, trigger;
        options = scope.$eval(attrs.showErrors);
        showSuccess = getShowSuccess(options);

        inputEl = el[0].parentNode.querySelector('.form-control[name]');
        inputNgEl = angular.element(inputEl);
        inputName = $interpolate(inputNgEl.attr('name') || '')(scope);
        if (!inputName) {
          throw "show-error-icons element's parent has no child input elements with a 'name' attribute and a 'form-control' class";
        }

        scope.$watch(function() {
          return formCtrl[inputName] ^ formCtrl[inputName].$invalid ^ formCtrl[inputName].$blurred;
        }, function() {
          return toggleClasses(formCtrl[inputName].$blurred, formCtrl[inputName].$invalid);
        })

        scope.$on('show-errors-check-validity', function() {
          return toggleClasses(true, formCtrl[inputName].$invalid);
        });

        scope.$on('show-errors-reset', function() {
          return $timeout(function() {
            toggleClasses(false)
          }, 0, false);
        });
        return toggleClasses = function(show, invalid) {
          el.toggleClass('ng-hide', !show)
          el.toggleClass('glyphicon', true)
          el.toggleClass('glyphicon-remove', invalid);
          if (showSuccess) {
            return el.toggleClass('glyphicon-ok', !invalid);
          }
        };
      };
      return {
        restrict: 'A',
        require: '^form',
        compile: function(elem, attrs) {
          if (!elem.parent().children(".form-control[name]")) {
            throw "show-error-icons must be applied on an element whose parent contains an input[name] element!"
          }

          return linkFn;
        }
      };
    }
  ]);

  showErrorsModule.directive('showErrorHint', [
    '$timeout', 'showErrorsConfig', '$interpolate', function($timeout, showErrorsConfig, $interpolate) {
      var getShowSuccess, linkFn;
      getShowSuccess = function(options) {
        var showSuccess;
        showSuccess = showErrorsConfig.showSuccess;
        if (options && (options.showSuccess != null)) {
          showSuccess = options.showSuccess;
        }
        return showSuccess;
      };

      linkFn = function(formgroup) {
          return function(scope, el, attrs, formCtrl) {
            var inputEl, inputName, inputNgEl, toggleClasses, validator;

            inputEl = formgroup[0].querySelector('input.form-control[name]');
            inputNgEl = angular.element(inputEl)
            inputName = $interpolate(inputNgEl.attr('name') || '')(scope);
            validator = scope.showErrorHint

            if (!inputName) {
              throw "show-error-hint element's parent has no child input elements with a 'name' attribute and a 'form-control' class";
            }

            var update = function(force) {
              return function() {
                  if (validator) {
                    return scope.toggleClasses((formCtrl[inputName].$blurred || force) && formCtrl[inputName].$error[validator])
                  } else {
                    var errors = formCtrl[inputName].$error || {}
                    var keys = Object.keys(errors)
                    var errorCount = keys.filter(function(e) { return errors[e]; }).length

                    return scope.toggleClasses((formCtrl[inputName].$blurred || force) && errorCount > 0)
                  }
              }
            }

            if (validator) {
                scope.$watch(function() {
                    return formCtrl[inputName].$error[validator]
                }, update(false))
            } else {
                scope.$watch(function() {
                    return JSON.stringify(formCtrl[inputName].$error)
                }, update(false))
            }

            scope.$watch(function() {
              return formCtrl[inputName].$blurred
            }, update(false))

            scope.$on('show-errors-check-validity', function() {
              return update(true)()
            });

            scope.$on('show-errors-reset', function() {
              return $timeout(function() {
                scope.toggleClasses(true)
              }, 0, false);
            });

            scope.toggleClasses = function(show) {
              el.toggleClass('ng-hide', !show)
            };

            return scope.toggleClasses
          };
      }

      return {
        restrict: 'A',
        require: '^form',
        scope: {
          showErrorHint: '@'
        },

        compile: function(elem, attrs) {

          //Find first ancestor with a form control
          while(elem && !elem[0].querySelector(".form-control[name]")) {
            elem = elem.parent()
          }

          if (!elem) {
            throw "show-error-hint must be applied on an element whose parent contains an input[name] element!"
          }

          return linkFn(elem);
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
