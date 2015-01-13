(function() {
  var expectFirstNameFormGroupHasErrorClass, expectFirstNameFormGroupHasSuccessClass, expectFormGroupHasErrorClass, expectLastNameFormGroupHasErrorClass, expectLastNameFormGroupHasSuccessClass, find, firstNameEl, lastNameEl;

  describe('showErrors', function() {
    var $compile, $scope, $timeout, compileEl, invalidName, validName;
    $compile = void 0;
    $scope = void 0;
    $timeout = void 0;
    validName = 'Paul';
    invalidName = 'Pa';
    beforeEach(module('ui.bootstrap.showErrors'));
    beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_) {
      $compile = _$compile_;
      $scope = _$rootScope_;
      return $timeout = _$timeout_;
    }));
    compileEl = function() {
      var el;
      el = $compile('<form name="userForm">\
          <div id="first-name-group" class="form-group" show-errors>\
            <input type="text" name="firstName" ng-model="firstName" ng-minlength="3" class="form-control" />\
          </div>\
          <div id="last-name-group" class="form-group" show-errors="{ showSuccess: true }">\
            <input type="text" name="lastName" ng-model="lastName" ng-minlength="3" class="form-control" />\
          </div>\
        </form>')($scope);
      angular.element(document.body).append(el);
      $scope.$digest();
      return el;
    };
    describe('directive does not contain an input element with a form-control class and name attribute', function() {
      return it('throws an exception', function() {
        return expect(function() {
          return $compile('<form name="userForm"><div class="form-group" show-errors><input type="text" name="firstName"></input></div></form>')($scope);
        }).toThrow("show-errors element has no child input elements with a 'name' attribute and a 'form-control' class");
      });
    });
    it("throws an exception if the element doesn't have the form-group or input-group class", function() {
      return expect(function() {
        return $compile('<div show-errors></div>')($scope);
      }).toThrow("show-errors element does not have the 'form-group' or 'input-group' class");
    });
    it("doesn't throw an exception if the element has the input-group class", function() {
      return expect(function() {
        return $compile('<form name="userForm"><div class="input-group" show-errors><input class="form-control" type="text" name="firstName"></input></div></form>')($scope);
      }).not.toThrow();
    });
    it("doesn't throw an exception if the element doesn't have the form-group class but uses the skipFormGroupCheck option", function() {
      return expect(function() {
        return $compile('<form name="userForm"><div show-errors="{ skipFormGroupCheck: true }"><input class="form-control" type="text" name="firstName"></input></div></form>')($scope);
      }).not.toThrow();
    });
    it("throws an exception if the element isn't in a form tag", function() {
      return expect(function() {
        return $compile('<div class="form-group" show-errors><input type="text" name="firstName"></input></div>')($scope);
      }).toThrow();
    });
    describe('$pristine && $invalid', function() {
      return it('has-error is absent', function() {
        var el;
        el = compileEl();
        return expectFormGroupHasErrorClass(el).toBe(false);
      });
    });
    describe('$dirty && $invalid && blurred', function() {
      return it('has-error is present', function() {
        var el;
        el = compileEl();
        $scope.userForm.firstName.$setViewValue(invalidName);
        angular.element(firstNameEl(el)).triggerHandler('blur');
        return expectFormGroupHasErrorClass(el).toBe(true);
      });
    });
    describe('$dirty && $invalid && not blurred', function() {
      return it('has-error is absent', function() {
        var el;
        el = compileEl();
        $scope.userForm.firstName.$setViewValue(invalidName);
        angular.element(firstNameEl(el)).triggerHandler('keydown');
        return expectFormGroupHasErrorClass(el).toBe(false);
      });
    });
    describe('$valid && blurred', function() {
      return it('has-error is absent', function() {
        var el;
        el = compileEl();
        $scope.userForm.firstName.$setViewValue(validName);
        angular.element(firstNameEl(el)).triggerHandler('blur');
        return expectFormGroupHasErrorClass(el).toBe(false);
      });
    });
    describe('$valid && blurred then becomes $invalid before blurred', function() {
      return it('has-error is present', function() {
        var el;
        el = compileEl();
        $scope.userForm.firstName.$setViewValue(validName);
        angular.element(firstNameEl(el)).triggerHandler('blur');
        $scope.$apply(function() {
          return $scope.userForm.firstName.$setViewValue(invalidName);
        });
        return expectFormGroupHasErrorClass(el).toBe(true);
      });
    });
    describe('$valid && blurred then becomes $valid before blurred', function() {
      return it('has-error is absent', function() {
        var el;
        el = compileEl();
        $scope.userForm.firstName.$setViewValue(validName);
        angular.element(firstNameEl(el)).triggerHandler('blur');
        $scope.$apply(function() {
          return $scope.userForm.firstName.$setViewValue(invalidName);
        });
        $scope.$apply(function() {
          return $scope.userForm.firstName.$setViewValue(validName);
        });
        return expectFormGroupHasErrorClass(el).toBe(false);
      });
    });
    describe('$valid && blurred then becomes $invalid after blurred', function() {
      return it('has-error is present', function() {
        var el;
        el = compileEl();
        $scope.userForm.firstName.$setViewValue(validName);
        angular.element(firstNameEl(el)).triggerHandler('blur');
        $scope.userForm.firstName.$setViewValue(invalidName);
        angular.element(firstNameEl(el)).triggerHandler('blur');
        return expectFormGroupHasErrorClass(el).toBe(true);
      });
    });
    describe('$valid && blurred then $invalid after blurred then $valid after blurred', function() {
      return it('has-error is absent', function() {
        var el;
        el = compileEl();
        $scope.userForm.firstName.$setViewValue(validName);
        angular.element(firstNameEl(el)).triggerHandler('blur');
        $scope.userForm.firstName.$setViewValue(invalidName);
        angular.element(firstNameEl(el)).triggerHandler('blur');
        $scope.userForm.firstName.$setViewValue(validName);
        angular.element(firstNameEl(el)).triggerHandler('blur');
        return expectFormGroupHasErrorClass(el).toBe(false);
      });
    });
    describe('$valid && other input is $invalid && blurred', function() {
      return it('has-error is absent', function() {
        var el;
        el = compileEl();
        $scope.userForm.firstName.$setViewValue(validName);
        $scope.userForm.lastName.$setViewValue(invalidName);
        angular.element(firstNameEl(el)).triggerHandler('blur');
        return expectFormGroupHasErrorClass(el).toBe(false);
      });
    });
    describe('$invalid && showErrorsCheckValidity is set before blurred', function() {
      return it('has-error is present', function() {
        var el;
        el = compileEl();
        $scope.userForm.firstName.$setViewValue(invalidName);
        $scope.$broadcast('show-errors-check-validity');
        return expectFormGroupHasErrorClass(el).toBe(true);
      });
    });
    describe('showErrorsCheckValidity is called twice', function() {
      return it('correctly applies the has-error class', function() {
        var el;
        el = compileEl();
        $scope.userForm.firstName.$setViewValue(invalidName);
        $scope.$broadcast('show-errors-check-validity');
        $scope.userForm.firstName.$setViewValue(validName);
        angular.element(firstNameEl(el)).triggerHandler('blur');
        $scope.userForm.firstName.$setViewValue(invalidName);
        $scope.$apply(function() {
          return $scope.showErrorsCheckValidity = true;
        });
        return expectFormGroupHasErrorClass(el).toBe(true);
      });
    });
    describe('showErrorsReset', function() {
      return it('removes has-error', function() {
        var el;
        el = compileEl();
        $scope.userForm.firstName.$setViewValue(invalidName);
        angular.element(firstNameEl(el)).triggerHandler('blur');
        $scope.$broadcast('show-errors-reset');
        $timeout.flush();
        return expectFormGroupHasErrorClass(el).toBe(false);
      });
    });
    describe('showErrorsReset then invalid without blurred', function() {
      return it('has-error is absent', function() {
        var el;
        el = compileEl();
        $scope.userForm.firstName.$setViewValue(validName);
        angular.element(firstNameEl(el)).triggerHandler('blur');
        $scope.$broadcast('show-errors-reset');
        $timeout.flush();
        $scope.$apply(function() {
          return $scope.userForm.firstName.$setViewValue(invalidName);
        });
        return expectFormGroupHasErrorClass(el).toBe(false);
      });
    });
    describe('call showErrorsReset multiple times', function() {
      return it('removes has-error', function() {
        var el;
        el = compileEl();
        $scope.userForm.firstName.$setViewValue(invalidName);
        angular.element(firstNameEl(el)).triggerHandler('blur');
        $scope.$broadcast('show-errors-reset');
        $timeout.flush();
        angular.element(firstNameEl(el)).triggerHandler('blur');
        $scope.$broadcast('show-errors-reset');
        $timeout.flush();
        return expectFormGroupHasErrorClass(el).toBe(false);
      });
    });
    return describe('{showSuccess: true} option', function() {
      describe('$pristine && $valid', function() {
        return it('has-success is absent', function() {
          var el;
          el = compileEl();
          return expectLastNameFormGroupHasSuccessClass(el).toBe(false);
        });
      });
      describe('$dirty && $valid && blurred', function() {
        return it('has-success is present', function() {
          var el;
          el = compileEl();
          $scope.userForm.lastName.$setViewValue(validName);
          angular.element(lastNameEl(el)).triggerHandler('blur');
          $scope.$digest();
          return expectLastNameFormGroupHasSuccessClass(el).toBe(true);
        });
      });
      describe('$dirty && $invalid && blurred', function() {
        return it('has-success is present', function() {
          var el;
          el = compileEl();
          $scope.userForm.lastName.$setViewValue(invalidName);
          angular.element(lastNameEl(el)).triggerHandler('blur');
          $scope.$digest();
          return expectLastNameFormGroupHasSuccessClass(el).toBe(false);
        });
      });
      describe('$invalid && blurred then becomes $valid before blurred', function() {
        return it('has-success is present', function() {
          var el;
          el = compileEl();
          $scope.userForm.lastName.$setViewValue(invalidName);
          angular.element(lastNameEl(el)).triggerHandler('blur');
          $scope.$apply(function() {
            return $scope.userForm.lastName.$setViewValue(invalidName);
          });
          $scope.$apply(function() {
            return $scope.userForm.lastName.$setViewValue(validName);
          });
          return expectLastNameFormGroupHasSuccessClass(el).toBe(true);
        });
      });
      describe('$valid && showErrorsCheckValidity is set before blurred', function() {
        return it('has-success is present', function() {
          var el;
          el = compileEl();
          $scope.userForm.lastName.$setViewValue(validName);
          $scope.$broadcast('show-errors-check-validity');
          return expectLastNameFormGroupHasSuccessClass(el).toBe(true);
        });
      });
      return describe('showErrorsReset', function() {
        return it('removes has-success', function() {
          var el;
          el = compileEl();
          $scope.userForm.lastName.$setViewValue(validName);
          angular.element(lastNameEl(el)).triggerHandler('blur');
          $scope.$broadcast('show-errors-reset');
          $timeout.flush();
          return expectLastNameFormGroupHasSuccessClass(el).toBe(false);
        });
      });
    });
  });

  describe('showErrorsConfig', function() {
    var $compile, $scope, $timeout, compileEl, invalidName, validName;
    $compile = void 0;
    $scope = void 0;
    $timeout = void 0;
    validName = 'Paul';
    invalidName = 'Pa';
    beforeEach(function() {
      var testModule;
      testModule = angular.module('testModule', []);
      testModule.config(function(showErrorsConfigProvider) {
        showErrorsConfigProvider.showSuccess(true);
        return showErrorsConfigProvider.trigger('keypress');
      });
      module('ui.bootstrap.showErrors', 'testModule');
      return inject(function(_$compile_, _$rootScope_, _$timeout_) {
        $compile = _$compile_;
        $scope = _$rootScope_;
        return $timeout = _$timeout_;
      });
    });
    compileEl = function() {
      var el;
      el = $compile('<form name="userForm">\
          <div id="first-name-group" class="form-group" show-errors="{showSuccess: false, trigger: \'blur\'}">\
            <input type="text" name="firstName" ng-model="firstName" ng-minlength="3" class="form-control" />\
          </div>\
          <div id="last-name-group" class="form-group" show-errors>\
            <input type="text" name="lastName" ng-model="lastName" ng-minlength="3" class="form-control" />\
          </div>\
        </form>')($scope);
      angular.element(document.body).append(el);
      $scope.$digest();
      return el;
    };
    describe('when showErrorsConfig.showSuccess is true', function() {
      return describe('and no options given', function() {
        return it('show-success class is applied', function() {
          var el;
          el = compileEl();
          $scope.userForm.lastName.$setViewValue(validName);
          angular.element(lastNameEl(el)).triggerHandler('keypress');
          $scope.$digest();
          return expectLastNameFormGroupHasSuccessClass(el).toBe(true);
        });
      });
    });
    describe('when showErrorsConfig.showSuccess is true', function() {
      return describe('but options.showSuccess is false', function() {
        return it('show-success class is not applied', function() {
          var el;
          el = compileEl();
          $scope.userForm.firstName.$setViewValue(validName);
          angular.element(firstNameEl(el)).triggerHandler('blur');
          $scope.$digest();
          return expectFirstNameFormGroupHasSuccessClass(el).toBe(false);
        });
      });
    });
    return describe('when showErrorsConfig.trigger is "keypress"', function() {
      describe('and no options given', function() {
        return it('validates the value on the first keypress', function() {
          var el;
          el = compileEl();
          $scope.userForm.lastName.$setViewValue(invalidName);
          angular.element(lastNameEl(el)).triggerHandler('keypress');
          $scope.$digest();
          return expectLastNameFormGroupHasErrorClass(el).toBe(true);
        });
      });
      return describe('but options.trigger is "blur"', function() {
        return it('does not validate the value on keypress', function() {
          var el;
          el = compileEl();
          $scope.userForm.firstName.$setViewValue(invalidName);
          angular.element(firstNameEl(el)).triggerHandler('keypress');
          $scope.$digest();
          return expectFirstNameFormGroupHasErrorClass(el).toBe(false);
        });
      });
    });
  });

  find = function(el, selector) {
    return el[0].querySelector(selector);
  };

  firstNameEl = function(el) {
    return find(el, '[name=firstName]');
  };

  lastNameEl = function(el) {
    return find(el, '[name=lastName]');
  };

  expectFormGroupHasErrorClass = function(el) {
    var formGroup;
    formGroup = el[0].querySelector('[id=first-name-group]');
    return expect(angular.element(formGroup).hasClass('has-error'));
  };

  expectFirstNameFormGroupHasSuccessClass = function(el) {
    var formGroup;
    formGroup = el[0].querySelector('[id=first-name-group]');
    return expect(angular.element(formGroup).hasClass('has-success'));
  };

  expectLastNameFormGroupHasSuccessClass = function(el) {
    var formGroup;
    formGroup = el[0].querySelector('[id=last-name-group]');
    return expect(angular.element(formGroup).hasClass('has-success'));
  };

  expectFirstNameFormGroupHasErrorClass = function(el) {
    var formGroup;
    formGroup = el[0].querySelector('[id=first-name-group]');
    return expect(angular.element(formGroup).hasClass('has-error'));
  };

  expectLastNameFormGroupHasErrorClass = function(el) {
    var formGroup;
    formGroup = el[0].querySelector('[id=last-name-group]');
    return expect(angular.element(formGroup).hasClass('has-error'));
  };

}).call(this);
