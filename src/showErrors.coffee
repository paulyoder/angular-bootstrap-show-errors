angular.module('ui.bootstrap.showErrors', [])
  .directive 'showErrors', ($timeout) ->

    linkFn = (scope, el, attrs, formCtrl) ->
      blurred = false
      inputEl   = el[0].querySelector("[name]")
      inputNgEl = angular.element(inputEl)
      inputName = inputNgEl.attr('name')
      unless inputName
        throw "show-errors element has no child input elements with a 'name' attribute"

      inputNgEl.bind 'blur', ->
        blurred = true
        el.toggleClass 'has-error', formCtrl[inputName].$invalid
        el.toggleClass 'has-success', formCtrl[inputName].$valid

      scope.$watch ->
        formCtrl[inputName].$invalid
      , (invalid) ->
        return if !blurred && invalid
        el.toggleClass 'has-error', invalid

      scope.$watch ->
        formCtrl[inputName].$valid
      , (valid) ->
        return if !blurred && valid
        el.toggleClass 'has-success', valid

      scope.$on 'show-errors-check-validity', ->
        el.toggleClass 'has-error', formCtrl[inputName].$invalid
        el.toggleClass 'has-success', formCtrl[inputName].$valid

      scope.$on 'show-errors-reset', ->
        $timeout ->
          # want to run this after the current digest cycle
          el.removeClass 'has-error'
          el.removeClass 'has-success'
          blurred = false
        , 0, false

    {
      restrict: 'A'
      require: '^form'
      compile: (elem, attrs) ->
        unless elem.hasClass 'form-group'
          throw "show-errors element does not have the 'form-group' class"
        linkFn
    }
