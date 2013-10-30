(function() {
  beforeEach(function() {
    return this.addMatchers({
      toHaveClass: function(klass) {
        this.message = function() {
          return "Expected '" + (angular.mock.dump(this.actual)) + "' to have class '" + klass + "'.";
        };
        return this.actual.hasClass(klass);
      }
    });
  });

}).call(this);
