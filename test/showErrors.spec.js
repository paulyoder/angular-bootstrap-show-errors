(function() {
  describe('showErrors', function() {
    var $compile, $scope, $timeout, compileEl, expectFormGroupHasErrorClass, expectFormGroupHasSuccessClass, find, firstNameEl, firstNameGroup, invalidName, validName;
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
            <input type="text" name="firstName" ng-model="firstName" ng-minlength="3" />\
          </div>\
          <div class="form-group" show-errors>\
            <input type="text" name="lastName" ng-model="lastName" ng-minlength="3" />\
          </div>\
        </form>')($scope);
      $scope.$digest();
      return el;
    };
    find = function(el, selector) {
      return el[0].querySelector(selector);
    };
    firstNameEl = function(el) {
      return find(el, '[name=firstName]');
    };
    firstNameGroup = function(el) {
      return angular.element(find(el, '#first-name-group'));
    };
    expectFormGroupHasErrorClass = function(el) {
      return expect(firstNameGroup(el).hasClass('has-error'));
    };
    expectFormGroupHasSuccessClass = function(el) {
      return expect(firstNameGroup(el).hasClass('has-success'));
    };
    describe('directive does not contain an input element with a name attribute', function() {
      return it('throws an exception', function() {
        return expect(function() {
          return $compile('<form name="userForm"><div class="form-group" show-errors><input type="text"></input></div></form>')($scope);
        }).toThrow("show-errors element has no child input elements with a 'name' attribute");
      });
    });
    it("throws an exception if the element doesn't have the form-group class", function() {
      return expect(function() {
        return $compile('<div show-errors></div>')($scope);
      }).toThrow("show-errors element does not have the 'form-group' class");
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
    describe('$pristine && $valid', function() {
      return it('has-success is present', function() {
        var el;
        el = compileEl();
        return expectFormGroupHasSuccessClass(el).toBe(true);
      });
    });
    describe('$dirty && $invalid && blurred', function() {
      return it('has-error is present', function() {
        var el;
        el = compileEl();
        $scope.userForm.firstName.$setViewValue(invalidName);
        browserTrigger(firstNameEl(el), 'blur');
        expectFormGroupHasErrorClass(el).toBe(true);
        return describe('not blurred', function() {});
      });
    });
    describe('$dirty && $valid && blurred', function() {
      return it('has-success is present', function() {
        var el;
        el = compileEl();
        $scope.userForm.firstName.$setViewValue(validName);
        browserTrigger(firstNameEl(el), 'blur');
        expectFormGroupHasSuccessClass(el).toBe(true);
        return describe('not blurred', function() {});
      });
    });
    describe('$dirty && $invalid && not blurred', function() {
      return it('has-error is absent', function() {
        var el;
        el = compileEl();
        $scope.userForm.firstName.$setViewValue(invalidName);
        browserTrigger(firstNameEl(el), 'keydown');
        return expectFormGroupHasErrorClass(el).toBe(false);
      });
    });
    describe('$valid && blurred', function() {
      return it('has-error is absent', function() {
        var el;
        el = compileEl();
        $scope.userForm.firstName.$setViewValue(validName);
        browserTrigger(firstNameEl(el), 'blur');
        return expectFormGroupHasErrorClass(el).toBe(false);
      });
    });
    describe('$valid && blurred then becomes $invalid before blurred', function() {
      return it('has-error is present', function() {
        var el;
        el = compileEl();
        $scope.userForm.firstName.$setViewValue(validName);
        browserTrigger(firstNameEl(el), 'blur');
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
        browserTrigger(firstNameEl(el), 'blur');
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
        browserTrigger(firstNameEl(el), 'blur');
        $scope.userForm.firstName.$setViewValue(invalidName);
        browserTrigger(firstNameEl(el), 'blur');
        return expectFormGroupHasErrorClass(el).toBe(true);
      });
    });
    describe('$valid && blurred then $invalid after blurred then $valid after blurred', function() {
      return it('has-error is absent', function() {
        var el;
        el = compileEl();
        $scope.userForm.firstName.$setViewValue(validName);
        browserTrigger(firstNameEl(el), 'blur');
        $scope.userForm.firstName.$setViewValue(invalidName);
        browserTrigger(firstNameEl(el), 'blur');
        $scope.userForm.firstName.$setViewValue(validName);
        browserTrigger(firstNameEl(el), 'blur');
        return expectFormGroupHasErrorClass(el).toBe(false);
      });
    });
    describe('$valid && other input is $invalid && blurred', function() {
      return it('has-error is absent', function() {
        var el;
        el = compileEl();
        $scope.userForm.firstName.$setViewValue(validName);
        $scope.userForm.lastName.$setViewValue(invalidName);
        browserTrigger(firstNameEl(el), 'blur');
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
        browserTrigger(firstNameEl(el), 'blur');
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
        browserTrigger(firstNameEl(el), 'blur');
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
        browserTrigger(firstNameEl(el), 'blur');
        $scope.$broadcast('show-errors-reset');
        $timeout.flush();
        $scope.$apply(function() {
          return $scope.userForm.firstName.$setViewValue(invalidName);
        });
        return expectFormGroupHasErrorClass(el).toBe(false);
      });
    });
    return describe('call showErrorsReset multiple times', function() {
      return it('removes has-error', function() {
        var el;
        el = compileEl();
        $scope.userForm.firstName.$setViewValue(invalidName);
        browserTrigger(firstNameEl(el), 'blur');
        $scope.$broadcast('show-errors-reset');
        $timeout.flush();
        browserTrigger(firstNameEl(el), 'blur');
        $scope.$broadcast('show-errors-reset');
        $timeout.flush();
        return expectFormGroupHasErrorClass(el).toBe(false);
      });
    });
  });

}).call(this);
