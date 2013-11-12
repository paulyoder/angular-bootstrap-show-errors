angular.module('ui.bootstrap.showErrors', [])
  .directive 'showErrors', ->

    linkFn = (scope, elem, attrs, ctrl) ->
      elem.addClass 'has-error'

    {
      restrict: 'A'
      require: '^form'
      compile: (elem, attrs) ->
        unless elem.hasClass 'form-group'
          throw "show-errors element does not have the 'form-group' class"
        unless elem[0].querySelector('input[name]')?
          throw "show-errors element has no input elements with a 'name' attribute"
        linkFn
    }
