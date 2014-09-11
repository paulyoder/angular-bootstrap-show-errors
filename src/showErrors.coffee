showErrorsModule = angular.module('ui.bootstrap.showErrors', [])

showErrorsModule.directive 'showErrors',
['$timeout', 'showErrorsConfig', ($timeout, showErrorsConfig) ->

    getShowSuccess = (options) ->
      showSuccess = showErrorsConfig.showSuccess
      if options && options.showSuccess?
        showSuccess = options.showSuccess
      showSuccess

    linkFn = (scope, el, attrs, formCtrl) ->
      blurred = false
      options = scope.$eval attrs.showErrors
      showSuccess = getShowSuccess options

      inputEl   = el[0].querySelector("[name]")
      inputNgEl = angular.element(inputEl)
      inputName = inputNgEl.attr('name')
      unless inputName
        throw "show-errors element has no child input elements with a 'name' attribute"

      inputNgEl.bind 'blur', ->
        blurred = true
        toggleClasses formCtrl[inputName].$invalid

      scope.$watch ->
        formCtrl[inputName] && formCtrl[inputName].$invalid
      , (invalid) ->
        return if !blurred
        toggleClasses invalid

      scope.$on 'show-errors-check-validity', ->
        toggleClasses formCtrl[inputName].$invalid

      scope.$on 'show-errors-reset', ->
        $timeout ->
          # want to run this after the current digest cycle
          el.removeClass 'has-error'
          el.removeClass 'has-success'
          blurred = false
        , 0, false

      toggleClasses = (invalid) ->
        el.toggleClass 'has-error', invalid
        if showSuccess
          el.toggleClass 'has-success', !invalid

    {
      restrict: 'A'
      require: '^form'
      compile: (elem, attrs) ->
        unless elem.hasClass 'form-group'
          throw "show-errors element does not have the 'form-group' class"
        linkFn
    }
]

showErrorsModule.provider 'showErrorsConfig', ->
  _showSuccess = false

  @showSuccess = (showSuccess) ->
    _showSuccess = showSuccess

  @$get = ->
    showSuccess: _showSuccess

  return
