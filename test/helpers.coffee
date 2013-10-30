beforeEach ->
  @addMatchers
    toHaveClass: (klass) ->
      @message = ->
        "Expected '#{ angular.mock.dump(@actual) }' to have class '#{ klass }'."

      @actual.hasClass klass
