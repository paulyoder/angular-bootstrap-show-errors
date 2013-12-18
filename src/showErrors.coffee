angular.module('ui.bootstrap.showErrors', [])
  .directive 'showErrors', ->

    linkFn = (scope, el, attrs, formCtrl) ->
      inputEl = el[0].querySelector("[name]")
      inputNgEl = angular.element(inputEl)
      #inputName = inputNgEl.attr('name')
      inputNgEl.bind 'blur', ->
        el.addClass 'has-error' if formCtrl.$invalid

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
