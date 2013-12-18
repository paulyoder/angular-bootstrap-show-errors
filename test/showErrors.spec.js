(function() {
  describe('showErrors', function() {
    var $compile, $scope, compileEl, triggerInputEvent;
    $compile = void 0;
    $scope = void 0;
    beforeEach(module('ui.bootstrap.showErrors'));
    beforeEach(inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      return $scope = _$rootScope_;
    }));
    compileEl = function() {
      var el;
      el = $compile('<form name="userForm"><div class="form-group" show-errors><input type="text" name="firstName" ng-model="firstName" ng-minlength="3"></input></div></form>')($scope);
      $scope.$digest();
      return el;
    };
    triggerInputEvent = function(el, eventName) {
      return el.find('input')[0].dispatchEvent(new Event(eventName));
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
      return it("input element does not have the 'has-error' class", function() {
        var el;
        el = compileEl();
        return expect(el.find('div').hasClass('has-error')).toBe(false);
      });
    });
    return describe('when $dirty && $invalid', function() {
      describe('and blurred', function() {
        return it("input element does not have the 'has-error' class", function() {
          var el;
          el = compileEl();
          $scope.userForm.firstName.$setViewValue('Pa');
          triggerInputEvent(el, 'blur');
          return expect(el.find('div').hasClass('has-error')).toBe(true);
        });
      });
      return describe('and not blurred', function() {
        return it("input element does not have the 'has-error' class", function() {
          var el;
          el = compileEl();
          $scope.userForm.firstName.$setViewValue('Pa');
          triggerInputEvent(el, 'change');
          return expect(el.find('div').hasClass('has-error')).toBe(false);
        });
      });
    });
  });

}).call(this);
