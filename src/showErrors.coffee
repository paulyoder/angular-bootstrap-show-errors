angular.module('ui.bootstrap.showErrors', [])
  .directive 'showErrors', ($timeout) ->

    linkFn = (scope, el, attrs, formCtrl) ->
      blurred = false
      inputEl   = el[0].querySelector("[name]")
      inputNgEl = angular.element(inputEl)
      inputName = inputNgEl.attr('name')

      inputNgEl.bind 'blur', ->
        blurred = true
        el.toggleClass 'has-error', formCtrl[inputName].$invalid

      scope.$watch ->
        formCtrl[inputName].$invalid
      , (newVal) ->
        return unless blurred
        el.toggleClass 'has-error', newVal

      scope.$on 'show-errors-check-validity', ->
        el.toggleClass 'has-error', formCtrl[inputName].$invalid

      scope.$on 'show-errors-reset', ->
        $timeout ->
          # want to run this after the current digest cycle
          el.removeClass 'has-error'
          blurred = false
        , 0, false

    {
      restrict: 'A'
      require: '^form'
      compile: (elem, attrs) ->
        unless elem.hasClass 'form-group'
          throw "show-errors element does not have the 'form-group' class"
        unless elem[0].querySelector('input[name]')?
          throw "show-errors element has no child input elements with a 'name' attribute"
        linkFn
    }
