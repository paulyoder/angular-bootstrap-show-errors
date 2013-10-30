(function() {
  describe('showErrors', function() {
    var $compile, $rootScope;
    $compile = void 0;
    $rootScope = void 0;
    beforeEach(module('ui.bootstrap.showErrors'));
    beforeEach(inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      return $rootScope = _$rootScope_;
    }));
    describe('directive does not contain an input element with a name attribute', function() {
      return it('throws an exception', function() {
        return expect(function() {
          return $compile('<div class="form-group" show-errors><input type="text"></input></div>')($rootScope);
        }).toThrow("show-errors element has no input elements with a 'name' attribute");
      });
    });
    it("adds 'has-error' class", function() {
      $rootScope.$digest();
      return expect(element).toHaveClass('has-error');
    });
    return it("throws an exception if the element doesn't have the form-group class", function() {
      return expect(function() {
        return $compile('<div show-errors></div>')($rootScope);
      }).toThrow("show-errors element does not have the 'form-group' class");
    });
  });

}).call(this);
