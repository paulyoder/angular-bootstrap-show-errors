(function() {
  describe('showErrors', function() {
    var $compile, $scope, compileEl, expectFormGroupHasErrorClass, find, firstNameEl, firstNameGroup, invalidName, triggerEvent, validName;
    $compile = void 0;
    $scope = void 0;
    validName = 'Paul';
    invalidName = 'Pa';
    beforeEach(module('ui.bootstrap.showErrors'));
    beforeEach(inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      return $scope = _$rootScope_;
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
    triggerEvent = function(nativeEl, eventName) {
      return nativeEl.dispatchEvent(new Event(eventName));
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
    describe('directive does not contain an input element with a name attribute', function() {
      return it('throws an exception', function() {
        return expect(function() {
          return $compile('<div class="form-group" show-errors><input type="text"></input></div>')($scope);
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
    describe("when $pristine && $invalid", function() {
      return it("does not have the 'has-error' class", function() {
        var el;
        el = compileEl();
        return expectFormGroupHasErrorClass(el).toBe(false);
      });
    });
    describe('when $dirty && $invalid', function() {
      describe('and blurred', function() {
        return it("has the 'has-error' class", function() {
          var el;
          el = compileEl();
          $scope.userForm.firstName.$setViewValue(invalidName);
          triggerEvent(firstNameEl(el), 'blur');
          return expectFormGroupHasErrorClass(el).toBe(true);
        });
      });
      return describe('and not blurred', function() {
        return it("does not have the 'has-error' class", function() {
          var el;
          el = compileEl();
          $scope.userForm.firstName.$setViewValue(invalidName);
          triggerEvent(firstNameEl(el), 'keydown');
          return expectFormGroupHasErrorClass(el).toBe(false);
        });
      });
    });
    return describe('when $dirty && $valid', function() {
      describe('and blurred', function() {
        return it("does not have the 'has-error' class", function() {
          var el;
          el = compileEl();
          $scope.userForm.firstName.$setViewValue(validName);
          triggerEvent(firstNameEl(el), 'blur');
          return expectFormGroupHasErrorClass(el).toBe(false);
        });
      });
      return describe('and other input is $invalid', function() {
        return it("does not have the 'has-error' class", function() {
          var el;
          el = compileEl();
          $scope.userForm.firstName.$setViewValue(validName);
          $scope.userForm.lastName.$setViewValue(invalidName);
          triggerEvent(firstNameEl(el), 'blur');
          return expectFormGroupHasErrorClass(el).toBe(false);
        });
      });
    });
  });

}).call(this);
